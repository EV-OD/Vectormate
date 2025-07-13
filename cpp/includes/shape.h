#pragma once
#include <SDL2/SDL.h>
#include <vector>

enum ShapeType {
    RECTANGLE,
    CIRCLE
};

class Shape {
    public:
    ShapeType type;
    SDL_Renderer* renderer;
    SDL_Rect bounding_box; // Used for rect position/size and circle bounding box
    SDL_Color color;
    bool is_selected = false;
    bool filled;
    virtual int render() =0;
    virtual ~Shape();
    virtual Shape * get_screen() const = 0;
};
