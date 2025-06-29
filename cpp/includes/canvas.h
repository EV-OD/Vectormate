#pragma once
#include <SDL2/SDL.h>
class Canvas
{
public:
    SDL_Window *window = nullptr;
    SDL_Renderer *renderer = nullptr;


    int canvas_width;  // Width of the canvas
    int canvas_height; // Height of the canvas

    
    bool show_grid = true;
    int grid_size = 20;
    SDL_Color background_color = {240, 240, 240, 255};

    // Initialize canvas with given width and height
    Canvas(int width = 800, int height = 600);

    // Draw a rectangle at specified position with given dimensions and color
    void drawRectangle(int x, int y, int width, int height, const char *color);

    // Handle mouse click events
    void handleMouseClick(int x, int y);

    // Resize the canvas to new dimensions
    void resize(int newWidth, int newHeight);

    // Set background color of the canvas
    void setBackgroundColor(float r, float g, float b, float a);

    void draw_grid(SDL_Renderer *renderer);

    void set_grid_settings(bool show, int size);

    void render();

    void cleanup();
};
