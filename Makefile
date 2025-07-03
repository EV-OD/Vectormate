# Makefile for VectorMate WASM module

# Compiler and flags
EMCC = emcc
CXX_FLAGS = -std=c++17 -I cpp/includes
EM_FLAGS = -s WASM=1 -s USE_SDL=2 -s MODULARIZE=1 -s EXPORT_NAME=VectorMateModule -s ALLOW_MEMORY_GROWTH=1
EXPORTED_FUNCTIONS = "['_initialize_canvas','_render','_on_mouse_down','_on_mouse_move','_on_mouse_up','_on_key_down','_resize_canvas','_set_canvas_background','_set_grid_settings','_set_zoom_level']"
EXPORTED_RUNTIME = "['ccall','cwrap']"

# Source files
SOURCES = cpp/main.cpp cpp/canvas.cpp cpp/states.cpp

# Output files
OUTPUT_DIR = public
OUTPUT_JS = $(OUTPUT_DIR)/vectormate.js
OUTPUT_WASM = $(OUTPUT_DIR)/vectormate.wasm

# Targets
.PHONY: all release debug clean

all: release

release:
	@echo "Building WASM module (Release)..."
	@$(EMCC) $(SOURCES) $(CXX_FLAGS) -O3 $(EM_FLAGS) -s "EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS)" -s "EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME)" -o $(OUTPUT_JS)

debug:
	@echo "Building WASM module (Debug)..."
	@$(EMCC) $(SOURCES) $(CXX_FLAGS) -g -O0 $(EM_FLAGS) -s "EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS)" -s "EXPORTED_RUNTIME_METHODS=$(EXPORTED_RUNTIME)" -o $(OUTPUT_JS)

clean:
	@echo "Cleaning build artifacts..."
	@rm -f $(OUTPUT_JS) $(OUTPUT_WASM)
