import React, { useRef, useState, useEffect } from "react";
import { PenTool, CheckCircle2 } from "lucide-react";
import { useCleaners } from "../../context/CleanersContext";

interface JobSignatureModalProps {
  signingJobId: string | null;
  onClose: () => void;
  onSubmit: (signatureDataUrl: string) => void;
}

export const JobSignatureModal: React.FC<JobSignatureModalProps> = ({
  signingJobId,
  onClose,
  onSubmit,
}) => {
  const { daylightHighContrast } = useCleaners();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (signingJobId && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
      }
    }
  }, [signingJobId]);

  if (!signingJobId) return null;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL("image/png");
    onSubmit(signatureDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 font-mono text-slate-100 shadow-2xl relative">
        <div className="text-center">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest block w-fit mx-auto">
            Electronic Client Signature Capture
          </span>
          <h3 className="text-lg font-black text-white tracking-widest uppercase mt-4">
            Verify Job Completion
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Please instruct the client to draw their signature on the pad below to verify completion under ISO 9001 guidelines.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5" /> Client Sign-off Pad (Mouse/Touch active):
            </span>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline outline-none"
            >
              Clear Pad
            </button>
          </div>

          <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-800 bg-white relative">
            <canvas
              ref={canvasRef}
              width={460}
              height={176}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={() => setIsDrawing(false)}
              className="w-full h-full cursor-crosshair block"
            />
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-400 font-bold py-3 rounded-xl border border-slate-805 transition-all text-center cursor-pointer"
          >
            Cancel Verify
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl border border-indigo-500 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Complete
          </button>
        </div>
      </div>
    </div>
  );
};
