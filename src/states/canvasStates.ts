
import { wasmApi } from '@/lib/wasm-bridge';
import { create } from 'zustand'

interface CanvasState {
    bgColor: number[];
    setBg: (rgba: number[]) => void;
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
    gridSize: number;
    setGridSize: (size: number) => void;
}

const useCanvasState = create<CanvasState>((set, get) => (
    {
        bgColor: [240, 240, 240, 1],
        setBg(rgba) {
            wasmApi.setCanvasBackground(rgba[0], rgba[1], rgba[2], rgba[3] * 255);
            set({ bgColor: rgba });
        },
        
        showGrid: true,
        setShowGrid(show) {
            const { gridSize } = get();
            wasmApi.setGridSettings(show, gridSize);
            set({ showGrid: show });
        },

        gridSize: 20,
        setGridSize(size) {
            const { showGrid } = get();
            // Always update the state to reflect the input's value.
            // This prevents the input from snapping back to the old value.
            set({ gridSize: size });

            // Only call the wasm function with a valid, positive grid size.
            if (size > 0) {
                wasmApi.setGridSettings(showGrid, size);
            }
        },
    }
));

export default useCanvasState;
