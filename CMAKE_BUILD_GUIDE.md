# VectorMate CMake Build System

This document describes the new CMake-based build system that replaces the previous OS-dependent Makefile.

## Overview

The new build system provides:
- ✅ **Cross-platform compatibility** - Works on Windows, macOS, and Linux
- ✅ **Proper dependency management** - No hardcoded paths
- ✅ **Clean configuration** - Centralized build settings
- ✅ **Debug/Release modes** - Optimized builds with proper flags
- ✅ **Automated toolchain detection** - Validates Emscripten installation
- ✅ **Source maps support** - Debug builds include source maps
- ✅ **Easy-to-use scripts** - Simple PowerShell and batch wrappers

## Requirements

1. **Emscripten SDK** - The WebAssembly compiler toolchain
   ```bash
   # Install Emscripten
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ./emsdk_env.sh  # Linux/macOS
   # or
   emsdk_env.bat  # Windows
   ```

2. **CMake 3.20+** - Usually included with Emscripten
   ```bash
   cmake --version  # Should show 3.20 or higher
   ```

## Build Methods

### Method 1: PowerShell Script (Recommended)

```powershell
# Release build (optimized)
.\build-cmake.ps1

# Debug build (with source maps and assertions)
.\build-cmake.ps1 -Debug

# Clean build artifacts
.\build-cmake.ps1 -Clean

# Clean and rebuild
.\build-cmake.ps1 -Rebuild -Debug

# Build and start Next.js dev server
.\build-cmake.ps1 -Dev

# Show help
.\build-cmake.ps1 -Help
```

### Method 2: Batch File (Windows)

```cmd
REM Release build
build.bat

REM Debug build  
build.bat -Debug

REM Clean build
build.bat -Clean

REM Show help
build.bat --help
```

### Method 3: Manual CMake Commands

```bash
# Configure build
emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build build

# Clean (removes build directory)
cmake --build build --target clean-wasm
```

## Build Types

### Release Build (Default)
- **Optimization**: `-O3` (maximum optimization)
- **Size**: Smaller WASM files
- **Performance**: Best runtime performance
- **Debug info**: None
- **Use for**: Production deployment

### Debug Build
- **Optimization**: `-O1` (minimal optimization)
- **Debug info**: Full debug symbols and source maps
- **Assertions**: Runtime checks enabled
- **Heap safety**: Memory safety checks
- **Use for**: Development and debugging

## Output Files

All generated files are placed in the `public/` directory:

- **`vectormate.js`** - JavaScript loader and API wrapper
- **`vectormate.wasm`** - WebAssembly binary module
- **`vectormate.wasm.map`** - Source map (debug builds only)

## Project Structure

```
VectorMate/
├── CMakeLists.txt          # Main build configuration
├── build-cmake.ps1         # PowerShell build script
├── build.bat              # Windows batch wrapper
├── cpp/                   # C++ source code
│   ├── main.cpp           # WASM entry points
│   ├── canvas.cpp         # Canvas rendering logic
│   ├── states.cpp         # State management
│   └── includes/          # Header files
│       ├── canvas.h
│       ├── states.h
│       └── shape.h
├── public/                # Output directory
│   ├── vectormate.js      # Generated JS file
│   └── vectormate.wasm    # Generated WASM file
└── src/                   # Next.js frontend
    └── lib/
        └── wasm-bridge.ts  # TypeScript WASM interface
```

## Configuration Options

The `CMakeLists.txt` file provides several configuration points:

### Compiler Flags
```cmake
# Release flags
CMAKE_CXX_FLAGS_RELEASE = "-O3 -DNDEBUG"

# Debug flags  
CMAKE_CXX_FLAGS_DEBUG = "-O1 -g -DDEBUG"
```

### WASM Settings
```cmake
# Core WASM flags
-s WASM=1                    # Enable WebAssembly
-s USE_SDL=2                 # Include SDL2
-s MODULARIZE=1              # Create ES6 module
-s EXPORT_NAME="VectorMateModule"
-s ALLOW_MEMORY_GROWTH=1     # Dynamic memory

# Debug-specific flags (debug builds only)
-s ASSERTIONS=1              # Runtime assertions
-s SAFE_HEAP=1              # Heap safety checks
-s STACK_OVERFLOW_CHECK=2    # Stack overflow detection
```

### Exported Functions
The following C++ functions are exported to JavaScript:
- `initialize_canvas(width, height)`
- `render()`
- `on_mouse_down(x, y, button)`
- `on_mouse_move(x, y)`
- `on_mouse_up(x, y, button)`
- `on_key_down(key)`
- `resize_canvas(width, height)`
- `set_canvas_background(r, g, b, a)`
- `set_grid_settings(show, size)`
- `set_zoom_level(zoom)`
- `zoom_at_point(zoom, x, y)`

## Integration with Next.js

The WASM module integrates with the Next.js frontend through:

1. **WASM Bridge** (`src/lib/wasm-bridge.ts`)
   - Loads the WASM module
   - Provides TypeScript-safe API wrappers
   - Handles initialization and cleanup

2. **Canvas Component** (`src/components/canvas/workspace.tsx`)
   - Creates the HTML5 canvas element
   - Forwards user input to WASM
   - Manages the render loop

3. **State Management** (`src/states/canvasStates.ts`)
   - Syncs UI state with WASM module
   - Provides reactive state updates

## Troubleshooting

### Common Issues

**"emcc command not found"**
```bash
# Activate Emscripten environment
source path/to/emsdk/emsdk_env.sh  # Linux/macOS
# or
path\to\emsdk\emsdk_env.bat        # Windows
```

**"CMake version too old"**
```bash
# Check CMake version
cmake --version

# Emscripten includes CMake 3.24+, ensure Emscripten's cmake is in PATH
which cmake  # Should point to Emscripten's cmake
```

**"Build succeeds but files not generated"**
- Check that `public/` directory exists
- Verify Emscripten can write to the project directory
- Try a clean rebuild: `.\build-cmake.ps1 -Rebuild`

**"WASM module fails to load in browser"**
- Use debug build to get better error messages
- Check browser console for loading errors
- Ensure files are served correctly (not from file:// URLs)

### Debug Build Benefits

Debug builds provide additional diagnostic information:
- **Source maps**: Step through C++ code in browser debugger
- **Assertions**: Runtime checks for memory access and API usage
- **Verbose logging**: Detailed output during compilation and runtime
- **Unoptimized code**: Easier to debug and understand

## Migration from Makefile

The old Makefile has been replaced with this CMake system. Key improvements:

| Aspect | Old Makefile | New CMake |
|--------|-------------|-----------|
| OS Detection | Manual if/else blocks | Automatic via Emscripten |
| Path Handling | Hardcoded paths | Automatic discovery |
| Build Types | Limited support | Full Debug/Release |
| Dependency Management | Manual | Integrated with toolchain |
| Error Handling | Basic | Comprehensive validation |
| Maintenance | Platform-specific | Universal |

To migrate existing builds:
1. Remove the old `Makefile`
2. Use `.\build-cmake.ps1` instead of `make`
3. Update any CI/CD scripts to use the new build commands

## Contributing

When modifying the build system:

1. **Test on multiple platforms** - Windows, macOS, Linux
2. **Verify both build types** - Debug and Release
3. **Update documentation** - Keep this README current
4. **Maintain backward compatibility** - Don't break existing workflows
