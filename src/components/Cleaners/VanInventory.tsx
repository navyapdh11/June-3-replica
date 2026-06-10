import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { safeLocalStorage as localStorage } from "../../utils/storageFallback";
import { useCleaners } from "../../context/CleanersContext";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  minQty: number;
  unit: string;
  maxQty: number;
}

export const VanInventory: React.FC = () => {
  const { activeCleanerName, daylightHighContrast, onTriggerLog } = useCleaners();
  const [vanInventory, setVanInventory] = useState<Record<string, InventoryItem[]>>(() => {
    try {
      const saved = localStorage.getItem("aastaclean_van_inventory_by_cleaner");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [newInvName, setNewInvName] = useState("");
  const [newInvCategory, setNewInvCategory] = useState("Chemicals");
  const [newInvQty, setNewInvQty] = useState(5);
  const [newInvMinQty, setNewInvMinQty] = useState(2);
  const [newInvUnit, setNewInvUnit] = useState("units");
  const [showAddInvForm, setShowAddInvForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("aastaclean_van_inventory_by_cleaner", JSON.stringify(vanInventory));
    } catch (e) {
      console.error("Local storage inventory save failure:", e);
    }
  }, [vanInventory]);

  const getCleanerInventory = (cleanerName: string) => {
    if (vanInventory[cleanerName]) {
      return vanInventory[cleanerName];
    }
    return [
      { id: "inv_sanitizer", name: "HACCP Sanitizer Bottles", category: "Chemicals", qty: 6, minQty: 3, unit: "bottles", maxQty: 12 },
      { id: "inv_hepa", name: "M-Class HEPA Filters", category: "Hardware", qty: 1, minQty: 2, unit: "units", maxQty: 4 },
      { id: "inv_microfibre", name: "Microfibre Cloths", category: "Supplies", qty: 14, minQty: 10, unit: "packs", maxQty: 25 },
      { id: "inv_abrasive", name: "Dual-Action Scrubbing Pads", category: "Supplies", qty: 3, minQty: 5, unit: "pads", maxQty: 10 },
      { id: "inv_neutral", name: "pH Neutral Detergent (5L)", category: "Chemicals", qty: 4, minQty: 2, unit: "tubs", maxQty: 8 }
    ];
  };

  const adjustInventoryQty = (cleanerName: string, itemId: string, delta: number) => {
    const currentList = [...getCleanerInventory(cleanerName)];
    const updatedList = currentList.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, Math.min(item.maxQty || 100, item.qty + delta));
        return { ...item, qty: newQty };
      }
      return item;
    });

    setVanInventory(prev => ({ ...prev, [cleanerName]: updatedList }));

    const targetItem = currentList.find(i => i.id === itemId);
    if (targetItem) {
      const action = delta > 0 ? "Restocked" : "Used";
      onTriggerLog({
        id: `inventory_log_${Date.now()}`,
        type: "system",
        status: delta > 0 ? "success" : "info",
        message: `🚚 [VAN-INVENTORY] ${action} ${Math.abs(delta)} ${targetItem.unit} of ${targetItem.name}. Current stock: ${Math.max(0, targetItem.qty + delta)} ${targetItem.unit}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const addInventoryItem = (cleanerName: string) => {
    if (!newInvName.trim()) return;
    const currentList = [...getCleanerInventory(cleanerName)];
    const newItem = {
      id: `inv_custom_${Date.now()}`,
      name: newInvName.trim(),
      category: newInvCategory,
      qty: Number(newInvQty) || 1,
      minQty: Number(newInvMinQty) || 1,
      unit: newInvUnit.trim() || "units",
      maxQty: Math.max(Number(newInvQty) * 3, 50)
    };

    setVanInventory(prev => ({ ...prev, [cleanerName]: [...currentList, newItem] }));

    onTriggerLog({
      id: `inventory_log_${Date.now()}`,
      type: "system",
      status: "success",
      message: `🚚 [VAN-INVENTORY] Added new supply item: '${newItem.name}' to Van Loadout list.`,
      timestamp: new Date().toLocaleTimeString()
    });

    setNewInvName("");
    setNewInvQty(5);
    setNewInvMinQty(2);
    setNewInvUnit("units");
    setShowAddInvForm(false);
  };

  const reorderAllLowItems = (cleanerName: string) => {
    const currentList = getCleanerInventory(cleanerName);
    const lowItems = currentList.filter(item => item.qty <= item.minQty);
    
    if (lowItems.length === 0) {
      onTriggerLog({
        id: `inventory_log_${Date.now()}`,
        type: "system",
        status: "info",
        message: `🚚 [VAN-INVENTORY] No auto-reorders required. Van supply stock is fully coherent and above compliance benchmarks.`,
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    const updatedList = currentList.map(item => {
      if (item.qty <= item.minQty) {
        return { ...item, qty: item.maxQty || (item.minQty * 3) };
      }
      return item;
    });

    setVanInventory(prev => ({ ...prev, [cleanerName]: updatedList }));

    onTriggerLog({
      id: `inventory_log_${Date.now()}`,
      type: "system",
      status: "success",
      message: `🚚 [AUTO-REORDER] Automated restocking sequence completed for ${lowItems.length} low supplies: ${lowItems.map(i => i.name).join(", ")}.`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const updateInventoryThreshold = (cleanerName: string, itemId: string, newMinQty: number) => {
    const currentList = [...getCleanerInventory(cleanerName)];
    const updatedList = currentList.map(item => {
      if (item.id === itemId) {
        return { ...item, minQty: Math.max(0, newMinQty) };
      }
      return item;
    });

    setVanInventory(prev => ({ ...prev, [cleanerName]: updatedList }));
  };

  const currentInventory = getCleanerInventory(activeCleanerName);

  return (
    <div className={`p-4 rounded-2xl border flex flex-col gap-3.5 transition-all ${
      daylightHighContrast 
        ? "bg-zinc-100 border-black text-black" 
        : "bg-slate-950 border-slate-850"
    }`}>
      <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-800">
        <div>
          <span className={`text-[9px] uppercase font-bold text-indigo-400 block tracking-widest ${daylightHighContrast ? "text-zinc-650 font-black" : ""}`}>Mobile Assets</span>
          <h4 className={`text-xs font-semibold ${daylightHighContrast ? "text-black font-black" : "text-white"} flex items-center gap-1.5`}>
            <Truck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Van Supply Inventory</span>
          </h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => reorderAllLowItems(activeCleanerName)}
            className={`text-[9px] font-black p-1 px-2 rounded border transition-all uppercase tracking-wider flex items-center gap-1 cursor-pointer ${
              daylightHighContrast 
                ? "bg-black text-white hover:bg-zinc-900 border-[#000]" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            Restock Low
          </button>
          <button
            type="button"
            onClick={() => setShowAddInvForm(!showAddInvForm)}
            className={`text-[11px] font-black w-5 h-5 rounded border transition-all flex items-center justify-center cursor-pointer ${
              daylightHighContrast
                ? "bg-black text-white border-black"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
          >
            {showAddInvForm ? "×" : "+"}
          </button>
        </div>
      </div>

      {showAddInvForm && (
        <div className={`p-3 rounded-xl border space-y-2.5 ${
          daylightHighContrast 
            ? "bg-white border-black" 
            : "bg-slate-900/50 border-slate-800"
        }`}>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Supply Name</label>
              <input
                type="text"
                value={newInvName}
                onChange={(e) => setNewInvName(e.target.value)}
                placeholder="e.g. Mask Respirators"
                className={`w-full px-2 py-1 rounded text-[10px] ${
                  daylightHighContrast 
                    ? "bg-zinc-200 border border-black text-black" 
                    : "bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Category</label>
              <select
                value={newInvCategory}
                onChange={(e) => setNewInvCategory(e.target.value)}
                className={`w-full px-2 py-1 rounded text-[10px] ${
                  daylightHighContrast 
                    ? "bg-zinc-200 border border-black text-black" 
                    : "bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                }`}
              >
                <option value="Chemicals">Chemicals</option>
                <option value="Hardware">Hardware</option>
                <option value="Supplies">Supplies</option>
                <option value="PPE">PPE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Stock At Hand</label>
              <input
                type="number"
                value={newInvQty}
                min={0}
                onChange={(e) => setNewInvQty(Math.max(0, parseInt(e.target.value) || 0))}
                className={`w-full px-2 py-1 rounded text-[10px] ${
                  daylightHighContrast 
                    ? "bg-zinc-200 border border-black text-black" 
                    : "bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Order Threshold</label>
              <input
                type="number"
                value={newInvMinQty}
                min={0}
                onChange={(e) => setNewInvMinQty(Math.max(0, parseInt(e.target.value) || 0))}
                className={`w-full px-2 py-1 rounded text-[10px] ${
                  daylightHighContrast 
                    ? "bg-zinc-200 border border-black text-black" 
                    : "bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Unit Metric</label>
              <input
                type="text"
                value={newInvUnit}
                onChange={(e) => setNewInvUnit(e.target.value)}
                placeholder="e.g. bottles"
                className={`w-full px-2 py-1 rounded text-[10px] ${
                  daylightHighContrast 
                    ? "bg-zinc-200 border border-black text-black" 
                    : "bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                }`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => addInventoryItem(activeCleanerName)}
            className={`w-full py-1.5 rounded transition-all text-[9.5px] font-bold uppercase cursor-pointer ${
              daylightHighContrast 
                ? "bg-black text-white" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold"
            }`}
          >
            Provision Asset Item
          </button>
        </div>
      )}

      <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
        {currentInventory.map((item) => {
          const isLow = item.qty <= item.minQty;
          return (
            <div 
              key={item.id} 
              className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                isLow 
                  ? (daylightHighContrast ? "bg-amber-50 border-amber-500 animate-low-stock-pulse" : "bg-red-950/20 border-red-500/50 animate-low-stock-pulse")
                  : (daylightHighContrast ? "bg-white border-zinc-200" : "bg-slate-900/40 border-slate-800/80")
              }`}
            >
              <div className="flex justify-between items-start gap-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10.5px] font-bold ${daylightHighContrast ? "text-black" : "text-slate-100"}`}>
                      {item.name}
                    </span>
                    {isLow && (
                      <span className="text-[7.5px] px-1.5 py-0.2 rounded font-black uppercase bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse shrink-0">
                        🚨 LOW STOCK
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase font-mono block">
                    Manning Unit load: {item.qty} / {item.maxQty || 20} {item.unit}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 select-none">
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Order Trigger:
                    </span>
                    <input
                      type="number"
                      value={item.minQty}
                      onChange={(e) => updateInventoryThreshold(activeCleanerName, item.id, parseInt(e.target.value) || 0)}
                      className={`w-8 py-0 px-1 text-center rounded text-[8px] font-mono leading-tight outline-none ${
                        daylightHighContrast
                          ? "bg-zinc-200 border border-black text-black"
                          : "bg-slate-950 border border-slate-800 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => adjustInventoryQty(activeCleanerName, item.id, -1)}
                    className={`p-1 rounded cursor-pointer transition-all ${
                      daylightHighContrast ? "bg-zinc-200 text-black border border-black" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustInventoryQty(activeCleanerName, item.id, 1)}
                    className={`p-1 rounded cursor-pointer transition-all ${
                      daylightHighContrast ? "bg-black text-white" : "bg-slate-700 text-white"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
