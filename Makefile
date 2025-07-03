# Makefile for building VectorMate WASM module
# Requires Emscripten to be installed and available in PATH

# Detect OS
ifeq ($(OS),Windows_NT)
    IS_WINDOWS := 1
    MKDIR = if not exist $(OUTPUT_DIR) mkdir $(OUTPUT_DIR)
    RM = del /f /q
    PYTHON_PATH = C:\Users\LENOVO~1\AppData\Local\Programs\Python\Python313\python.exe
    SHELL := cmd
else
    IS_WINDOWS :=
    MKDIR = mkdir -p $(OUTPUT_DIR)
    RM = rm -f
    PYTHON_PATH = $(shell which python3)
    SHELL := /bin/bash
endif

# Compiler and flags
EMCC = emcc
CFLAGS = -std=c++17 -O2
WASM_FLAGS = -s WASM=1 \
             -s USE_SDL=2 \
             -s FULL_ES3=1 \
             -s ALLOW_MEMORY_GROWTH=1 \
             -s MODULARIZE=1 \
             -s EXPORT_NAME="VectorMateModule" \
             -s ENVIRONMENT=web \
             -s DISABLE_EXCEPTION_CATCHING=0 \
             -s LEGACY_GL_EMULATION=0 \
             -s GL_UNSAFE_OPTS=0 \
             --bind

EXPORTED_FUNCTIONS = -s "EXPORTED_FUNCTIONS=[ \
    '_initialize_canvas', \
    '_render', \
    '_on_mouse_down', \
    '_on_mouse_move', \
    '_on_mouse_up', \
    '_on_key_down', \
    '_resize_canvas', \
    '_set_canvas_background', \
    '_set_grid_settings', \
    '_set_zoom_level' \
]"

EXPORTED_RUNTIME = -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"

SOURCE = $(wildcard cpp/*.cpp)
INCLUDES = -Icpp/includes
OUTPUT_DIR = public
OUTPUT_JS = $(OUTPUT_DIR)/vectormate.js
OUTPUT_WASM = $(OUTPUT_DIR)/vectormate.wasm

# Default target
all: $(OUTPUT_JS)

$(OUTPUT_JS): $(SOURCE)
	@echo "Building VectorMate WASM module..."
	@$(MKDIR)
	@PYTHON=$(PYTHON_PATH) $(EMCC) $(CFLAGS) $(INCLUDES) $(WASM_FLAGS) $(EXPORTED_FUNCTIONS) $(EXPORTED_RUNTIME) \
		$(SOURCE) -o $(OUTPUT_JS)
	@echo "Build complete!"
	@echo "  - $(OUTPUT_JS)"
	@echo "  - $(OUTPUT_WASM)"

clean:
	@echo "Cleaning build artifacts..."
	@$(RM) $(OUTPUT_JS) $(OUTPUT_WASM)
	@echo "Clean complete!"

debug: CFLAGS += -g -DDEBUG
debug: WASM_FLAGS += -s ASSERTIONS=1 -s SAFE_HEAP=1
debug: $(OUTPUT_JS)
	@echo "Debug build complete!"

help:
	@echo "VectorMate WASM Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all     - Build the WASM module (default)"
	@echo "  debug   - Build with debug flags"
	@echo "  clean   - Remove build artifacts"
	@echo "  help    - Show this help message"
	@echo ""
	@echo "Requirements:"
	@echo "  - Emscripten SDK installed and in PATH"
	@echo "  - Run 'emcc --version' to verify installation"

.PHONY: all clean debug help
