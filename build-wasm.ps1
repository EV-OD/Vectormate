# PowerShell build script for VectorMate WASM module

param (
    [switch]$Debug,
    [switch]$Clean
)

$Emcc = "emcc"
$CppFiles = "cpp/main.cpp", "cpp/canvas.cpp", "cpp/states.cpp"
$OutputJs = "public/vectormate.js"
$Includes = "-I cpp/includes"

# Emscripten flags
$EmFlags = @(
    "-s WASM=1",
    "-s USE_SDL=2",
    "-s MODULARIZE=1",
    "-s EXPORT_NAME=VectorMateModule",
    "-s ALLOW_MEMORY_GROWTH=1"
)

# Exported functions and runtime methods
$ExportedFunctions = "['_initialize_canvas', '_render', '_on_mouse_down', '_on_mouse_move', '_on_mouse_up', '_on_key_down', '_resize_canvas', '_set_canvas_background', '_set_grid_settings', '_set_zoom_level']"
$ExportedRuntimeMethods = "['ccall', 'cwrap']"

# Compiler flags
$CFlagsRelease = "-O3", "--no-entry"
$CFlagsDebug = "-g", "-O1", "--no-entry"


if ($Clean) {
    Write-Host "Cleaning build artifacts..."
    Remove-Item -Path "public/vectormate.js", "public/vectormate.wasm", "public/vectormate.wasm.map" -ErrorAction SilentlyContinue
    exit
}

if ($Debug) {
    Write-Host "Building WASM module (Debug)..."
    $CFlags = $CFlagsDebug
} else {
    Write-Host "Building WASM module (Release)..."
    $CFlags = $CFlagsRelease
}

$Command = @(
    $Emcc,
    $CppFiles,
    $Includes,
    "-o", $OutputJs,
    $EmFlags,
    "-s EXPORTED_FUNCTIONS=`"$ExportedFunctions`"",
    "-s EXPORTED_RUNTIME_METHODS=`"$ExportedRuntimeMethods`"",
    $CFlags
)

Invoke-Expression -Command ($Command -join " ")

if ($LastExitCode -eq 0) {
    Write-Host "Build complete: $OutputJs" -ForegroundColor Green
} else {
    Write-Host "Build failed." -ForegroundColor Red
}
