# VectorMate Build Script
# Builds the WASM module using CMake and Emscripten

param (
    [switch]$Debug,
    [switch]$Clean,
    [switch]$Rebuild,
    [switch]$Dev,
    [switch]$Help
)

$BuildDir = "build"

function Show-Help {
    Write-Host "VectorMate Build Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\build.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Debug      Build in debug mode (with source maps)"
    Write-Host "  -Clean      Clean build artifacts"
    Write-Host "  -Rebuild    Clean and rebuild"
    Write-Host "  -Dev        Build and start Next.js dev server"
    Write-Host "  -Help       Show this help"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\build.ps1                # Release build"
    Write-Host "  .\build.ps1 -Debug         # Debug build"
    Write-Host "  .\build.ps1 -Clean         # Clean artifacts"
    Write-Host "  .\build.ps1 -Rebuild       # Clean and rebuild"
    Write-Host "  .\build.ps1 -Dev           # Build and start dev server"
    Write-Host ""
    Write-Host "Requirements:"
    Write-Host "  - Emscripten SDK installed and activated"
    Write-Host "  - Run 'emcc --version' to verify installation"
    exit 0
}

function Test-EmscriptenInstallation {
    try {
        $emccVersion = & emcc --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Emscripten found" -ForegroundColor Green
            return $true
        }
    }
    catch {
        # emcc not found
    }
    
    Write-Host "✗ Emscripten not found or not in PATH" -ForegroundColor Red
    Write-Host "Please install and activate the Emscripten SDK:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://emscripten.org/docs/getting_started/downloads.html"
    Write-Host "  2. Run: emsdk activate latest"
    Write-Host "  3. Run: emsdk_env.bat (Windows) or source emsdk_env.sh (Linux/Mac)"
    return $false
}

function Remove-BuildArtifacts {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
    
    if (Test-Path $BuildDir) {
        Remove-Item -Recurse -Force $BuildDir
        Write-Host "  ✓ Removed build directory" -ForegroundColor Green
    }
    
    $outputFiles = @("public/vectormate.js", "public/vectormate.wasm", "public/vectormate.wasm.map")
    
    foreach ($file in $outputFiles) {
        if (Test-Path $file) {
            Remove-Item $file
            Write-Host "  ✓ Removed $file" -ForegroundColor Green
        }
    }
    
    Write-Host "Clean complete!" -ForegroundColor Green
}

function Invoke-CMakeBuild {
    param ([string]$BuildType = "Release")
    
    Write-Host "Building VectorMate WASM module ($BuildType)..." -ForegroundColor Cyan
    
    # Create build directory
    if (-not (Test-Path $BuildDir)) {
        New-Item -ItemType Directory -Path $BuildDir | Out-Null
    }
    
    # Configure with CMake
    Write-Host "Configuring with CMake..." -ForegroundColor Yellow
    & emcmake cmake -B $BuildDir -DCMAKE_BUILD_TYPE=$BuildType
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "CMake configuration failed!" -ForegroundColor Red
        exit 1
    }
    
    # Build
    Write-Host "Building..." -ForegroundColor Yellow
    & cmake --build $BuildDir
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Verify output files
    $jsFile = "public/vectormate.js"
    $wasmFile = "public/vectormate.wasm"
    
    if ((Test-Path $jsFile) -and (Test-Path $wasmFile)) {
        Write-Host "✓ Build successful!" -ForegroundColor Green
        
        # Show file sizes
        $jsSize = [math]::Round((Get-Item $jsFile).Length / 1KB, 1)
        $wasmSize = [math]::Round((Get-Item $wasmFile).Length / 1KB, 1)
        Write-Host "  Generated: $jsFile (${jsSize}KB), $wasmFile (${wasmSize}KB)" -ForegroundColor Gray
        
        if ($BuildType -eq "Debug" -and (Test-Path "public/vectormate.wasm.map")) {
            Write-Host "  Source map: public/vectormate.wasm.map" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "✗ Build completed but output files not found!" -ForegroundColor Red
        exit 1
    }
}

# Main script logic
if ($Help) { Show-Help }

if (-not (Test-EmscriptenInstallation)) { exit 1 }

if ($Clean) {
    Remove-BuildArtifacts
    if (-not $Rebuild) { exit 0 }
}

if ($Rebuild) { Remove-BuildArtifacts }

$buildType = if ($Debug) { "Debug" } else { "Release" }

Invoke-CMakeBuild -BuildType $buildType

if ($Dev) {
    Write-Host ""
    Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
    & npm run dev
}
