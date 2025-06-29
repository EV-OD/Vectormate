# PowerShell build script for VectorMate WASM module
# Usage: .\build-wasm.ps1 [debug]

param(
    [switch]$Debug
)

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

Write-Host "VectorMate WASM Build Script" -ForegroundColor $InfoColor
Write-Host "============================" -ForegroundColor $InfoColor

# Check if Emscripten is installed
try {
    $emccVersion = emcc --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "emcc not found"
    }
    Write-Host "✓ Emscripten found: $($emccVersion[0])" -ForegroundColor $SuccessColor
} catch {
    Write-Host "✗ Error: Emscripten not found in PATH" -ForegroundColor $ErrorColor
    Write-Host "Please install Emscripten SDK and add it to your PATH" -ForegroundColor $WarningColor
    Write-Host "Download from: https://emscripten.org/docs/getting_started/downloads.html" -ForegroundColor $InfoColor
    exit 1
}

# Create public directory if it doesn't exist
if (-not (Test-Path "public")) {
    New-Item -ItemType Directory -Path "public" | Out-Null
    Write-Host "✓ Created public directory" -ForegroundColor $SuccessColor
}

# Build parameters
$sourceFiles = @("cpp/main.cpp", "cpp/canvas.cpp")
$includeDir = "cpp/includes"
$outputFile = "public/vectormate.js"

# Check if source files exist
foreach ($sourceFile in $sourceFiles) {
    if (-not (Test-Path $sourceFile)) {
        Write-Host "✗ Error: Source file '$sourceFile' not found" -ForegroundColor $ErrorColor
        exit 1
    }
}

# Compiler flags
$cflags = @(
    "-std=c++17"
    "-I$includeDir"
    if ($Debug) { "-g", "-DDEBUG" } else { "-O2" }
)

$wasmFlags = @(
    "-s", "WASM=1"
    "-s", "USE_SDL=2"
    "-s", "FULL_ES3=1"
    "-s", "ALLOW_MEMORY_GROWTH=1"
    "-s", "MODULARIZE=1"
    "-s", "EXPORT_NAME=VectorMateModule"
    "-s", "ENVIRONMENT=web"
    if ($Debug) {
        "-s", "ASSERTIONS=1"
        "-s", "SAFE_HEAP=1"
    }
)

$exportedFunctions = @(
    "-s", "EXPORTED_FUNCTIONS=['_initialize_canvas','_render','_on_mouse_down','_on_mouse_move','_on_mouse_up','_on_key_down','_resize_canvas','_set_canvas_background','_set_grid_settings']"
)

$exportedRuntime = @(
    "-s", "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']"
)

# Build command
$buildCommand = @("emcc") + $cflags + $wasmFlags + $exportedFunctions + $exportedRuntime + $sourceFiles + @("-o", $outputFile)

Write-Host "Building WASM module..." -ForegroundColor $InfoColor
if ($Debug) {
    Write-Host "Build type: DEBUG" -ForegroundColor $WarningColor
} else {
    Write-Host "Build type: RELEASE" -ForegroundColor $InfoColor
}

try {
    & $buildCommand[0] $buildCommand[1..($buildCommand.Length-1)]
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build successful!" -ForegroundColor $SuccessColor
        Write-Host "Generated files:" -ForegroundColor $InfoColor
        Write-Host "  - public/vectormate.js" -ForegroundColor $InfoColor
        Write-Host "  - public/vectormate.wasm" -ForegroundColor $InfoColor
        
        # Show file sizes
        $jsSize = (Get-Item "public/vectormate.js").Length
        $wasmSize = (Get-Item "public/vectormate.wasm").Length
        Write-Host "File sizes:" -ForegroundColor $InfoColor
        Write-Host "  - JS:   $([math]::Round($jsSize/1KB, 2)) KB" -ForegroundColor $InfoColor
        Write-Host "  - WASM: $([math]::Round($wasmSize/1KB, 2)) KB" -ForegroundColor $InfoColor
    } else {
        Write-Host "✗ Build failed!" -ForegroundColor $ErrorColor
        exit 1
    }
} catch {
    Write-Host "✗ Build error: $($_.Exception.Message)" -ForegroundColor $ErrorColor
    exit 1
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor $InfoColor
Write-Host "1. Update src/lib/wasm-bridge.ts to load the generated module" -ForegroundColor $InfoColor
Write-Host "2. Start the Next.js development server: npm run dev" -ForegroundColor $InfoColor
Write-Host "3. Test the WASM integration in your browser" -ForegroundColor $InfoColor
