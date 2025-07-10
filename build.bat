@echo off
REM Simple batch wrapper for CMake build script

if "%1"=="--help" goto :help
if "%1"=="-h" goto :help
if "%1"=="help" goto :help

echo Building VectorMate with CMake...
powershell -ExecutionPolicy Bypass -File build-cmake.ps1 %*
goto :end

:help
echo VectorMate WASM Build Script
echo.
echo Usage: build.bat [options]
echo.
echo Options:
echo   -Debug      Build in debug mode
echo   -Clean      Clean build artifacts  
echo   -Rebuild    Clean and rebuild
echo   -Dev        Build and start dev server
echo   -Help       Show detailed help
echo.
echo For more options, run: powershell -File build-cmake.ps1 -Help

:end
