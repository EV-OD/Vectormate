// This file acts as a bridge between the React frontend and the C++ WASM module.
// It will be responsible for loading the WASM module, wrapping its exported
// functions, and providing a clean API for the rest of the application.

// Type definitions
interface WasmModule {
  ccall: (funcName: string, returnType: string, argTypes: string[], args: any[]) => any;
  cwrap: (funcName: string, returnType: string, argTypes: string[]) => (...args: any[]) => any;
  canvas: HTMLCanvasElement;
}

interface WasmApi {
  initialize_canvas: (width: number, height: number) => void;
  render: () => void;
  on_mouse_down: (x: number, y: number, button: number) => void;
  on_mouse_move: (x: number, y: number) => void;
  on_mouse_up: (x: number, y: number, button: number) => void;
  on_key_down: (key: string) => void;
  resize_canvas: (new_width: number, new_height: number) => void;
  set_canvas_background: (r: number, g: number, b: number, a: number) => void;
  set_grid_settings: (show: boolean, size: number) => void;
  set_zoom_level: (zoom: number) => void;
}

// Global state
let wasmInstance: WasmModule | null = null;
let renderLoopId: number | null = null;
let isInitialized = false;

// Placeholder functions for when WASM is not loaded
const placeholderApi: WasmApi = {
  initialize_canvas: (width: number, height: number) => {
    console.log(`PLACEHOLDER: initialize_canvas(${width}, ${height}) - WASM not loaded`);
  },
  render: () => {
    // In a real-world scenario, this function in C++ would be filled
    // with WebGL calls to draw the scene.
  },
  on_mouse_down: (x: number, y: number, button: number) => console.log(`PLACEHOLDER: on_mouse_down(${x}, ${y}, ${button}) - WASM not loaded`),
  on_mouse_move: (x: number, y: number) => { /* Do nothing */ },
  on_mouse_up: (x: number, y: number, button: number) => console.log(`PLACEHOLDER: on_mouse_up(${x}, ${y}, ${button}) - WASM not loaded`),
  on_key_down: (key: string) => console.log(`PLACEHOLDER: on_key_down(${key}) - WASM not loaded`),
  resize_canvas: (new_width: number, new_height: number) => {
    console.log(`PLACEHOLDER: resize_canvas(${new_width}, ${new_height}) - WASM not loaded`);
  },
  set_canvas_background: (r: number, g: number, b: number, a: number) => console.log(`PLACEHOLDER: set_canvas_background(${r}, ${g}, ${b}, ${a}) - WASM not loaded`),
  set_grid_settings: (show: boolean, size: number) => console.log(`PLACEHOLDER: set_grid_settings(${show}, ${size}) - WASM not loaded`),
  set_zoom_level: (zoom: number) => console.log(`PLACEHOLDER: set_zoom_level(${zoom}) - WASM not loaded`),
};

// Current API - starts with placeholders, gets replaced when WASM loads
let currentApi: WasmApi = { ...placeholderApi };

/**
 * Loads and initializes the WebAssembly module.
 * @param canvas - The HTMLCanvasElement to which the WASM module will render.
 * @returns {Promise<boolean>} - True if initialization is successful.
 */
export async function initializeWasm(canvas: HTMLCanvasElement): Promise<boolean> {
  if (isInitialized) {
    return true;
  }

  try {
    // === SETUP CANVAS FOR SDL2 + WEB UI ===
    canvas.id = 'canvas';
    // The canvas needs a tabindex to be focusable, which is required for it
    // to receive keyboard events.
    canvas.setAttribute('tabindex', '0');
    canvas.style.outline = 'none'; // remove browser focus ring

    // Let canvas gain focus on click so it can receive keyboard events.
    canvas.addEventListener('click', () => canvas.focus());


    // === LOAD WASM MODULE ===
    const VectorMateModule = (window as any).VectorMateModule;

    if (!VectorMateModule) {
      console.log("VectorMateModule not found. Using placeholder API.");
      currentApi = placeholderApi;
      return true;
    }

    wasmInstance = await VectorMateModule({
      canvas: canvas,
      onRuntimeInitialized: () => {
        // This is a bit of a race condition fix, we set a flag here
        // but the main promise resolves below.
      },
      print: (text: string) => { console.log(text) },
      printErr: (text: string) => { console.error(text) }
    });

    if (!wasmInstance) {
      console.error("Failed to initialize WASM module");
      return false;
    }

    // Wait for runtime to be fully initialized
    await new Promise<void>((resolve) => {
        const check = () => {
            if (wasmInstance?.calledRun) {
                resolve();
            } else {
                setTimeout(check, 50);
            }
        };
        check();
    });

    // Wrap exported functions
    const wrappedFunctions: WasmApi = {
      initialize_canvas: wasmInstance.cwrap('initialize_canvas', 'void', ['number', 'number']),
      render: wasmInstance.cwrap('render', 'void', []),
      on_mouse_down: wasmInstance.cwrap('on_mouse_down', 'void', ['number', 'number', 'number']),
      on_mouse_move: wasmInstance.cwrap('on_mouse_move', 'void', ['number', 'number']),
      on_mouse_up: wasmInstance.cwrap('on_mouse_up', 'void', ['number', 'number', 'number']),
      on_key_down: wasmInstance.cwrap('on_key_down', 'void', ['string']),
      resize_canvas: wasmInstance.cwrap('resize_canvas', 'void', ['number', 'number']),
      set_canvas_background: wasmInstance.cwrap('set_canvas_background', 'void', ['number', 'number', 'number', 'number']),
      set_grid_settings: wasmInstance.cwrap('set_grid_settings', 'void', ['boolean', 'number']),
      set_zoom_level: wasmInstance.cwrap('set_zoom_level', 'void', ['number']),
    };

    currentApi = wrappedFunctions;
    isInitialized = true;

    console.log("WASM module loaded and initialized successfully.");
    return true;

  } catch (error) {
    console.error("Error initializing WASM module:", error);
    console.log("Using placeholder API instead.");
    currentApi = placeholderApi;
    return true; // still allow dev without WASM
  }
}


