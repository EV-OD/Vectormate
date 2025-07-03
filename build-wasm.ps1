# PowerShell script to build the VectorMate WASM module

param (
    [switch]$Debug # Add a -Debug switch
)

# --- Configuration ---
$Emcc = "emcc"
$SourceFiles = "cpp/main.cpp", "cpp/canvas.cpp", "cpp/states.cpp"
$IncludeDir = "cpp/includes"
$OutputDir = "public"
$OutputJs = "$OutputDir/vectormate.js"

$CppFlags = @(
    "-std=c++17",
    "-I $IncludeDir"
)

$EmscriptenFlags = @(
    "-s WASM=1",
    "-s USE_SDL=2",
    "-s MODULARIZE=1",
    "-s EXPORT_NAME=VectorMateModule",
    "-s ALLOW_MEMORY_GROWTH=1",
    "-s ""EXPORTED_FUNCTIONS=['_initialize_canvas','_render','_on_mouse_down','_on_mouse_move','_on_mouse_up','_on_key_down','_resize_canvas','_set_canvas_background','_set_grid_settings','_set_zoom_level']""",
    "-s ""EXPORTED_RUNTIME_METHODS=['ccall','cwrap']"""
)

if ($Debug) {
    Write-Host "Building WASM module (Debug)..." -ForegroundColor Yellow
    $OptimizationFlags = "-g", "-O0"
} else {
    Write-Host "Building WASM module (Release)..." -ForegroundColor Green
    $OptimizationFlags = "-O3"
}

# --- Build Command ---
# We build the command as a string to handle the nested quotes in EXPORTED_FUNCTIONS
$CommandString = "$Emcc $($SourceFiles -join ' ') $($CppFlags -join ' ') $($OptimizationFlags -join ' ') $($EmscriptenFlags -join ' ') -o $OutputJs"


# --- Execute ---
try {
    Write-Host "Running command: $CommandString"
    Invoke-Expression $CommandString
    Write-Host "Build successful! Output files are in the '$OutputDir' directory." -ForegroundColor Green
} catch {
    Write-Host "Build failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
