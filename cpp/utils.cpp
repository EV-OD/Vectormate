#include "utils.h"

void world_to_screen(float fWorldX, float fWorldY, float &fScreenX, float &fScreenY)
{

    fScreenX = fWorldX - CanvasStates::fOffsetX;
    fScreenY = fWorldY - CanvasStates::fOffsetY;
};

void screen_to_world(float fScreenX, float fScreenY, float &fWorldX, float &fWorldY)
{

    fWorldX = fWorldX + CanvasStates::fOffsetX;
    fWorldY = fWorldY + CanvasStates::fOffsetY;
}