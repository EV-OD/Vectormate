'use client';

import { useEffect, useRef } from 'react';
import { initializeWasm, wasmApi, loadWasmScript } from '@/lib/wasm-bridge';
import useCanvasState from '@/states/canvasStates';

export function CanvasWorkspace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showGrid, gridSize, width, height, setZoomLevel, zoomLevel } = useCanvasState();

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

  useEffect(() => {
    wasmApi.setGridSettings(showGrid, gridSize);
  }, [showGrid, gridSize]);

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
    wasmApi.onKeyDown(event.key);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const newZoom = zoomLevel - event.deltaY * 0.1;
    setZoomLevel(newZoom);
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
            width={width}
            height={height}
            style={{ 
              border: '1px solid hsl(var(--border))',
              margin: 'auto', // Center the canvas
            }}
            onMouseDown={handleMouseEvent(wasmApi.onMouseDown)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseEvent(wasmApi.onMouseUp)}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </main>
  );
}
