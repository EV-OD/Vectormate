#pragma once
#include <SDL2/SDL.h>

// Canvas states
namespace CanvasStates {
    extern Uint8 bg[4];
    extern Uint8 grid_color[4];

    
    extern float zoom_level;
    extern float world_center[2];
    
    extern float fOffsetX;
    extern float fOffsetY;

    extern float fScaleX;
    extern float fScaleY;
}
