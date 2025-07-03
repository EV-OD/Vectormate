# VectorMate WASM Module

This directory contains the C++ source code for the VectorMate WASM module that handles canvas rendering and drawing operations.

## Features

- **Red Circle Drawing**: Displays a simple red circle that can be interacted with
- **Mouse Interaction**: Click on the circle to highlight it, use arrow keys to move it
- **Grid System**: Toggle grid display with the 'G' key
- **Background Control**: Customizable background color
- **Resize Support**: Automatically handles canvas resizing

## Building the WASM Module

### Prerequisites

1. **Install Emscripten**: Download and install the Emscripten SDK from [emscripten.org](https://emscripten.org/docs/getting_started/downloads.html)
2. **Activate Emscripten**: Run `source emsdk_env.bat` (Windows) or `source emsdk_env.sh` (Linux/Mac)
3. **Verify Installation**: Run `emcc --version` to confirm Emscripten is working

### Build Options

#### Option 1: PowerShell Script (Windows)
```powershell
.\build-wasm.ps1           # Release build
.\build-wasm.ps1 -Debug    # Debug build
```

#### Option 2: Makefile (Cross-platform)
```bash
make                       # Release build
make debug                 # Debug build
make clean                 # Clean build artifacts
```

#### Option 3: Manual Build
```bash
emcc cpp/main.cpp -o public/vectormate.js \
  -std=c++17 -O2 \
  -s WASM=1 \
  -s USE_SDL=2 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME=VectorMateModule \
  -s "EXPORTED_FUNCTIONS=['_initialize_canvas','_render','_on_mouse_down','_on_mouse_move','_on_mouse_up','_on_key_down','_resize_canvas','_set_canvas_background','_set_grid_settings','_set_zoom_level']" \
  -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']"
```

## Generated Files

After building, you'll find these files in the `public/` directory:
- `vectormate.js` - JavaScript loader and API
- `vectormate.wasm` - WebAssembly binary

## Integration with Next.js

The WASM module is automatically integrated with the Next.js frontend through `src/lib/wasm-bridge.ts`. The bridge provides a clean TypeScript API for interacting with the WASM functions.

### Usage Example

```typescript
import { initializeWasm, wasmApi, loadWasmScript } from '@/lib/wasm-bridge';

// Load and initialize WASM
await loadWasmScript();
await initializeWasm(canvasElement);

// Initialize canvas
wasmApi.initializeCanvas(800, 600);

// Start render loop
wasmApi.runRenderLoop();

// Handle user input
wasmApi.onMouseDown(x, y, 0);
wasmApi.onKeyDown('ArrowLeft');

// Configure appearance
wasmApi.setCanvasBackground(0.9, 0.9, 0.9, 1.0);
wasmApi.setGridSettings(true, 20);
```

## Controls

- **Arrow Keys**: Move the red circle
- **G Key**: Toggle grid visibility
- **Mouse Click**: Click on the circle to highlight it

## Development Notes

- The WASM module uses SDL2 for rendering
- All state is managed within the C++ code
- The JavaScript bridge provides type-safe function wrappers
- Placeholder functions are used when WASM is not available for development

## Troubleshooting

### Build Issues
- Ensure Emscripten is properly installed and in your PATH
- Verify SDL2 support in your Emscripten installation
- Check that all exported functions match between C++ and JavaScript

### Runtime Issues
- Open browser developer tools to see WASM loading messages
- Verify that `vectormate.js` and `vectormate.wasm` are served correctly
- Check the browser console for initialization errors

### Performance
- Use the release build (`make` or `.\build-wasm.ps1`) for better performance
- Debug builds include additional checks and assertions
- Monitor browser performance tools if experiencing frame rate issues
