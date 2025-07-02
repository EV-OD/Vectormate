
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
            if (size > 0) {
                wasmApi.setGridSettings(showGrid, size);
                set({ gridSize: size });
            }
        },
    }
));

export default useCanvasState;
