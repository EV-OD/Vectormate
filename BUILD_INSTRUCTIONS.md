# Building and Testing the VectorMate WASM Module

## Quick Start

1. **Install Emscripten** (if not already installed):
   - Download from: https://emscripten.org/docs/getting_started/downloads.html
   - Follow the installation instructions for your platform
   - Run `emcc --version` to verify installation

2. **Build the WASM module**:
   ```powershell
   # Using PowerShell script (recommended for Windows)
   .\build-wasm.ps1
   
   # Or using make
   make
   ```

3. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```

4. **Test the integration**:
   - Open http://localhost:3000 in your browser
   - You should see a red rectangle on the canvas
   - Try interacting with it:
     - Click on the rectangle to select it (shows selection handles)
     - Use arrow keys to move the rectangle
     - Press 'G' to toggle the grid
     - Press spacebar to cycle through colors (red → green → blue → red)

## What You've Built

This creates a simple SDL2-based WASM module that demonstrates:

- ✅ **Canvas Rendering**: Uses SDL2 to draw directly to an HTML5 canvas
- ✅ **Shape Drawing**: Renders a filled red rectangle with selection handles
- ✅ **Mouse Interaction**: Detects clicks on the rectangle and shows selection state
- ✅ **Keyboard Input**: Arrow keys move the rectangle, 'G' toggles grid, spacebar changes color
- ✅ **Grid System**: Optional grid overlay rendered by SDL2
- ✅ **Background Control**: Customizable background color
- ✅ **Resize Handling**: Adapts to canvas size changes

## File Structure

```
Vectormate/
├── cpp/
│   ├── main.cpp           # C++ source code
│   └── README.md          # Detailed documentation
├── public/
│   ├── vectormate.js      # Generated WASM loader (after build)
│   └── vectormate.wasm    # Generated WASM binary (after build)
├── src/lib/
│   └── wasm-bridge.ts     # TypeScript bridge to WASM
├── build-wasm.ps1         # Windows build script
├── Makefile               # Cross-platform build script
└── WASM_INTEGRATION.md    # Integration documentation
```

## Next Steps

You can extend this foundation by:

1. **Adding More Shapes**: Implement circles, lines, polygons, bezier curves
2. **Layer System**: Add support for multiple drawing layers
3. **Selection System**: Multi-object selection and manipulation
4. **Vector Operations**: Boolean operations, path manipulation
5. **File I/O**: Save/load vector graphics formats
6. **Performance Optimization**: Object culling, spatial indexing

## Troubleshooting

### Build Issues
- Ensure Emscripten is in your PATH
- Try running `emsdk activate latest` and reopen your terminal
- Check that you're running the build command from the project root

### Runtime Issues
- Open browser dev tools and check the console for errors
- Verify that `vectormate.js` and `vectormate.wasm` exist in the `public/` folder
- Make sure the Next.js dev server is serving files from the `public/` directory

### Performance Issues
- Use the release build (without `-Debug` flag)
- Monitor browser performance tools
- Consider reducing the circle drawing algorithm complexity for larger shapes
