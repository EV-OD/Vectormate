# Makefile for VectorMate WASM build
EMCC = emcc
CPP_FILES = cpp/main.cpp cpp/canvas.cpp cpp/states.cpp
OUTPUT_JS = public/vectormate.js
INCLUDES = -I cpp/includes

# Emscripten flags
# -s MODULARIZE=1: Creates a modular build that can be loaded dynamically.
# -s EXPORT_NAME='VectorMateModule': Name of the module global.
# -s USE_SDL=2: Use SDL2 library.
# -s ALLOW_MEMORY_GROWTH=1: Allows memory to grow dynamically if needed.
EM_FLAGS = -s WASM=1 -s USE_SDL=2 -s MODULARIZE=1 -s EXPORT_NAME=VectorMateModule -s ALLOW_MEMORY_GROWTH=1

# Exported C++ functions (note the leading underscore)
EXPORTED_FUNCTIONS = "['_initialize_canvas', '_render', '_on_mouse_down', '_on_mouse_move', '_on_mouse_up', '_on_key_down', '_resize_canvas', '_set_canvas_background', '_set_grid_settings', '_set_zoom_level']"

# Exported runtime methods needed by the JS bridge
EXPORTED_RUNTIME_METHODS = "['ccall', 'cwrap']"

# Compiler flags
# -O3 for release builds, -g for debug builds
# --no-entry is required for pure library builds (no main() loop in C++)
CFLAGS_RELEASE = -O3 --no-entry
CFLAGS_DEBUG = -g -O1 --no-entry

# Default target: release build
all: release

release:
	@echo "Building WASM module (Release)..."
	$(EMCC) $(CPP_FILES) $(INCLUDES) -o $(OUTPUT_JS) $(EM_FLAGS) \
	-s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
	-s EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME_METHODS) \
	$(CFLAGS_RELEASE)
	@echo "Build complete: $(OUTPUT_JS)"

debug:
	@echo "Building WASM module (Debug)..."
	$(EMCC) $(CPP_FILES) $(INCLUDES) -o $(OUTPUT_JS) $(EM_FLAGS) \
	-s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
	-s EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME_METHODS) \
	$(CFLAGS_DEBUG)
	@echo "Debug build complete: $(OUTPUT_JS)"

clean:
	@echo "Cleaning build artifacts..."
	rm -f public/vectormate.js public/vectormate.wasm public/vectormate.wasm.map
