cmake_minimum_required(VERSION 3.20)
project(VectorMate VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Default build type to Release if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Choose the type of build (Debug or Release)" FORCE)
endif()

# Set default optimization levels
if(NOT CMAKE_CXX_FLAGS_RELEASE)
    set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")
endif()

if(NOT CMAKE_CXX_FLAGS_DEBUG)
    set(CMAKE_CXX_FLAGS_DEBUG "-O1 -g -DDEBUG")
endif()

# Validate Emscripten toolchain
if(NOT EMSCRIPTEN)
    message(FATAL_ERROR 
        "This project requires Emscripten. Please use:\n"
        "  emcmake cmake -B build\n"
        "  cmake --build build"
    )
endif()

message(STATUS "Building VectorMate WASM module with Emscripten")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")

# WASM-specific configuration
set(WASM_FLAGS
    "-s WASM=1"
    "-s USE_SDL=2"
    "-s FULL_ES3=1"
    "-s ALLOW_MEMORY_GROWTH=1"
    "-s MODULARIZE=1"
    "-s EXPORT_NAME=VectorMateModule"
    "-s ENVIRONMENT=web"
    "-s DISABLE_EXCEPTION_CATCHING=0"
    "-s LEGACY_GL_EMULATION=0"
    "-s GL_UNSAFE_OPTS=0"
    "--bind"
)

# Exported functions for JavaScript interop
set(EXPORTED_FUNCTIONS
    "-s EXPORTED_FUNCTIONS=['_initialize_canvas','_render','_on_mouse_down','_on_mouse_move','_on_mouse_up','_on_key_down','_resize_canvas','_set_canvas_background','_set_grid_settings','_set_zoom_level','_zoom_at_point']"
)

# Exported runtime methods
set(EXPORTED_RUNTIME
    "-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap']"
)

# Debug-specific settings
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    list(APPEND WASM_FLAGS 
        "-s ASSERTIONS=1" 
        "-s SAFE_HEAP=1"
        "-s STACK_OVERFLOW_CHECK=2"
        "--source-map-base http://localhost:3000/"
    )
    message(STATUS "Debug build: Added assertions and heap safety checks")
endif()

# Include directories
include_directories(cpp/includes)

# Find and configure SDL2 for Emscripten
if(EMSCRIPTEN)
    # Emscripten provides SDL2 through the -s USE_SDL=2 flag
    # No need to find SDL2 package as it's built into Emscripten
    set(SDL2_FOUND TRUE)
else()
    message(FATAL_ERROR "This project only supports Emscripten builds")
endif()

# Source files
file(GLOB SOURCES "cpp/*.cpp")

# Create the WASM module
add_executable(vectormate ${SOURCES})

# Configure compiler and linker options
target_compile_options(vectormate PRIVATE 
    -Wno-deprecated-declarations
)

# Convert flag lists to strings for proper passing
string(REPLACE ";" " " WASM_FLAGS_STR "${WASM_FLAGS}")
string(REPLACE ";" " " EXPORTED_FUNCTIONS_STR "${EXPORTED_FUNCTIONS}")
string(REPLACE ";" " " EXPORTED_RUNTIME_STR "${EXPORTED_RUNTIME}")

# Add Emscripten-specific flags
set_target_properties(vectormate PROPERTIES
    COMPILE_FLAGS "-s USE_SDL=2"
    LINK_FLAGS "${WASM_FLAGS_STR} ${EXPORTED_FUNCTIONS_STR} ${EXPORTED_RUNTIME_STR}"
)

# Set output directory and names
set_target_properties(vectormate PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/public"
    OUTPUT_NAME "vectormate"
)

# Custom targets for convenience
add_custom_target(clean-wasm
    COMMAND ${CMAKE_COMMAND} -E remove -f 
        "${CMAKE_SOURCE_DIR}/public/vectormate.js"
        "${CMAKE_SOURCE_DIR}/public/vectormate.wasm"
        "${CMAKE_SOURCE_DIR}/public/vectormate.wasm.map"
    COMMENT "Cleaning WASM build artifacts"
)

# Development server target (optional)
add_custom_target(dev
    COMMAND npm run dev
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Starting Next.js development server"
    DEPENDS vectormate
)

# Build information summary
message(STATUS "=== VectorMate WASM Build Configuration ===")
message(STATUS "  Project: ${PROJECT_NAME} v${PROJECT_VERSION}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  Compiler: ${CMAKE_CXX_COMPILER}")
message(STATUS "  Output Directory: ${CMAKE_SOURCE_DIR}/public")
message(STATUS "  Output Files:")
message(STATUS "    - vectormate.js")
message(STATUS "    - vectormate.wasm")
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    message(STATUS "    - vectormate.wasm.map (source map)")
endif()
message(STATUS "===========================================")
