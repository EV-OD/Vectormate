'use client';

import { useEffect, useRef } from 'react';
import { initializeWasm, wasmApi, loadWasmScript } from '@/lib/wasm-bridge';
import { cn } from '@/lib/utils';

interface CanvasWorkspaceProps {
  showGrid: boolean;
  zoomLevel: number;
}

export function CanvasWorkspace({ showGrid, zoomLevel }: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
            
            console.log(`Setting canvas size to: ${width}x${height}`);
            wasmApi.initializeCanvas(width, height);
            wasmApi.resizeCanvas(width, height);
          };
          
          // Wait a frame to ensure layout is complete
          requestAnimationFrame(() => {
            // Initial size setup
            updateCanvasSize();
            
            // Start the render loop
            wasmApi.runRenderLoop();
            
            // Set initial background
            wasmApi.setCanvasBackground(0.94, 0.94, 0.94, 1.0); // Light gray background
            
            // Log canvas element details for debugging
            console.log('Canvas element:', canvas);
            console.log('Canvas computed style:', window.getComputedStyle(canvas));
            console.log('Canvas position:', canvas.getBoundingClientRect());
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
    
    const handleKeyDown = (event: KeyboardEvent) => wasmApi.onKeyDown(event.key);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      wasmApi.stopRenderLoop();
      resizeObserver?.disconnect();
    };
  }, []); // Empty dependency array - only run once

  // Update grid settings when showGrid changes
  useEffect(() => {
    wasmApi.setGridSettings(showGrid, 20);
  }, [showGrid]);

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
      className="relative flex-1 cursor-crosshair bg-muted/40 h-full"
      style={
        {
          '--grid-size': `${gridSize}px`,
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
              backgroundColor: 'white',
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
