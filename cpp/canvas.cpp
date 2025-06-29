#include "canvas.h"

#include <SDL2/SDL.h>
#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include <cmath>
#include <iostream>
#include <string>

// Global state
Canvas::Canvas(int width, int height )
{

    // Initialize SDL
    if (SDL_Init(SDL_INIT_VIDEO) < 0)
    {
        std::cerr << "SDL could not initialize! SDL_Error: " << SDL_GetError() << std::endl;
        return;
    }

    // Create window
    window = SDL_CreateWindow("SDL2 Canvas", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, width, height, SDL_WINDOW_SHOWN);
    if (!window)
    {
        std::cerr << "Window could not be created! SDL_Error: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return;
    }

    // Create renderer
    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (!renderer)
    {
        std::cerr << "Renderer could not be created! SDL_Error: " << SDL_GetError() << std::endl;
        SDL_DestroyWindow(window);
        SDL_Quit();
        return;
    }

    // Set background color
    SDL_SetRenderDrawColor(renderer, background_color.r, background_color.g, background_color.b, background_color.a);
    SDL_RenderClear(renderer);
    SDL_RenderPresent(renderer);

    std::cout << "Initializing SDL2 canvas: " << width << "x" << height << std::endl;

    // Ensure minimum dimensions
    canvas_width = std::max(width, 300); // Use smaller minimum for testing
    canvas_height = std::max(height, 300);

    if (width <= 0 || height <= 0)
    {
        std::cout << "Warning: Invalid canvas dimensions, using defaults: "
                  << canvas_width << "x" << canvas_height << std::endl;
    }

    // Set canvas size in Emscripten - this must be done first
    emscripten_set_canvas_element_size("#canvas", canvas_width, canvas_height);

    // Initialize SDL with video subsystem
    if (SDL_Init(SDL_INIT_VIDEO) < 0)
    {
        std::cerr << "SDL initialization failed: " << SDL_GetError() << std::endl;
        return;
    }
    std::cout << "SDL initialized successfully" << std::endl;

    // Use the recommended approach from SDL2 docs: SDL_CreateWindowAndRenderer
    if (SDL_CreateWindowAndRenderer(canvas_width, canvas_height, 0, &window, &renderer) < 0)
    {
        std::cerr << "Window and Renderer creation failed: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return;
    }

    std::cout << "SDL window and renderer created successfully" << std::endl;
}


void Canvas::draw_grid(SDL_Renderer *renderer)
{
    if (!show_grid)
    {
        return;
    }
    SDL_SetRenderDrawColor(renderer, 200, 200, 200, 255); // Light gray grid

    // Vertical lines
    for (int x = 0; x < canvas_width; x += grid_size)
    {
        SDL_RenderDrawLine(renderer, x, 0, x, canvas_height);
    }

    // Horizontal lines
    for (int y = 0; y < canvas_height; y += grid_size)
    {
        SDL_RenderDrawLine(renderer, 0, y, canvas_width, y);
    }
}

// Main render function
void Canvas::render()
{
    // this will use the list of current objects to render the frame, it will implement the clipping functions
    if (!renderer)
    {
        std::cerr << "Renderer not initialized!" << std::endl;
        return;
    }

    // Clear the screen with background color (like the SDL2 docs example)
    SDL_SetRenderDrawColor(renderer,
                           background_color.r,
                           background_color.g,
                           background_color.b,
                           background_color.a);
    SDL_RenderClear(renderer);

    // Draw grid
    draw_grid(renderer);


    // Present the rendered frame (like in the docs)
    SDL_RenderPresent(renderer);

    // Debug log every 60 frames to avoid spam
    static int frame_count = 0;
    frame_count++;
    if (frame_count % 60 == 0)
    {
        std::cout << "SDL2: Rendered frame " << frame_count << " - Rectangle at ("<<std::endl;
    }
}

// Handle mouse down events
void on_mouse_down(int x, int y, int button)
{
}

// Handle canvas resize
void resize_canvas(int new_width, int new_height)
{
}

// Set canvas background color
void Canvas::setBackgroundColor(float r, float g, float b, float a)
{
    background_color.r = (Uint8)(r * 255);
    background_color.g = (Uint8)(g * 255);
    background_color.b = (Uint8)(b * 255);
    background_color.a = (Uint8)(a * 255);

    std::cout << "SDL2: Background color set to: (" << (int)background_color.r
              << ", " << (int)background_color.g
              << ", " << (int)background_color.b
              << ", " << (int)background_color.a << ")" << std::endl;
}

// Configure grid settings
void Canvas::set_grid_settings(bool show, int size)
{
    show_grid = show;
    grid_size = std::max(5, size); // Minimum grid size of 5 pixels

    std::cout << "SDL2: Grid settings: show=" << show_grid << ", size=" << grid_size << std::endl;
}

// Cleanup function
void Canvas::cleanup()
{
    if (renderer)
    {
        SDL_DestroyRenderer(renderer);
        renderer = nullptr;
    }
    SDL_Quit();
    std::cout << "SDL2 cleanup completed" << std::endl;
}

void Canvas::handleMouseClick(int x, int y)
{
    // Handle mouse click events
    std::cout << "SDL2: Mouse clicked at (" << x << ", " << y << ")" << std::endl;
}