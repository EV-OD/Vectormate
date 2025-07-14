// cpp/states.cpp
#include "states.h"

namespace CanvasStates {
    Uint8 bg[4] = {46, 53, 59, 255};
    Uint8 grid_color[4] = {173, 172, 172, 33};
    
    float zoom_level = 1.0;
    float world_center[2] = {0, 0};

    float fOffsetX = -500.0f;
    float fOffsetY = -500.0f;

    float fScaleX = 1.0f;
    float fScaleY = 1.0f;
}