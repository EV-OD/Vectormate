# VectorMate WASM Build System

This project now uses **CMake** for building the WebAssembly module, providing a modern, cross-platform, and maintainable build system.

## Prerequisites

1. **Emscripten SDK** - Required for WebAssembly compilation
   ```bash
   # Download and install Emscripten
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   
   # Activate environment (needs to be done for each terminal session)
   source ./emsdk_env.sh  # Linux/macOS
   # OR
   ./emsdk_env.ps1        # Windows PowerShell
   ```

2. **CMake 3.20+** - Modern CMake version
   - Download from [cmake.org](https://cmake.org/download/)
   - Or install via package manager:
     ```bash
     # macOS
     brew install cmake
     
     # Ubuntu/Debian
     sudo apt-get install cmake
     
     # Windows
     winget install Kitware.CMake
     ```

## Quick Start

### Using Build Scripts (Recommended)

**Windows (PowerShell):**
```powershell
# Release build
./build.ps1

# Debug build
./build.ps1 -Debug

# Clean build
./build.ps1 -Clean

# Help
./build.ps1 -Help
```

**Linux/macOS:**
```bash
# Make script executable (first time only)
chmod +x build.sh

# Release build
./build.sh

# Debug build  
./build.sh --debug

# Clean build
./build.sh --clean

# Help
./build.sh --help
```

### Using npm Scripts

```bash
# Build WASM module only
npm run build:wasm

# Build WASM in debug mode
npm run build:wasm:debug

# Clean and build WASM
npm run build:wasm:clean

# Build everything (WASM + Next.js app)
npm run build
```

### Manual CMake Build

```bash
# Create and enter build directory
mkdir build && cd build

# Configure (Release)
emcmake cmake .. -DCMAKE_BUILD_TYPE=Release

# Configure (Debug)
emcmake cmake .. -DCMAKE_BUILD_TYPE=Debug

# Build
cmake --build .

# Output files will be in ../public/
```

## Build Outputs

After a successful build, you'll find:
- `public/vectormate.js` - JavaScript loader and glue code
- `public/vectormate.wasm` - WebAssembly binary module

## Build Types

### Release Build (Default)
- Optimized for production
- Smaller file sizes
- Faster execution
- No debug symbols

### Debug Build
- Includes debug symbols
- Assertions enabled
- Safe heap checking
- Larger file sizes but easier debugging

## Project Structure

```
cpp/
├── includes/           # Header files
│   ├── canvas.h       # Main canvas class
│   ├── shape.h        # Shape definitions
│   └── states.h       # State management
├── canvas.cpp         # Canvas implementation
├── main.cpp          # WASM interface functions
└── states.cpp        # State implementations

CMakeLists.txt        # CMake configuration
build.ps1            # Windows build script
build.sh             # Unix build script
```

## Exported Functions

The WASM module exports these functions for JavaScript:

- `initialize_canvas(width, height)` - Initialize the canvas
- `render()` - Render the current frame
- `on_mouse_down(x, y, button)` - Handle mouse down events
- `on_mouse_move(x, y)` - Handle mouse move events
- `on_mouse_up(x, y, button)` - Handle mouse up events
- `on_key_down(key)` - Handle keyboard input
- `resize_canvas(width, height)` - Resize the canvas
- `set_canvas_background(r, g, b, a)` - Set background color
- `set_grid_settings(show, size)` - Configure grid display
- `set_zoom_level(zoom)` - Set zoom level
- `zoom_at_point(factor, x, y)` - Zoom at specific point

## Troubleshooting

### Common Issues

1. **"emcc not found"**
   - Ensure Emscripten is installed and activated
   - Run `emcc --version` to verify

2. **"CMake version too old"**
   - Update CMake to version 3.20 or higher

3. **Build fails with linking errors**
   - Check that all source files exist
   - Verify exported function names match

4. **Output files not found**
   - Check for build errors in the console
   - Ensure `public/` directory exists

### Clean Build

If you encounter issues, try a clean build:
```bash
# Using scripts
./build.ps1 -Clean        # Windows
./build.sh --clean        # Unix

# Or manually
rm -rf build public/vectormate.*
```

## Advantages over Makefile

✅ **Cross-platform** - Works on Windows, macOS, Linux without OS-specific code  
✅ **Modern** - Uses CMake best practices and modern C++ standards  
✅ **Maintainable** - Clear separation of concerns and easier to extend  
✅ **IDE Integration** - Better support in Visual Studio, CLion, VS Code  
✅ **Dependency Management** - Automatic dependency tracking and rebuilds  
✅ **Build Types** - Easy switching between Debug/Release configurations  
✅ **Scalable** - Easy to add new source files and libraries  

## Development Workflow

1. **Make changes** to C++ source files
2. **Build** using `./build.ps1` or `npm run build:wasm`
3. **Test** in browser with your HTML/JavaScript code
4. **Debug** using `./build.ps1 -Debug` if needed

The build system automatically:
- Detects changed files and rebuilds only what's necessary
- Validates Emscripten and CMake availability
- Provides colored output and progress indicators
- Reports file sizes and build status
