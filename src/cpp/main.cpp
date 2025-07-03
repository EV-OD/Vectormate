#include <SDL2/SDL.h>
#include <emscripten.h>
#include <iostream>
#include "canvas.h"

Canvas *canvas = nullptr;

extern "C" {

EMSCRIPTEN_KEEPALIVE
void initialize_canvas(int width, int height) {
    if (canvas) {
        canvas->cleanup();
        delete canvas;
    }
    canvas = new Canvas(width, height);
}

EMSCRIPTEN_KEEPALIVE
void render() {
    if (canvas) canvas->render();
}

EMSCRIPTEN_KEEPALIVE
void on_mouse_down(int x, int y, int button) {
    if (canvas) canvas->handle_mouse_down(x, y, button);
}

EMSCRIPTEN_KEEPALIVE
void on_mouse_move(int x, int y) {
    if (canvas) canvas->handle_mouse_move(x, y);
}

EMSCRIPTEN_KEEPALIVE
void on_mouse_up(int x, int y, int button) {
    if (canvas) canvas->handle_mouse_up(x, y, button);
}

EMSCRIPTEN_KEEPALIVE
void on_key_down(const char *key) {
    if (canvas) canvas->handle_key_down(key);
}

EMSCRIPTEN_KEEPALIVE
void resize_canvas(int new_width, int new_height) {
    if(canvas) canvas->resize(new_width, new_height);
}

EMSCRIPTEN_KEEPALIVE
void set_canvas_background(int r, int g, int b, int a) {
    if (canvas) canvas->setBackgroundColor(r, g, b, a);
}

EMSCRIPTEN_KEEPALIVE
void set_grid_settings(bool show, int size) {
    if (canvas) canvas->set_grid_settings(show, size);
}

EMSCRIPTEN_KEEPALIVE
void set_zoom_level(float zoom_factor) {
    if(canvas) canvas->set_zoom(zoom_factor);
}

EMSCRIPTEN_KEEPALIVE
void zoom_at_point(float zoom_factor, int x, int y) {
    if(canvas) canvas->zoom_at_point(zoom_factor, x, y);
}

}
