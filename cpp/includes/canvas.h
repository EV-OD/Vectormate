#pragma once
#include <SDL.h>
#include <vector>
#include "states.h"
#include "shape.h"

class Canvas
{
public:
    SDL_Window *window = nullptr;
    SDL_Renderer *renderer = nullptr;

    int canvas_width;
    int canvas_height;

    bool show_grid = true;
    int grid_size = 20;

    SDL_Color background_color = {245, 245, 245, 255};

    float zoom_level = 1.0f;
    SDL_Point pan_offset = {0, 0};
    bool is_panning = false;
    bool is_dragging = false;
    SDL_Point last_mouse_pos = {0, 0};
    
    std::vector<Shape> shapes;
    int selected_shape_index = -1;

    Canvas(int width = 800, int height = 600);
    void cleanup();

    void render();
    void resize(int new_width, int new_height);

    void setBackgroundColor(int r, int g, int b, int a);
    void set_grid_settings(bool show, int size);
    void set_zoom(float zoom);
    void zoom_at_point(float zoom_factor, int x, int y);

    void handle_mouse_down(int x, int y, int button);
    void handle_mouse_move(int x, int y);
    void handle_mouse_up(int x, int y, int button);
    void handle_key_down(const char* key);

private:
    void draw_grid(SDL_Renderer *renderer);
    void draw_selection_handles(SDL_Renderer *renderer, SDL_Rect rect);
    void on_drag_start(int x, int y);
    void on_drag_update(int dx, int dy);
    void on_drag_end();
    void pan(int dx, int dy);
};