/**
 * Check if WASM module is initialized
 */
export function isWasmInitialized(): boolean {
  return isInitialized;
}

/**
 * Start the render loop
 */
export function startRenderLoop(): void {
  if (renderLoopId) {
    return;
  }

  const renderFrame = () => {
    try {
      if (typeof currentApi.render === 'function') {
        currentApi.render();
      }
    } catch (error) {
      console.error("Error in render loop:", error);
    }
    renderLoopId = requestAnimationFrame(renderFrame);
  };

  renderLoopId = requestAnimationFrame(renderFrame);
}

/**
 * Stop the render loop
 */
export function stopRenderLoop(): void {
  if (renderLoopId) {
    cancelAnimationFrame(renderLoopId);
    renderLoopId = null;
  }
}

/**
 * The main API for interacting with the WASM module.
 */
export const wasmApi = {
  initializeCanvas: (width: number, height: number) => {
    try {
      currentApi.initialize_canvas(width, height);
    } catch (error) {
      console.error('Error in initializeCanvas:', error);
    }
  },
  runRenderLoop: () => {
    startRenderLoop();
  },
  stopRenderLoop: () => {
    stopRenderLoop();
  },
  render: () => {
    try {
      currentApi.render();
    } catch (error) {
      console.error('Error in render:', error);
    }
  },
  onMouseDown: (x: number, y: number, button: number) => {
    try {
      currentApi.on_mouse_down(x, y, button);
    } catch (error) {
      console.error('Error in onMouseDown:', error);
    }
  },
  onMouseMove: (x: number, y: number) => {
    try {
      currentApi.on_mouse_move(x, y);
    } catch (error) {
      console.error('Error in onMouseMove:', error);
    }
  },
  onMouseUp: (x: number, y: number, button: number) => {
    try {
      currentApi.on_mouse_up(x, y, button);
    } catch (error) {
      console.error('Error in onMouseUp:', error);
    }
  },
  onKeyDown: (key: string) => {
    try {
      currentApi.on_key_down(key);
    } catch (error) {
      console.error('Error in onKeyDown:', error);
    }
  },
  resizeCanvas: (width: number, height: number) => {
    try {
      currentApi.resize_canvas(width, height);
    } catch (error) {
      console.error('Error in resizeCanvas:', error);
    }
  },
  setCanvasBackground: (r: number, g: number, b: number, a: number) => {
    try {
      currentApi.set_canvas_background(r, g, b, a);
    } catch (error) {
      console.error('Error in setCanvasBackground:', error);
    }
  },
  setGridSettings: (show: boolean, size: number) => {
    try {
      currentApi.set_grid_settings(show, size);
    } catch (error) {
      console.error('Error in setGridSettings:', error);
    }
  },
  setZoomLevel: (zoom: number) => {
    try {
      if (typeof currentApi.set_zoom_level === 'function') {
        currentApi.set_zoom_level(zoom);
      } else {
        console.warn('WASM function "set_zoom_level" not available. Was the module rebuilt with the new exports?');
      }
    } catch (error) {
      console.error('Error in setZoomLevel:', error);
    }
  },
  // Debug function to manually trigger a draw
  debugDraw: () => {
    try {
      if (currentApi.render) {
        currentApi.render();
      }
    } catch (error) {
      console.error('Error in debugDraw:', error);
    }
  }
};

/**
 * Load the WASM script dynamically
 */
export function loadWasmScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if ((window as any).VectorMateModule) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '/vectormate.js';
    script.async = true;
    
    script.onload = () => {
      console.log("WASM script loaded successfully");
      resolve();
    };
    
    script.onerror = () => {
      console.error("Failed to load WASM script");
      reject(new Error("Failed to load WASM script"));
    };
    
    document.head.appendChild(script);
  });
}
