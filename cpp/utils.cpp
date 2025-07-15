#include "utils.h"

void world_to_screen(float fWorldX, float fWorldY, float &fScreenX, float &fScreenY)
{

    fScreenX = (fWorldX - CanvasStates::fOffsetX) * CanvasStates::fScaleX;
    fScreenY = (fWorldY - CanvasStates::fOffsetY) * CanvasStates::fScaleY;
};

void screen_to_world(float fScreenX, float fScreenY, float &fWorldX, float &fWorldY)
{

    fWorldX = fScreenX/CanvasStates::fScaleX + CanvasStates::fOffsetX;
    fWorldY = fScreenY/CanvasStates::fScaleY + CanvasStates::fOffsetY;
}