#!/usr/bin/env pwsh
# Build script for VectorMate WASM module using CMake
# This script works on Windows, macOS, and Linux

param(
    [string]$BuildType = "Release",
    [switch]$Clean,
    [switch]$Debug,
    [switch]$Help
)

function Show-Help {
    Write-Host "VectorMate WASM Build Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\build.ps1 [options]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Green
    Write-Host "  -BuildType <type>  Build type: Release (default) or Debug"
    Write-Host "  -Debug             Build in debug mode (equivalent to -BuildType Debug)"
    Write-Host "  -Clean             Clean build artifacts before building"
    Write-Host "  -Help              Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\build.ps1                    # Release build"
    Write-Host "  .\build.ps1 -Debug             # Debug build"
    Write-Host "  .\build.ps1 -Clean             # Clean and build"
    Write-Host "  .\build.ps1 -BuildType Debug   # Debug build (explicit)"
    Write-Host ""
    Write-Host "Requirements:" -ForegroundColor Red
    Write-Host "  - Emscripten SDK installed and activated"
    Write-Host "  - CMake 3.20 or higher"
    Write-Host "  - Run 'emcc --version' to verify Emscripten installation"
}

if ($Help) {
    Show-Help
    exit 0
}

# Set build type
if ($Debug) {
    $BuildType = "Debug"
}

# Check if Emscripten is available
try {
    $emccVersion = emcc --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "emcc not found"
    }
    Write-Host "✓ Emscripten found" -ForegroundColor Green
} catch {
    Write-Host "✗ Emscripten not found or not activated" -ForegroundColor Red
    Write-Host "Please install and activate the Emscripten SDK:" -ForegroundColor Yellow
    Write-Host "  1. Download from https://emscripten.org/docs/getting_started/downloads.html"
    Write-Host "  2. Run: ./emsdk install latest"
    Write-Host "  3. Run: ./emsdk activate latest"
    Write-Host "  4. Source the environment: ./emsdk_env.ps1 (Windows) or source ./emsdk_env.sh (Unix)"
    exit 1
}

# Check if CMake is available
try {
    $cmakeVersion = cmake --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "cmake not found"
    }
    Write-Host "✓ CMake found" -ForegroundColor Green
} catch {
    Write-Host "✗ CMake not found" -ForegroundColor Red
    Write-Host "Please install CMake 3.20 or higher from https://cmake.org/"
    exit 1
}

# Create build directory
$buildDir = "build"
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

# Clean if requested
if ($Clean) {
    Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Yellow
    Remove-Item -Path "$buildDir/*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "public/vectormate.js" -ErrorAction SilentlyContinue
    Remove-Item -Path "public/vectormate.wasm" -ErrorAction SilentlyContinue
    Write-Host "✓ Clean complete" -ForegroundColor Green
}

# Configure with CMake
Write-Host "⚙️  Configuring build..." -ForegroundColor Yellow
Set-Location $buildDir

$configureCmd = "emcmake cmake .. -DCMAKE_BUILD_TYPE=$BuildType"
Write-Host "Running: $configureCmd" -ForegroundColor Gray

try {
    Invoke-Expression $configureCmd
    if ($LASTEXITCODE -ne 0) {
        throw "CMake configuration failed"
    }
} catch {
    Write-Host "✗ Configuration failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Build
Write-Host "🔨 Building VectorMate WASM module..." -ForegroundColor Yellow
try {
    cmake --build . --config $BuildType
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
} catch {
    Write-Host "✗ Build failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# Check output files
$jsFile = "public/vectormate.js"
$wasmFile = "public/vectormate.wasm"

if ((Test-Path $jsFile) -and (Test-Path $wasmFile)) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "Output files:" -ForegroundColor Cyan
    Write-Host "  📄 $jsFile" -ForegroundColor White
    Write-Host "  📦 $wasmFile" -ForegroundColor White
    
    # Show file sizes
    $jsSize = [math]::Round((Get-Item $jsFile).Length / 1KB, 1)
    $wasmSize = [math]::Round((Get-Item $wasmFile).Length / 1KB, 1)
    Write-Host "File sizes: JS: ${jsSize}KB, WASM: ${wasmSize}KB" -ForegroundColor Gray
} else {
    Write-Host "✗ Build completed but output files not found" -ForegroundColor Red
    exit 1
}
