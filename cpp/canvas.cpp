#include "canvas.h"

#include <SDL.h>
#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include <cmath>
#include <iostream>
#include <string>
#include <algorithm>
#include "states.h"
#include "shape.h"

// Helper Functions
SDL_Point screen_to_world(SDL_Point p, int w, int h) {
    return {
        p.x - w / 2,
        p.y - h / 2
    };
}

SDL_Rect world_to_screen_rect(SDL_Rect r, int w, int h) {
    return {
        r.x + w / 2,
        r.y + h / 2,
        r.w,
        r.h
    };
}

bool is_point_in_rect(SDL_Point p, SDL_Rect r) {
    return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

// Global state
Canvas::Canvas(int width, int height)
{
    SDL_SetHint(SDL_HINT_EMSCRIPTEN_KEYBOARD_ELEMENT, "#canvas");

    canvas_width = std::max(width, 300);
    canvas_height = std::max(height, 300);

    emscripten_set_canvas_element_size("#canvas", canvas_width, canvas_height);

    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cerr << "SDL initialization failed: " << SDL_GetError() << std::endl;
        return;
    }

    if (SDL_CreateWindowAndRenderer(canvas_width, canvas_height, 0, &window, &renderer) < 0) {
        std::cerr << "SDL_CreateWindowAndRenderer failed: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return;
    }
    std::cout << "SDL window and renderer created successfully" << std::endl;

    // Create some test shapes
    shapes.push_back({ShapeType::RECTANGLE, {-50, -50, 100, 100}, {255, 0, 0, 255}});
    shapes.push_back({ShapeType::RECTANGLE, {100, 100, 80, 120}, {0, 255, 0, 255}});
    shapes.push_back({ShapeType::RECTANGLE, {-200, 80, 150, 50}, {0, 0, 255, 255}});
}

void Canvas::draw_grid(SDL_Renderer *renderer)
{
    if (!show_grid) return;

    SDL_SetRenderDrawColor(renderer, 220, 220, 220, 255); // Light gray grid

    // Draw simple grid without zoom scaling
    for (int x = 0; x < canvas_width; x += grid_size) {
        SDL_RenderDrawLine(renderer, x, 0, x, canvas_height);
    }

    for (int y = 0; y < canvas_height; y += grid_size) {
        SDL_RenderDrawLine(renderer, 0, y, canvas_width, y);
    }
}

void Canvas::draw_selection_handles(SDL_Renderer *renderer, SDL_Rect rect) {
    SDL_SetRenderDrawColor(renderer, 0, 100, 255, 255);
    int handle_size = 8;
    int half_handle = handle_size / 2;

    // Corners
    SDL_RenderFillRect(renderer, new SDL_Rect{rect.x - half_handle, rect.y - half_handle, handle_size, handle_size});
    SDL_RenderFillRect(renderer, new SDL_Rect{rect.x + rect.w - half_handle, rect.y - half_handle, handle_size, handle_size});
    SDL_RenderFillRect(renderer, new SDL_Rect{rect.x - half_handle, rect.y + rect.h - half_handle, handle_size, handle_size});
    SDL_RenderFillRect(renderer, new SDL_Rect{rect.x + rect.w - half_handle, rect.y + rect.h - half_handle, handle_size, handle_size});
}


// Main render function
void Canvas::render()
{
    if (!renderer) return;

    SDL_SetRenderDrawColor(renderer, background_color.r, background_color.g, background_color.b, background_color.a);
    SDL_RenderClear(renderer);

    draw_grid(renderer);

    for (const auto& shape : shapes) {
        SDL_Rect screen_rect = world_to_screen_rect(shape.rect, canvas_width, canvas_height);
        SDL_SetRenderDrawColor(renderer, shape.color.r, shape.color.g, shape.color.b, shape.color.a);
        SDL_RenderFillRect(renderer, &screen_rect);
        if(shape.is_selected) {
            draw_selection_handles(renderer, screen_rect);
        }
    }

    SDL_RenderPresent(renderer);
}

void Canvas::resize(int new_width, int new_height)
{
    if (new_width <= 0 || new_height <= 0) return;

    canvas_width = new_width;
    canvas_height = new_height;

    emscripten_set_canvas_element_size("#canvas", canvas_width, canvas_height);
    SDL_SetWindowSize(window, canvas_width, canvas_height);
    SDL_RenderSetLogicalSize(renderer, canvas_width, canvas_height);

    std::cout << "SDL2: Canvas resized to " << canvas_width << "x" << canvas_height << std::endl;
}

void Canvas::setBackgroundColor(int r, int g, int b, int a)
{
    background_color.r = (Uint8)r;
    background_color.g = (Uint8)g;
    background_color.b = (Uint8)b;
    background_color.a = (Uint8)a;
}

void Canvas::set_grid_settings(bool show, int size)
{
    show_grid = show;
    grid_size = std::max(5, size);
}

void Canvas::set_zoom(float zoom) {
    // Stub function for JavaScript compatibility - does nothing
}

void Canvas::zoom_at_point(float zoom_factor, int x, int y) {
    // Stub function for JavaScript compatibility - does nothing
}

void Canvas::cleanup()
{
    if (renderer) SDL_DestroyRenderer(renderer);
    if (window) SDL_DestroyWindow(window);
    SDL_Quit();
}

void Canvas::handle_mouse_down(int x, int y, int button)
{
    last_mouse_pos = {x, y};

    if (button == 0) { // Left mouse button only - no middle button panning
        on_drag_start(x, y);
    }
}

void Canvas::handle_mouse_move(int x, int y) {
    int dx = x - last_mouse_pos.x;
    int dy = y - last_mouse_pos.y;

    if (is_dragging) {
        on_drag_update(dx, dy);
    }

    last_mouse_pos = {x, y};
}

void Canvas::handle_mouse_up(int x, int y, int button) {
    if (button == 0 && is_dragging) {
        is_dragging = false;
        on_drag_end();
    }
}

void Canvas::on_drag_start(int x, int y) {
    SDL_Point world_pos = screen_to_world({x, y}, canvas_width, canvas_height);
    
    selected_shape_index = -1;
    for (int i = shapes.size() - 1; i >= 0; --i) {
        shapes[i].is_selected = false;
        if (selected_shape_index == -1 && is_point_in_rect(world_pos, shapes[i].rect)) {
            selected_shape_index = i;
        }
    }
    
    if (selected_shape_index != -1) {
        is_dragging = true;
        shapes[selected_shape_index].is_selected = true;
    }
}

void Canvas::on_drag_update(int dx, int dy) {
    if (is_dragging && selected_shape_index != -1) {
        shapes[selected_shape_index].rect.x += dx;
        shapes[selected_shape_index].rect.y += dy;
    }
}

void Canvas::on_drag_end() {
    is_dragging = false;
}

void Canvas::handle_key_down(const char *key)
{
    // Key handling logic can be expanded here.
    // This is now intended for non-UI keys that should be handled by the canvas engine.
    // Example: std::string key_str(key); if (key_str == "Delete") { ... }
}
