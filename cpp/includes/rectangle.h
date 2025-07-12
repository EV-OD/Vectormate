#pragma once
#include <SDL2/SDL.h>
#include "shape.h"
#include <array>
#include "SDL2_gfxPrimitives.h"

class Rectangle: public Shape
{

public:
    Rectangle(SDL_Renderer* renderer, int x = 0, int y = 0, int width = 100, int height = 100,
              SDL_Color color = {255, 255, 255, 255},bool filled = true);

    int x;
    int y;
    int width;
    int height;
    std::array<int, 4> rgba;
    int render() override;
};
