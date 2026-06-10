import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { safeLocalStorage as localStorage } from "../../utils/storageFallback";
import { useCleaners } from "../../context/CleanersContext";
import {
  getOfflineDBSizeInBytes,
  getSignatureFromDB,
  getPhotosFromDB,
  clearAllJobAssetsFromDB,
} from "../../utils/indexedDb";

interface OfflineSyncManagerProps {
  onSyncQueueChange?: (queue: any[]) => void;
}

export const OfflineSyncManager: React.FC<OfflineSyncManagerProps> = ({
  onSyncQueueChange,
}) => {
  const { quotes, onUpdateQuote, onTriggerLog, daylightHighContrast } = useCleaners();
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("aastaclean_offline_sync_queue");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [idbStats, setIdbStats] = useState<{ signatures: number; photos: number; sizeFormatted: string } | null>(null);
  const [syncHistory, setSyncHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("aastaclean_sync_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const queryIdbStats = async () => {
    try {
      const sizeObj = await getOfflineDBSizeInBytes();
      let formatted = "0 B";
      if (sizeObj.total > 1024 * 1024) {
        formatted = `${(sizeObj.total / (1024 * 1024)).toFixed(2)} MB`;
      } else if (sizeObj.total > 1024) {
        formatted = `${(sizeObj.total / 1024).toFixed(1)} KB`;
      } else {
        formatted = `${sizeObj.total} B`;
      }
      setIdbStats({
        signatures: sizeObj.signatures,
        photos: sizeObj.photos,
        sizeFormatted: formatted
      });
    } catch (err) {
      console.warn("Failed fetching IndexedDB storage stats:", err);
    }
  };

  useEffect(() => {
    const bootstrapAndInflate = async () => {
      await queryIdbStats();
      const saved = localStorage.getItem("aastaclean_offline_sync_queue");
      if (!saved) return;
      try {
        const thinQueue = JSON.parse(saved);
        if (thinQueue.length === 0) return;

        const inflated = await Promise.all(thinQueue.map(async (item: any) => {
          if (item.type === "signature_complete") {
            if (item.payload.clientSignature === "indexeddb_ref") {
              const sig = await getSignatureFromDB(item.quoteId);
              if (sig) item.payload.clientSignature = sig;
            }
          } else if (item.type === "photo_upload") {
            const dbBeforePhotos = await getPhotosFromDB(item.quoteId, "before");
            const dbAfterPhotos = await getPhotosFromDB(item.quoteId, "after");
            let beforeIdx = 0, afterIdx = 0;
            if (item.payload.beforePhotos) {
              item.payload.beforePhotos = item.payload.beforePhotos.map((p: string) => 
                p === "indexeddb_ref" ? (dbBeforePhotos[beforeIdx++]?.dataUrl || p) : p
              );
            }
            if (item.payload.afterPhotos) {
              item.payload.afterPhotos = item.payload.afterPhotos.map((p: string) => 
                p === "indexeddb_ref" ? (dbAfterPhotos[afterIdx++]?.dataUrl || p) : p
              );
            }
          }
          return item;
        }));
        setOfflineSyncQueue(inflated);
      } catch (err) {
        console.warn("Offline queue inflation failure:", err);
      }
    };
    bootstrapAndInflate();
  }, []);

  useEffect(() => {
    if (onSyncQueueChange) onSyncQueueChange(offlineSyncQueue);
  }, [offlineSyncQueue, onSyncQueueChange]);

  const triggerSyncQueueDispatch = async (currentQueue = offlineSyncQueue) => {
    if (currentQueue.length === 0) return;
    onTriggerLog({
      id: `sync_start_${Date.now()}`,
      type: "api",
      status: "info",
      message: `🔄 Service Worker Sync: Restoring connectivity. Drain queue of (${currentQueue.length}) actions...`,
      timestamp: new Date().toLocaleTimeString(),
    });

    try {
      const inflatedQueue = await Promise.all(currentQueue.map(async (item) => {
        const clonedItem = JSON.parse(JSON.stringify(item));
        if (clonedItem.type === "signature_complete" && clonedItem.payload.clientSignature === "indexeddb_ref") {
          const sig = await getSignatureFromDB(clonedItem.quoteId);
          if (sig) clonedItem.payload.clientSignature = sig;
        } else if (clonedItem.type === "photo_upload") {
          const dbBeforePhotos = await getPhotosFromDB(clonedItem.quoteId, "before");
          const dbAfterPhotos = await getPhotosFromDB(clonedItem.quoteId, "after");
          let beforeIdx = 0, afterIdx = 0;
          if (clonedItem.payload.beforePhotos) {
            clonedItem.payload.beforePhotos = clonedItem.payload.beforePhotos.map((p: string) => 
              p === "indexeddb_ref" ? (dbBeforePhotos[beforeIdx++]?.dataUrl || p) : p
            );
          }
          if (clonedItem.payload.afterPhotos) {
            clonedItem.payload.afterPhotos = clonedItem.payload.afterPhotos.map((p: string) => 
              p === "indexeddb_ref" ? (dbAfterPhotos[afterIdx++]?.dataUrl || p) : p
            );
          }
        }
        return clonedItem;
      }));

      setTimeout(() => {
        const collapsed: Record<string, any> = {};
        inflatedQueue.forEach(item => {
          collapsed[item.quoteId] = { ...collapsed[item.quoteId], ...item.payload };
        });

        Object.keys(collapsed).forEach(quoteId => {
          const payload = collapsed[quoteId];
          const baseQuote = quotes.find(q => q.id === quoteId);
          if (baseQuote) onUpdateQuote({ ...baseQuote, ...payload });
        });

        inflatedQueue.forEach(item => clearAllJobAssetsFromDB(item.quoteId));
        setOfflineSyncQueue([]);
        localStorage.setItem("aastaclean_offline_sync_queue", JSON.stringify([]));
        queryIdbStats();
        
        onTriggerLog({
          id: `sync_success_${Date.now()}`,
          type: "api",
          status: "success",
          message: `🚀 Service Worker Sync Success: Reintegrated ${inflatedQueue.length} transactions.`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }, 1100);
    } catch (err) {
      console.error("Sync failure:", err);
    }
  };

  useEffect(() => {
    const handleOnline = () => triggerSyncQueueDispatch();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [offlineSyncQueue]);

  return (
    <div className="flex flex-wrap gap-2">
      <div className={`p-2 px-3 border rounded-xl flex items-center gap-2 transition-all duration-300 ${
        offlineSyncQueue.length > 5
          ? "bg-rose-500/20 border-rose-500 text-rose-550 font-extrabold animate-pulse ring-2 ring-rose-500/30"
          : offlineSyncQueue.length > 0 
            ? "bg-amber-500/10 border-amber-500/30 text-amber-505 font-extrabold animate-pulse" 
            : daylightHighContrast 
              ? "bg-zinc-100 border-black text-black" 
              : "bg-slate-950 border-slate-850 text-slate-500"
      }`}>
        <RefreshCw className={`w-3.5 h-3.5 ${offlineSyncQueue.length > 0 ? "animate-spin" : ""} ${offlineSyncQueue.length > 5 ? "text-rose-500 animate-bounce" : ""}`} />
        <span className="text-[10px] tracking-wide uppercase font-mono">
          {offlineSyncQueue.length > 5 ? "⚠️ BACKLOG: " : "QUEUE: "}{offlineSyncQueue.length} PENDING
        </span>
      </div>

      {idbStats && (idbStats.signatures > 0 || idbStats.photos > 0) && (
        <div className={`p-2 px-3 border rounded-xl flex items-center gap-2 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-extrabold`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-mono">
            IndexedDB: {idbStats.sizeFormatted} Archived
          </span>
        </div>
      )}
    </div>
  );
};
