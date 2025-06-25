#include <SDL2/SDL.h>
#include <emscripten.h>
#include <iostream>

SDL_Window *window;
SDL_Renderer *renderer;

// Simple render function based on SDL2 docs
void render_frame() {
    // Clear with black background
    SDL_SetRenderDrawColor(renderer, 0x00, 0x00, 0x00, 0xFF);
    SDL_RenderClear(renderer);
    
    // Draw green rectangle like in the docs
    SDL_SetRenderDrawColor(renderer, 0x00, 0x80, 0x00, 0xFF);
    SDL_Rect rect = {10, 10, 150, 100};
    SDL_RenderFillRect(renderer, &rect);
    
    // Draw red rectangle for our test
    SDL_SetRenderDrawColor(renderer, 0xFF, 0x00, 0x00, 0xFF);
    SDL_Rect red_rect = {180, 50, 120, 80};
    SDL_RenderFillRect(renderer, &red_rect);
    
    SDL_RenderPresent(renderer);
}

extern "C" {
    void simple_init() {
        std::cout << "Simple SDL2 init starting..." << std::endl;
        
        SDL_Init(SDL_INIT_VIDEO);
        
        // Use the exact pattern from SDL2 docs
        SDL_CreateWindowAndRenderer(400, 300, 0, &window, &renderer);
        
        std::cout << "SDL2 initialized successfully" << std::endl;
        
        // Render immediately
        render_frame();
    }
    
    void simple_render() {
        render_frame();
    }
}
