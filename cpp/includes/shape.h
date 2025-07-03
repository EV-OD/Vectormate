#pragma once
#include <SDL2/SDL.h>
#include <vector>

enum ShapeType {
    RECTANGLE,
    CIRCLE
};

struct Shape {
    ShapeType type;
    SDL_Rect rect; // Used for rect position/size and circle bounding box
    SDL_Color color;
    bool is_selected = false;
};
