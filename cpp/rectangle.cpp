#include "rectangle.h"

Rectangle::Rectangle(SDL_Renderer *renderer, int x, int y, int width, int height,
                     SDL_Color color,bool filled)
{
    this->renderer = renderer;
    this->x = x;
    this->y = y;
    this->width = width;
    this->height = height;
    this->color = color;
    this->filled = filled;
    this->rgba = {color.r, color.g, color.b, color.a};
    this->type = RECTANGLE;
}

int Rectangle::render()
{
    if(filled){
        return boxRGBA(renderer, x, y, x + width - 1, y + height - 1, rgba[0], rgba[1], rgba[2], rgba[3]);

    }
    else{
        return rectangleRGBA(renderer, x, y, x + width - 1, y + height - 1, rgba[0], rgba[1], rgba[2], rgba[3]);
    }
}
