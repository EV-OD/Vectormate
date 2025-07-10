#!/bin/bash
# Build script for VectorMate WASM module using CMake
# This script works on macOS and Linux

set -e

BUILD_TYPE="Release"
CLEAN=false
HELP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build-type)
            BUILD_TYPE="$2"
            shift 2
            ;;
        --debug)
            BUILD_TYPE="Debug"
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --help|-h)
            HELP=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

show_help() {
    echo -e "\033[36mVectorMate WASM Build Script\033[0m"
    echo ""
    echo -e "\033[33mUsage: ./build.sh [options]\033[0m"
    echo ""
    echo -e "\033[32mOptions:\033[0m"
    echo "  --build-type <type>  Build type: Release (default) or Debug"
    echo "  --debug              Build in debug mode"
    echo "  --clean              Clean build artifacts before building"
    echo "  --help, -h           Show this help message"
    echo ""
    echo -e "\033[33mExamples:\033[0m"
    echo "  ./build.sh                     # Release build"
    echo "  ./build.sh --debug             # Debug build"
    echo "  ./build.sh --clean             # Clean and build"
    echo "  ./build.sh --build-type Debug  # Debug build (explicit)"
    echo ""
    echo -e "\033[31mRequirements:\033[0m"
    echo "  - Emscripten SDK installed and activated"
    echo "  - CMake 3.20 or higher"
    echo "  - Run 'emcc --version' to verify Emscripten installation"
}

if [ "$HELP" = true ]; then
    show_help
    exit 0
fi

# Check if Emscripten is available
if ! command -v emcc &> /dev/null; then
    echo -e "\033[31m✗ Emscripten not found or not activated\033[0m"
    echo -e "\033[33mPlease install and activate the Emscripten SDK:\033[0m"
    echo "  1. Download from https://emscripten.org/docs/getting_started/downloads.html"
    echo "  2. Run: ./emsdk install latest"
    echo "  3. Run: ./emsdk activate latest"
    echo "  4. Source the environment: source ./emsdk_env.sh"
    exit 1
fi
echo -e "\033[32m✓ Emscripten found\033[0m"

# Check if CMake is available
if ! command -v cmake &> /dev/null; then
    echo -e "\033[31m✗ CMake not found\033[0m"
    echo -e "\033[33mPlease install CMake 3.20 or higher from https://cmake.org/\033[0m"
    exit 1
fi
echo -e "\033[32m✓ CMake found\033[0m"

# Create build directory
BUILD_DIR="build"
mkdir -p "$BUILD_DIR"

# Clean if requested
if [ "$CLEAN" = true ]; then
    echo -e "\033[33m🧹 Cleaning build artifacts...\033[0m"
    rm -rf "$BUILD_DIR"/*
    rm -f public/vectormate.js public/vectormate.wasm
    echo -e "\033[32m✓ Clean complete\033[0m"
fi

# Configure with CMake
echo -e "\033[33m⚙️  Configuring build...\033[0m"
cd "$BUILD_DIR"

CONFIGURE_CMD="emcmake cmake .. -DCMAKE_BUILD_TYPE=$BUILD_TYPE"
echo -e "\033[37mRunning: $CONFIGURE_CMD\033[0m"

if ! $CONFIGURE_CMD; then
    echo -e "\033[31m✗ Configuration failed\033[0m"
    exit 1
fi

# Build
echo -e "\033[33m🔨 Building VectorMate WASM module...\033[0m"
if ! cmake --build . --config "$BUILD_TYPE"; then
    echo -e "\033[31m✗ Build failed\033[0m"
    exit 1
fi

cd ..

# Check output files
JS_FILE="public/vectormate.js"
WASM_FILE="public/vectormate.wasm"

if [[ -f "$JS_FILE" && -f "$WASM_FILE" ]]; then
    echo -e "\033[32m✅ Build successful!\033[0m"
    echo -e "\033[36mOutput files:\033[0m"
    echo -e "\033[37m  📄 $JS_FILE\033[0m"
    echo -e "\033[37m  📦 $WASM_FILE\033[0m"
    
    # Show file sizes
    JS_SIZE=$(du -h "$JS_FILE" | cut -f1)
    WASM_SIZE=$(du -h "$WASM_FILE" | cut -f1)
    echo -e "\033[37mFile sizes: JS: $JS_SIZE, WASM: $WASM_SIZE\033[0m"
else
    echo -e "\033[31m✗ Build completed but output files not found\033[0m"
    exit 1
fi
