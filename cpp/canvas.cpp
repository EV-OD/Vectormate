#include "canvas.h"

#include <SDL2/SDL.h>
#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include <cmath>
#include <iostream>
#include <string>
#include "states.h"

// Global state
Canvas::Canvas(int width, int height)
{
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

    // For Emscripten, we need to use the proper renderer flags
    // Try different renderer creation strategies

    // First try: Use SDL_CreateWindowAndRenderer (recommended for Emscripten)
    if (SDL_CreateWindowAndRenderer(canvas_width, canvas_height, 0, &window, &renderer) < 0)
    {
        std::cout << "SDL_CreateWindowAndRenderer failed: " << SDL_GetError() << std::endl;

        // Second try: Create window first, then renderer with specific flags
        window = SDL_CreateWindow("SDL2 Canvas",
                                  SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
                                  canvas_width, canvas_height,
                                  SDL_WINDOW_SHOWN);

        if (!window)
        {
            std::cerr << "Window could not be created! SDL_Error: " << SDL_GetError() << std::endl;
            SDL_Quit();
            return;
        }

        // Try software renderer first (more compatible with Emscripten)
        renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_SOFTWARE);
        if (!renderer)
        {
            std::cout << "Software renderer failed, trying accelerated: " << SDL_GetError() << std::endl;
            renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
        }

        if (!renderer)
        {
            std::cout << "Accelerated renderer failed, trying default: " << SDL_GetError() << std::endl;
            renderer = SDL_CreateRenderer(window, -1, 0); // Default flags
        }

        if (!renderer)
        {
            std::cerr << "All renderer creation attempts failed! SDL_Error: " << SDL_GetError() << std::endl;
            SDL_DestroyWindow(window);
            SDL_Quit();
            return;
        }
    }

    std::cout << "SDL window and renderer created successfully" << std::endl;

    // Set initial background color
    SDL_SetRenderDrawColor(renderer, background_color.r, background_color.g, background_color.b, background_color.a);
    SDL_RenderClear(renderer);
    SDL_RenderPresent(renderer);
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
        std::cout << "SDL2: Rendered frame " << frame_count << " - Rectangle at (" << std::endl;
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
void Canvas::setBackgroundColor(int r, int g, int b, int a)
{
    using namespace CanvasStates;
    bg[0] = (Uint8)r;
    bg[1] = (Uint8)g;
    bg[2] = (Uint8)b;
    // bg[3] = (Uint8)a;

    background_color.r = (Uint8)(r);
    background_color.g = (Uint8)(g);
    background_color.b = (Uint8)(b);
    background_color.a = (Uint8)(a);

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
    // // Handle mouse click events
    // if(show_grid){
    //         set_grid_settings(false, 20);
    // }else{
    //         set_grid_settings(true, 20);

    // }
    std::cout << "SDL2: Mouse clicked at (" << x << ", " << y << ")" << std::endl;
}