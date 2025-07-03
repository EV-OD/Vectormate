'use client';

import { useEffect, useRef } from 'react';
import { initializeWasm, wasmApi, loadWasmScript } from '@/lib/wasm-bridge';
import useCanvasState from '@/states/canvasStates';

export function CanvasWorkspace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Get setShowGrid and the current showGrid state
  const { showGrid, setShowGrid, gridSize, width, height } = useCanvasState();

  // Initialize WASM module once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isWasmInitialized = false;

    // Load WASM script and initialize the module
    const initializeWasmModule = async () => {
      try {
        await loadWasmScript();
        const success = await initializeWasm(canvas);
        
        if (success) {
          isWasmInitialized = true;
          // Initial size setup from state
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
  }, []); // Empty dependency array - only run once

  // Update grid settings when showGrid or gridSize changes
  useEffect(() => {
    wasmApi.setGridSettings(showGrid, gridSize);
  }, [showGrid, gridSize]);

  // Update canvas size when width or height changes in state
  useEffect(() => {
      // This resize is handled by the settings panel now.
      // wasmApi.resizeCanvas(width, height);
  }, [width, height]);

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
    const key = event.key;
    // Handle UI-related shortcuts in React
    if (key.toLowerCase() === 'g') {
      event.preventDefault(); // Prevent any default browser action for 'g'
      setShowGrid(!showGrid);
      return; // Don't forward to WASM
    }
    
    // Forward all other key events to WASM for canvas manipulation
    wasmApi.onKeyDown(key);
  };


  return (
    <main
      className="relative flex-1 cursor-crosshair bg-muted/40 h-full"
    >
      <div className="absolute inset-0 w-full h-full overflow-auto">
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
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
        />
      </div>
    </main>
  );
}
