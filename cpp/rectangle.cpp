#include "rectangle.h"
#include "utils.h"

Rectangle::Rectangle(SDL_Renderer *renderer, float x, float y, float width, float height,
                     SDL_Color color, bool filled)
{
    this->renderer = renderer;
    this->x = x;
    this->y = y;
    this->width = width;
    this->height = height;
    this->color = color;
    this->filled = filled;
    this->type = RECTANGLE;
}

// copy constructor
Rectangle::Rectangle(const Rectangle &other)
{
    this->renderer = other.renderer;
    this->x = other.x;
    this->y = other.y;
    this->width = other.width;
    this->height = other.height;
    this->color = other.color;
    this->filled = other.filled;
    this->type = other.type;
}

// render function
int Rectangle::render()
{
    int ix = static_cast<int>(x);
    int iy = static_cast<int>(y);
    int iwidth = static_cast<int>(width);
    int iheight = static_cast<int>(height);

    if (filled)
    {
        return boxRGBA(renderer, ix, iy, ix + iwidth - 1, iy + iheight - 1, color.r, color.g, color.b, color.a);
    }
    else
    {
        return rectangleRGBA(renderer, ix, iy, ix + iwidth - 1, iy + iheight - 1, color.r, color.g, color.b, color.a);
    }
}

Shape *Rectangle::get_screen() const
{
    float newX, newY;
    world_to_screen(x, y, newX, newY);
    return new Rectangle(renderer, newX, newY, width, height, color, filled);
};
