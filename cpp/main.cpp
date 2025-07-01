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
}

void initialize_canvas(int width, int height) {
    canvas = new Canvas(width, height);
}

void render() {
    if (!canvas) {
        std::cerr << "Canvas not initialized!" << std::endl;
        return;
    }
    canvas->render();
}

void on_mouse_down(int x, int y, int button) {
    if (canvas) {
        canvas->handleMouseClick(x, y);
    }
}

void on_mouse_move(int x, int y) {
    // Handle mouse move events if needed
}

void on_mouse_up(int x, int y, int button) {
    // Handle mouse up events if needed
}

void on_key_down(const char *key) {
    // Handle key down events if needed
}
void resize_canvas(int new_width, int new_height) {
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