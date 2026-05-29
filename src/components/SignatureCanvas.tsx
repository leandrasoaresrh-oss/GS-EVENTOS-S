import React, { useRef, useState, useEffect } from "react";
import { RotateCcw, Paintbrush, FileSignature } from "lucide-react";

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  width?: number;
  height?: number;
  label?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ 
  onSave, 
  width = 460, 
  height = 160,
  label = "Assinatura Digital / Desenho em tela"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Resize handler to make canvas fully responsive
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set styles
    ctx.strokeStyle = "#1E293B"; // slate-800
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Detect theme and change brush color if dark mode
    const isDark = document.documentElement.classList.contains("dark");
    ctx.strokeStyle = isDark ? "#E2E8F0" : "#1F2937";
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveSignature();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onSave("");
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div ref={containerRef} className="space-y-2 w-full font-sans">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
          <FileSignature size={12} className="text-orange-500" />
          <span>{label}</span>
        </label>
        {!isEmpty && (
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-[9px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded transition-all cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>LIMPAR TELA</span>
          </button>
        )}
      </div>

      <div className="relative border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xs">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full touch-none cursor-crosshair block"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-650 pointer-events-none select-none">
            <Paintbrush size={22} className="mb-1 opacity-50 stroke-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Desenhe sua assinatura aqui</span>
          </div>
        )}
      </div>
    </div>
  );
};
