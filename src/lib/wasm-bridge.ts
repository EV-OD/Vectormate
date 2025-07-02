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
    // Do nothing - let WASM handle rendering
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
};

// Current API - starts with placeholders, gets replaced when WASM loads
let currentApi: WasmApi = { ...placeholderApi };

/**
 * Loads and initializes the WebAssembly module.
 * @param canvas - The HTMLCanvasElement to which the WASM module will render.
 * @returns {Promise<boolean>} - True if initialization is successful.
 */
export async function initializeWasm(canvas: HTMLCanvasElement): Promise<boolean> {
  if (wasmInstance) {
    console.log("WASM module already initialized.");
    return true;
  }
  
  try {
    // Set the canvas ID that Emscripten expects
    canvas.id = 'canvas';
    console.log("Canvas set with ID:", canvas.id, "Size:", canvas.width, "x", canvas.height);
    
    // Load the WASM module
    const VectorMateModule = (window as any).VectorMateModule;
    
    if (!VectorMateModule) {
      console.log("VectorMateModule not found. Using placeholder API.");
      // Use placeholder API for development
      currentApi = placeholderApi;
      return true;
    }

    console.log("VectorMateModule found, initializing...");

    // Initialize the module with the canvas
    // === WASM MODULE INSTANTIATION & CALLBACKS ===
    wasmInstance = await VectorMateModule({
      canvas: canvas,
      onRuntimeInitialized: () => {
      console.log("%cWASM Runtime initialized successfully", "color: green; font-weight: bold;");
      isInitialized = true;
      },
      print: (text: string) => {
      // Extra highlighting for stdout
      console.log("%cWASM stdout:", "color: blue; font-weight: bold;", text);
      },
      printErr: (text: string) => {
      // Extra highlighting for stderr
      console.error("%cWASM stderr:", "color: red; font-weight: bold;", text);
      }
    });
    // === END WASM MODULE INSTANTIATION ===

    if (!wasmInstance) {
      console.error("Failed to initialize WASM module");
      return false;
    }

    console.log("WASM instance created, waiting for runtime initialization...");
    
    // Wait for runtime to be initialized
    await new Promise<void>((resolve) => {
      const checkInit = () => {
        if (isInitialized) {
          resolve();
        } else {
          setTimeout(checkInit, 10);
        }
      };
      checkInit();
    });

    console.log("WASM runtime ready, wrapping functions...");

    // Wrap the exported functions using cwrap for type safety and better performance
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
    };

    // Replace the placeholder API with the real wrapped functions
    currentApi = wrappedFunctions;
    isInitialized = true;

    console.log("WASM module loaded and initialized successfully.");
    return true;

  } catch (error) {
    console.error("Error initializing WASM module:", error);
    console.log("Using placeholder API instead.");
    currentApi = placeholderApi;
    return true; // Still return true to allow development without WASM
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
    // console.log("Render loop already running");
    return;
  }

  const renderFrame = () => {
    try {
      currentApi.render();
    } catch (error) {
      console.error("Error in render loop:", error);
    }
    renderLoopId = requestAnimationFrame(renderFrame);
  };

  renderLoopId = requestAnimationFrame(renderFrame);
  // console.log("Render loop started");
}

/**
 * Stop the render loop
 */
export function stopRenderLoop(): void {
  if (renderLoopId) {
    cancelAnimationFrame(renderLoopId);
    renderLoopId = null;
    console.log("Render loop stopped");
  }
}

/**
 * The main API for interacting with the WASM module.
 */
export const wasmApi = {
  initializeCanvas: (width: number, height: number) => {
    console.log('wasmApi.initializeCanvas called with:', width, height);
    if (!isInitialized) {
      console.warn('WASM not initialized yet, using placeholder');
      currentApi.initialize_canvas(width, height);
      return;
    }
    try {
      currentApi.initialize_canvas(width, height);
      console.log('wasmApi.initializeCanvas completed successfully');
    } catch (error) {
      console.error('Error in initializeCanvas:', error);
    }
  },
  runRenderLoop: () => {
    // console.log('wasmApi.runRenderLoop called');
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
    console.log('wasmApi.onMouseDown called with:', x, y, button);
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
    console.log('wasmApi.onMouseUp called with:', x, y, button);
    try {
      currentApi.on_mouse_up(x, y, button);
    } catch (error) {
      console.error('Error in onMouseUp:', error);
    }
  },
  onKeyDown: (key: string) => {
    console.log('wasmApi.onKeyDown called with:', key);
    try {
      currentApi.on_key_down(key);
    } catch (error) {
      console.error('Error in onKeyDown:', error);
    }
  },
  resizeCanvas: (width: number, height: number) => {
    console.log('wasmApi.resizeCanvas called with:', width, height);
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
  
  // Debug function to manually trigger a draw
  debugDraw: () => {
    console.log('Manual debug draw triggered');
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
