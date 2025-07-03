'use client';

import { useEffect, useRef } from 'react';
import { initializeWasm, wasmApi, loadWasmScript } from '@/lib/wasm-bridge';
import useCanvasState from '@/states/canvasStates';

export function CanvasWorkspace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showGrid, setZoomLevel, setShowGrid } = useCanvasState();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isWasmInitialized = false;

    const initializeWasmModule = async () => {
      try {
        await loadWasmScript();
        const success = await initializeWasm(canvas);
        
        if (success) {
          isWasmInitialized = true;
          const { width, height } = useCanvasState.getState();
          wasmApi.initializeCanvas(width, height);
          wasmApi.runRenderLoop();
        }
      } catch (error) {
        console.error('Failed to initialize WASM module:', error);
      }
    };

    initializeWasmModule();
    
    return () => {
      if (isWasmInitialized) {
        wasmApi.stopRenderLoop();
      }
    };
  }, []);

  // Manual event listener for wheel to set passive: false
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const currentZoom = useCanvasState.getState().zoomLevel;
      const newZoom = currentZoom - event.deltaY * 0.1;
      setZoomLevel(newZoom);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [setZoomLevel]);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const key = event.key.toLowerCase();
    
    if (event.target !== event.currentTarget) {
      return; 
    }
    
    if (key === 'g') {
      setShowGrid(!showGrid);
      event.preventDefault(); 
    } else {
      wasmApi.onKeyDown(event.key);
    }
  };

  return (
    <main
      className="relative flex-1 cursor-crosshair bg-muted/40 h-full overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <canvas
            ref={canvasRef}
            id="canvas"
            className="block"
            style={{ 
              border: '1px solid hsl(var(--border))',
              margin: 'auto',
            }}
            onMouseDown={handleMouseEvent(wasmApi.onMouseDown)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseEvent(wasmApi.onMouseUp)}
            onKeyDown={handleKeyDown}
            onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </main>
  );
}
