import { wasmApi } from '@/lib/wasm-bridge';
import { create } from 'zustand'

interface CanvasState {
    // Dimensions
    width: number;
    height: number;
    setSize: (width: number, height: number) => void;
    
    // Appearance
    bgColor: number[];
    setBg: (rgba: number[]) => void;
    
    // Grid
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
    gridSize: number;
    setGridSize: (size: number) => void;

    // Viewport
    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;
    zoomAtPoint: (zoom: number, x: number, y: number) => void;
}

const useCanvasState = create<CanvasState>((set, get) => (
    {
        // Dimensions
        width: 1920,
        height: 1080,
        setSize(width, height) {
            const w = Math.max(width, 1);
            const h = Math.max(height, 1);
            wasmApi.resizeCanvas(w, h);
            set({ width: w, height: h });
        },
        
        // Appearance
        bgColor: [240, 240, 240, 1],
        setBg(rgba) {
            wasmApi.setCanvasBackground(rgba[0], rgba[1], rgba[2], rgba[3] * 255);
            set({ bgColor: rgba });
        },
        
        // Grid
        showGrid: true,
        setShowGrid(show) {
            const { gridSize } = get();
            wasmApi.setGridSettings(show, gridSize);
            set({ showGrid: show });
        },
        gridSize: 20,
        setGridSize(size) {
            const { showGrid } = get();
            set({ gridSize: size });
            if (size > 0) {
                wasmApi.setGridSettings(showGrid, size);
            }
        },

        // Viewport
        zoomLevel: 100,
        setZoomLevel(zoom) {
            const newZoom = Math.max(10, Math.min(zoom, 1000));
            wasmApi.setZoomLevel(newZoom);
            set({ zoomLevel: newZoom });
        },
        zoomAtPoint(zoom, x, y) {
            const newZoom = Math.max(10, Math.min(zoom, 1000));
            wasmApi.zoomAtPoint(newZoom, x, y);
            set({ zoomLevel: newZoom });
        },
    }
));

export default useCanvasState;
