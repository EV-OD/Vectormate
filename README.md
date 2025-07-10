# VectorMate

VectorMate is a modern, web-based vector design tool built with Next.js, React, and WebAssembly. It provides a powerful and intuitive interface for creating and editing vector graphics directly in the browser.

## ✨ Features

- **Modern UI**: A clean and intuitive user interface built with ShadCN UI and Tailwind CSS
- **High-Performance Canvas**: Core rendering logic powered by C++ compiled to WebAssembly (WASM)
- **Shape Tools**: Rectangle drawing and manipulation with selection handles
- **Grid System**: Optional grid overlay for precise alignment
- **Keyboard Controls**: Arrow keys for movement, G for grid toggle
- **Real-time Rendering**: SDL2-based canvas rendering for smooth performance

## 🚀 Quick Start

### Prerequisites

1. **Install Emscripten** (required for WASM compilation):
   ```bash
   # Download and install Emscripten SDK
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   
   # Activate environment (Windows)
   emsdk_env.bat
   
   # Activate environment (Linux/macOS)  
   source ./emsdk_env.sh
   ```

2. **Verify Emscripten installation**:
   ```bash
   emcc --version
   ```

### Build and Run

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd VectorMate
   npm install
   ```

2. **Build the WASM module**:
   ```powershell
   # Quick release build
   .\build.ps1
   
   # Debug build with source maps
   .\build.ps1 -Debug
   
   # Clean and rebuild
   .\build.ps1 -Rebuild
   
   # Build and start dev server
   .\build.ps1 -Dev
   ```

3. **Start development server** (if not using -Dev flag):
   ```bash
   npm run dev
   ```

4. **Open in browser**: http://localhost:3000

## 🎮 Controls

- **Mouse**: Click to select shapes, drag to move them
- **Arrow Keys**: Move selected shapes
- **G Key**: Toggle grid visibility  
- **Spacebar**: Cycle through shape colors (red → green → blue)

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Canvas Engine**: C++ compiled to WebAssembly using Emscripten
- **Graphics**: SDL2 for hardware-accelerated rendering
- **Build System**: CMake with Emscripten toolchain

## 📁 Project Structure

```
VectorMate/
├── src/                           # Next.js frontend
│   ├── app/                       # App router pages
│   ├── components/                # React components
│   ├── lib/
│   │   └── wasm-bridge.ts         # TypeScript ↔ WASM interface
│   └── states/                    # State management
├── cpp/                           # C++ WASM module source
│   ├── main.cpp                   # WASM entry points
│   ├── canvas.cpp                 # Canvas rendering logic
│   ├── states.cpp                 # State management
│   └── includes/                  # Header files
├── public/                        # Static files
│   ├── vectormate.js              # Generated WASM loader
│   └── vectormate.wasm            # Generated WASM binary
├── CMakeLists.txt                 # Build configuration
├── build.ps1                      # Build script
├── README.md                      # This file
└── WASM_INTEGRATION.md            # WASM integration guide
```

## � Development

### Building WASM Module

The build script supports several options:

```powershell
# Release build (optimized, smaller file size)
.\build.ps1

# Debug build (source maps, assertions, debugging symbols)
.\build.ps1 -Debug

# Clean build artifacts
.\build.ps1 -Clean

# Clean and rebuild from scratch
.\build.ps1 -Rebuild

# Build and automatically start Next.js dev server
.\build.ps1 -Dev

# Show help
.\build.ps1 -Help
```

### Build Types

- **Release**: Optimized for production (`-O3` optimization, smaller WASM files)
- **Debug**: Includes debugging symbols, source maps, and runtime assertions

### Exported WASM Functions

The following C++ functions are exported to JavaScript:

- `initialize_canvas(width, height)` - Initialize the canvas
- `render()` - Render a frame
- `on_mouse_down(x, y, button)` - Handle mouse press
- `on_mouse_move(x, y)` - Handle mouse movement  
- `on_mouse_up(x, y, button)` - Handle mouse release
- `on_key_down(key)` - Handle keyboard input
- `resize_canvas(width, height)` - Handle canvas resize
- `set_canvas_background(r, g, b, a)` - Set background color
- `set_grid_settings(show, size)` - Configure grid display

## 🚧 Current Implementation

This version demonstrates:

- ✅ SDL2-based WASM rendering pipeline
- ✅ Shape drawing (rectangles) with selection handles
- ✅ Mouse interaction (click to select, drag to move)
- ✅ Keyboard controls (arrow keys, shortcuts)
- ✅ Grid system with toggle functionality
- ✅ Background color customization
- ✅ Canvas resizing support
- ✅ TypeScript-WASM bridge with type safety

## 🎯 Roadmap

Future enhancements:

1. **Additional Shapes**: Circles, ellipses, lines, polygons, bezier curves
2. **Selection System**: Multi-object selection, group operations
3. **Layer Management**: Multiple drawing layers with z-order
4. **Vector Operations**: Boolean operations, path manipulation
5. **File I/O**: Save/load SVG, export to various formats
6. **Performance**: Object culling, spatial indexing for large scenes
7. **Tools**: Pen tool, bezier curve editor, text tool
8. **Transform**: Rotation, scaling, skewing with handles

## 🐛 Troubleshooting

### Build Issues

- **"emcc command not found"**: Ensure Emscripten is installed and `emsdk_env` script has been run
- **CMake errors**: Make sure you're using Emscripten's cmake via `emcmake`
- **Permission errors**: Run PowerShell as Administrator if needed

### Runtime Issues

- **WASM module not loading**: Check browser console for errors
- **Canvas not appearing**: Verify `vectormate.js` and `vectormate.wasm` exist in `public/`
- **Performance issues**: Use release build instead of debug build

### Development Tips

- Use debug builds during development for better error messages
- Browser dev tools can debug WASM with source maps in debug mode
- Check the browser console for WASM loading and runtime errors

## 📖 Additional Documentation

- **[WASM_INTEGRATION.md](WASM_INTEGRATION.md)** - Detailed WASM integration guide
- **[CMakeLists.txt](CMakeLists.txt)** - Build configuration reference

## 📄 License

[Add your license information here]
