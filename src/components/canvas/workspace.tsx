'use client';

import { useEffect, useRef } from 'react';
import { initializeWasm, wasmApi } from '@/lib/wasm-bridge';
import { cn } from '@/lib/utils';

interface CanvasWorkspaceProps {
  showGrid: boolean;
  zoomLevel: number;
}

export function CanvasWorkspace({ showGrid, zoomLevel }: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Initialize the WASM module with the canvas
      initializeWasm(canvas).then((success) => {
        if (success) {
          // Set initial size and start the render loop
          const { width, height } = canvas.getBoundingClientRect();
          wasmApi.initializeCanvas(width, height);
          wasmApi.runRenderLoop();
        }
      });
      
      const handleKeyDown = (event: KeyboardEvent) => wasmApi.onKeyDown(event.key);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleMouseEvent = (handler: (x: number, y: number, button: number) => void) => (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    handler(x, y, event.button);
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    wasmApi.onMouseMove(x, y);
  };

  const gridSize = 20;

  return (
    <main
      className="relative flex-1 cursor-crosshair overflow-hidden bg-muted/40"
      style={
        {
          '--grid-size': `${gridSize}px`,
          '--grid-color': 'hsl(var(--border))',
          '--grid-bg': 'hsl(var(--background))',
        } as React.CSSProperties
      }
    >
      <div className={cn(
        "absolute inset-0 bg-[length:var(--grid-size)_var(--grid-size)]",
        showGrid && "bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)]"
        )}>
        <canvas
            ref={canvasRef}
            className="h-full w-full"
            onMouseDown={handleMouseEvent(wasmApi.onMouseDown)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseEvent(wasmApi.onMouseUp)}
        />
      </div>
    </main>
  );
}
