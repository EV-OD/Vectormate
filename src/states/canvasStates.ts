import { wasmApi } from '@/lib/wasm-bridge';
import { create } from 'zustand'

interface canvasState {
    bgColor: number[];
    setBg: (rgba: number[]) => void;

}

const useCanvasState = create<canvasState>((set) => (
    {
        bgColor: [255, 255, 255, 1],
        setBg(rgba) {
            wasmApi.setCanvasBackground(rgba[0], rgba[1], rgba[2], rgba[3]*255);
            return set({
                bgColor: rgba,
            })
        }

    }
));

export default useCanvasState;