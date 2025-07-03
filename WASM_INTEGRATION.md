# VectorMate WASM Integration Guide

This document outlines the requirements and function signatures for the WebAssembly (WASM) module that will power the rendering and core logic of VectorMate. The JavaScript frontend is responsible for capturing user input and managing the UI, while the WASM module handles the heavy lifting of scene management, geometry calculations, and rendering.

## 1. Build & Setup

1.  **C++ Toolchain**: You will need a C++ compiler that supports WebAssembly, such as Emscripten (`emcc`).
2.  **Build Process**: The C++ code should be compiled into a `.wasm` file and a corresponding JavaScript loader file (`.js`).
    ```bash
    # Example compilation command using emcc
    emcc src/main.cpp -o public/vectormate.js -s WASM=1 -s USE_WEBGL2=1 -s FULL_ES3=1 -s "EXPORTED_FUNCTIONS=['_initialize_canvas', '_render', '_on_mouse_down', '_on_mouse_move', '_on_mouse_up', '_on_key_down', '_resize_canvas', '_set_canvas_background', '_set_grid_settings', '_set_zoom_level']" -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
    ```
3.  **Loading in Next.js**: The generated `vectormate.js` and `vectormate.wasm` files should be placed in the `public/` directory. The application will load the script and instantiate the WASM module. The `src/lib/wasm-bridge.ts` file is the intermediary for this interaction.

## 2. Core Concepts

-   **State Management**: All scene data, including objects, layers, positions, and properties, is owned and managed by the WASM module. JavaScript should not hold any persistent state about the canvas content.
-   **Rendering Target**: The WASM module will render directly to an HTML `<canvas>` element using WebGL (or Canvas2D as a fallback). JavaScript provides the canvas element to the WASM module during initialization.
-   **Communication**: Communication is primarily one-way: JS -> WASM. JavaScript calls exported C++ functions to notify the module of user input or UI changes. For updates from WASM to JS (e.g., updating the properties panel when an object is selected), a callback mechanism can be implemented.

## 3. Required WASM C++ Functions

The following C++ functions must be exported and made available to JavaScript.

---

### Initialization

`void initialize_canvas(int width, int height);`

-   **Description**: Sets up the initial scene, viewport, and rendering context within the WASM module. This is called once when the canvas component mounts.
-   **Parameters**:
    -   `width`: The initial width of the canvas.
    -   `height`: The initial height of the canvas.
-   **JS Caller**: `src/components/canvas/workspace.tsx` -> `useEffect`

---

### Rendering

`void render();`

-   **Description**: Executes a single render loop, drawing the current state of the scene to the canvas. This should be called within a `requestAnimationFrame` loop in JavaScript for smooth animation.
-   **Parameters**: None.
-   **JS Caller**: `src/lib/wasm-bridge.ts` -> `runRenderLoop`

---

### User Input

`void on_mouse_down(int x, int y, int button);`

-   **Description**: Handles mouse button press events on the canvas.
-   **Parameters**:
    -   `x`, `y`: Cursor coordinates relative to the canvas.
    -   `button`: The mouse button pressed (0: left, 1: middle, 2: right).

`void on_mouse_move(int x, int y);`

-   **Description**: Handles mouse movement over the canvas.
-   **Parameters**:
    -   `x`, `y`: Cursor coordinates.

`void on_mouse_up(int x, int y, int button);`

-   **Description**: Handles mouse button release events.
-   **Parameters**:
    -   `x`, `y`: Cursor coordinates.
    -   `button`: The mouse button released.

`void on_key_down(const char* key);`

-   **Description**: Handles keyboard presses.
-   **Parameters**:
    -   `key`: A string representing the key pressed (e.g., "Delete", "v", "Control").

---

### Canvas & Scene Management

`void resize_canvas(int new_width, int new_height);`

-   **Description**: Updates the WASM module's viewport and internal dimensions when the canvas element is resized.
-   **Parameters**:
    -   `new_width`, `new_height`: The new dimensions of the canvas.

`void set_canvas_background(float r, float g, float b, float a);`

-   **Description**: Sets the background color of the canvas.
-   **Parameters**:
    -   `r`, `g`, `b`, `a`: Color components (0.0 to 1.0).

`void set_grid_settings(bool show, int size);`

-   **Description**: Configures the grid rendering inside the WASM module. Note: The current implementation uses a CSS background grid, but a WASM-rendered grid might be preferable for features like dynamic grid sizing with zoom. If using the CSS grid, this function might not be needed.
-   **Parameters**:
    -   `show`: `true` to show the grid, `false` to hide.
    -   `size`: The grid spacing in pixels.

---

## 4. JavaScript to WASM Bridge (`src/lib/wasm-bridge.ts`)

This file will contain helper functions to:
1.  Load and instantiate the WASM module.
2.  Wrap the exported C++ functions using `cwrap` for type-safe calling.
3.  Manage the `requestAnimationFrame` loop.
4.  Provide a clean API for the rest of the React application to interact with the WASM module.
