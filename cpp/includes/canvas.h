#pragma once
#include <SDL2/SDL.h>
#include "states.h"

class Canvas
{
public:
    SDL_Window *window = nullptr;
    SDL_Renderer *renderer = nullptr;

    int canvas_width;
    int canvas_height;

    bool show_grid = false;
    int grid_size = 20;

    SDL_Color background_color = {CanvasStates::bg[0], CanvasStates::bg[1], CanvasStates::bg[2], CanvasStates::bg[3]};

    // New state variables
    float zoom_level = 1.0f;
    SDL_Point pan_offset = {0, 0};
    bool is_panning = false;
    bool is_dragging = false;
    SDL_Point last_mouse_pos = {0, 0};

    // Constructor and destructor
    Canvas(int width = 800, int height = 600);
    void cleanup();

    // Core functions
    void render();
    void resize(int new_width, int new_height);

    // Settings
    void setBackgroundColor(int r, int g, int b, int a);
    void set_grid_settings(bool show, int size);
    void set_zoom(float zoom);

    // Event Handlers
    void handle_mouse_down(int x, int y, int button);
    void handle_mouse_move(int x, int y);
    void handle_mouse_up(int x, int y, int button);

private:
    // Internal helpers
    void draw_grid(SDL_Renderer *renderer);

    // Drag and Pan handlers
    void on_drag_start(int x, int y);
    void on_drag_update(int dx, int dy);
    void on_drag_end();
    void pan(int dx, int dy);
};
