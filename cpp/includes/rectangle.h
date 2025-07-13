#pragma once
#include <SDL2/SDL.h>
#include "shape.h"
#include <array>
#include "SDL2_gfxPrimitives.h"

class Rectangle: public Shape
{

public:
    Rectangle(SDL_Renderer* renderer, float x = 0, float y = 0, float width = 100, float height = 100,
              SDL_Color color = {255, 255, 255, 255},bool filled = true);
    Rectangle(const Rectangle &other);

    float x;
    float y;
    float width;
    float height;
    int render() override;
    Shape * get_screen() const override;
};
