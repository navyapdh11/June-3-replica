import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useCleaners } from "../../context/CleanersContext";
import { safeLocalStorage as localStorage } from "../../utils/storageFallback";

interface TeamDispatchChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamDispatchChat: React.FC<TeamDispatchChatProps> = ({
  isOpen,
  onClose,
}) => {
  const { cleaners, activeCleanerName, daylightHighContrast, onTriggerLog } = useCleaners();
  const [teamNotes, setTeamNotes] = useState<Array<{ id: string; sender: string; message: string; timestamp: string }>>(() => {
    try {
      const saved = localStorage.getItem("aastaclean_team_chat_notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [chatInputText, setChatInputText] = useState("");

  const activeCleaner = cleaners.find((c) => c.name === activeCleanerName);

  const handleSendTeamNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    const newNote = {
      id: `chat_${Date.now()}`,
      sender: activeCleaner?.name || "System Dispatch",
      message: chatInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    const updated = [...teamNotes, newNote];
    setTeamNotes(updated);
    localStorage.setItem("aastaclean_team_chat_notes", JSON.stringify(updated));
    setChatInputText("");
    
    onTriggerLog({
      id: Math.random().toString(),
      type: "system",
      status: "success",
      message: `💬 Handover notes update: Team dispatch notice added by "${activeCleaner?.name}" successfully.`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0 ${
        daylightHighContrast ? "bg-white border-l-2 border-black text-black" : "bg-slate-900 border-l border-slate-800/80 text-white"
      }`}>
        <div className="p-4.5 border-b border-slate-800/70 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Crew Shift-Handover Chat</h3>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Active Dispatch Group Alpha</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer ${daylightHighContrast ? "text-black hover:bg-zinc-200" : "text-slate-400 hover:text-white"}`}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {teamNotes.map((note) => (
            <div 
              key={note.id} 
              className={`p-3 rounded-2xl border transition-all ${
                daylightHighContrast 
                  ? "bg-zinc-50 border-black" 
                  : "bg-slate-950 border-slate-850"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-1 font-mono">
                <span className="text-indigo-400">{note.sender}</span>
                <span>{note.timestamp}</span>
              </div>
              <p className={`text-xs font-semibold leading-relaxed ${daylightHighContrast ? "text-black" : "text-slate-300"}`}>
                {note.message}
              </p>
            </div>
          ))}
        </div>

        <form 
          onSubmit={handleSendTeamNote}
          className="p-4 border-t border-slate-800/80 shrink-0 space-y-2"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a hand-over message or shift-note..."
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              className={`flex-1 p-2.5 text-xs rounded-xl font-sans outline-none border transition-all ${
                daylightHighContrast
                  ? "bg-white border-black text-black font-extrabold"
                  : "bg-slate-950 border-slate-805 text-white placeholder-slate-550 focus:border-indigo-500"
              }`}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold p-2 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30"
            >
              Send Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
