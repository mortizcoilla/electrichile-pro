'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  /** DataURL actual (controlado) */
  value?: string;
  /** Callback con el dataURL al terminar un trazo */
  onChange: (dataUrl: string | undefined) => void;
  /** Ancho del canvas (default 100%) */
  height?: number;
  /** Label arriba del pad */
  label?: string;
}

/**
 * Pad de firma digital con canvas HTML5.
 * Soporta mouse y touch. Devuelve un dataURL PNG al hacer `onChange`.
 */
export default function SignaturePad({ value, onChange, height = 160, label }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#f8fafc'; // foreground
    ctx.lineWidth = 2.5;
  }, []);

  const getPoint = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0] || e.changedTouches[0];
      if (!t) return null;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const p = getPoint(e);
    if (!p) return;
    drawing.current = true;
    last.current = p;
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const p = getPoint(e);
    if (!ctx || !p || !last.current) return;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasContent) setHasContent(true);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    const canvas = canvasRef.current;
    if (canvas && hasContent) onChange(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}
      <div
        className="relative rounded-xl border border-border bg-elevated overflow-hidden"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-muted-foreground">Firme aquí</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="flex-1 h-9 rounded-lg border border-border bg-elevated text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
          type="button"
        >
          <Eraser className="w-3.5 h-3.5" />
          Borrar
        </button>
        {hasContent && (
          <div className="flex-1 h-9 rounded-lg bg-accent-success/15 text-xs text-accent-success border border-accent-success/30 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Firmado
          </div>
        )}
      </div>
    </div>
  );
}
