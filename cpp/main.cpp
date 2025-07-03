#include <SDL2/SDL.h>
#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include <cmath>
#include <iostream>
#include <string>
#include "canvas.h"

Canvas *canvas = nullptr;

// Function declarations for the required WASM exports
extern "C"
{
    void initialize_canvas(int width, int height);
    void render();
    void on_mouse_down(int x, int y, int button);
    void on_mouse_move(int x, int y);
    void on_mouse_up(int x, int y, int button);
    void on_key_down(const char *key);
    void resize_canvas(int new_width, int new_height);
    void set_canvas_background(int r, int g, int b, int a);
    void set_grid_settings(bool show, int size);
    void set_zoom_level(float zoom);
}

void initialize_canvas(int width, int height) {
    if (canvas) {
        canvas->cleanup();
        delete canvas;
    }
    canvas = new Canvas(width, height);
}

void render() {
    if (canvas) canvas->render();
}

void on_mouse_down(int x, int y, int button) {
    if (canvas) canvas->handle_mouse_down(x, y, button);
}

void on_mouse_move(int x, int y) {
    if (canvas) canvas->handle_mouse_move(x, y);
}

void on_mouse_up(int x, int y, int button) {
    if (canvas) canvas->handle_mouse_up(x, y, button);
}

void on_key_down(const char *key) {
    // Handle key down events if needed
}

void resize_canvas(int new_width, int new_height) {
    if(canvas) canvas->resize(new_width, new_height);
}

void set_canvas_background(int r, int g, int b, int a) {
    if (canvas) {
        canvas->setBackgroundColor(r, g, b, a);
    }
}

void set_grid_settings(bool show, int size) {
    if (canvas) {
        canvas->set_grid_settings(show, size);
    }
}

void set_zoom_level(float zoom) {
    if(canvas) canvas->set_zoom(zoom);
}
