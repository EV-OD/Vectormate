
'use client';

import { useEffect, useRef } from 'react';
import { initializeWasm, wasmApi, loadWasmScript } from '@/lib/wasm-bridge';
import { cn } from '@/lib/utils';
import useCanvasState from '@/states/canvasStates';

interface CanvasWorkspaceProps {
  zoomLevel: number;
}

export function CanvasWorkspace({ zoomLevel }: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showGrid, gridSize } = useCanvasState();

  // Initialize WASM module once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeObserver: ResizeObserver | null = null;

    // Load WASM script and initialize the module
    const initializeWasmModule = async () => {
      try {
        await loadWasmScript();
        const success = await initializeWasm(canvas);
        
        if (success) {
          // Wait for the canvas to be properly sized
          const updateCanvasSize = () => {
            const rect = canvas.getBoundingClientRect();
            const width = Math.max(rect.width, 800); // Minimum width
            const height = Math.max(rect.height, 600); // Minimum height
            
            // Set canvas internal resolution to match display size
            canvas.width = width;
            canvas.height = height;
            
            wasmApi.initializeCanvas(width, height);
            wasmApi.resizeCanvas(width, height);
          };
          
          // Wait a frame to ensure layout is complete
          requestAnimationFrame(() => {
            // Initial size setup
            updateCanvasSize();
            
            // Start the render loop
            wasmApi.runRenderLoop();
          });
          
          // Add resize observer to handle canvas resizing
          resizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
          });
          resizeObserver.observe(canvas);
        }
      } catch (error) {
        console.error('Failed to initialize WASM module:', error);
      }
    };

    initializeWasmModule();
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // If the event originates from inside an interactive panel, let the panel handle it.
      // Do not send the event to the WASM module.
      if (target.closest('[data-interactive-panel="true"]')) {
        return;
      }

      // Otherwise, the event is for the canvas
      wasmApi.onKeyDown(event.key);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      wasmApi.stopRenderLoop();
      resizeObserver?.disconnect();
    };
  }, []); // Empty dependency array - only run once

  // Update grid settings when showGrid or gridSize changes
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

  const cssGridSize = 20;

  return (
    <main
      className="relative flex-1 cursor-crosshair bg-muted/40 h-full"
      style={
        {
          '--grid-size': `${cssGridSize}px`,
          '--grid-color': 'hsl(var(--border))',
          '--grid-bg': 'hsl(var(--background))',
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 w-full h-full">
        <canvas
            ref={canvasRef}
            id="canvas"
            className="w-full h-full block"
            style={{ 
              minHeight: '400px',
              minWidth: '600px',
              display: 'block',
              border: '1px solid #ddd'
            }}
            onMouseDown={handleMouseEvent(wasmApi.onMouseDown)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseEvent(wasmApi.onMouseUp)}
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
        />
      </div>
    </main>
  );
}
