# PowerShell script for building VectorMate WASM module using CMake

param (
    [switch]$Debug,
    [switch]$Clean,
    [switch]$Rebuild,
    [switch]$Dev,
    [switch]$Help
)

$BuildDir = "build"

function Show-Help {
    Write-Host "VectorMate WASM Build Script (CMake)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\build-cmake.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Debug      Build in debug mode"
    Write-Host "  -Clean      Clean build artifacts"
    Write-Host "  -Rebuild    Clean and rebuild"
    Write-Host "  -Dev        Build and start dev server"
    Write-Host "  -Help       Show this help"
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
    Write-Host "Please install and activate the Emscripten SDK" -ForegroundColor Yellow
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
    
    if (-not (Test-Path $BuildDir)) {
        New-Item -ItemType Directory -Path $BuildDir | Out-Null
    }
    
    Write-Host "Configuring with CMake..." -ForegroundColor Yellow
    & emcmake cmake -B $BuildDir -DCMAKE_BUILD_TYPE=$BuildType
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "CMake configuration failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Building..." -ForegroundColor Yellow
    & cmake --build $BuildDir
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    
    $jsFile = "public/vectormate.js"
    $wasmFile = "public/vectormate.wasm"
    
    if ((Test-Path $jsFile) -and (Test-Path $wasmFile)) {
        Write-Host "✓ Build successful!" -ForegroundColor Green
        Write-Host "  Generated: $jsFile, $wasmFile" -ForegroundColor Gray
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
    Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
    & npm run dev
}
