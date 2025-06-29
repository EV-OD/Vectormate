#include <SDL2/SDL.h>
#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include <cmath>
#include <iostream>
#include <string>

// Global state
SDL_Window* window = nullptr;
SDL_Renderer* renderer = nullptr;
int canvas_width = 800;
int canvas_height = 600;

// Background color (default: light gray)
SDL_Color background_color = {240, 240, 240, 255};

// Grid settings
bool show_grid = true;
int grid_size = 20;

// Rectangle properties
struct Rectangle {
    int x, y;
    int width, height;
    SDL_Color color;
    bool selected;
};

Rectangle red_rectangle = {350, 250, 100, 80, {255, 0, 0, 255}, false};

// Function declarations for the required WASM exports
extern "C" {
    void initialize_canvas(int width, int height);
    void render();
    void on_mouse_down(int x, int y, int button);
    void on_mouse_move(int x, int y);
    void on_mouse_up(int x, int y, int button);
    void on_key_down(const char* key);
    void resize_canvas(int new_width, int new_height);
    void set_canvas_background(float r, float g, float b, float a);
    void set_grid_settings(bool show, int size);
}

// Helper function to check if point is inside rectangle
bool point_in_rect(int px, int py, const Rectangle& rect) {
    return px >= rect.x && px <= rect.x + rect.width &&
           py >= rect.y && py <= rect.y + rect.height;
}

// Helper function to draw grid
void draw_grid(SDL_Renderer* renderer) {
    if (!show_grid) return;
    
    SDL_SetRenderDrawColor(renderer, 200, 200, 200, 255); // Light gray grid
    
    // Vertical lines
    for (int x = 0; x < canvas_width; x += grid_size) {
        SDL_RenderDrawLine(renderer, x, 0, x, canvas_height);
    }
    
    // Horizontal lines
    for (int y = 0; y < canvas_height; y += grid_size) {
        SDL_RenderDrawLine(renderer, 0, y, canvas_width, y);
    }
}

// Initialize SDL and create the canvas
void initialize_canvas(int width, int height) {
    std::cout << "Initializing SDL2 canvas: " << width << "x" << height << std::endl;
    
    // Ensure minimum dimensions
    canvas_width = std::max(width, 300);  // Use smaller minimum for testing
    canvas_height = std::max(height, 300);

    if (width <= 0 || height <= 0) {
        std::cout << "Warning: Invalid canvas dimensions, using defaults: " 
                  << canvas_width << "x" << canvas_height << std::endl;
    }
    
    // Set canvas size in Emscripten - this must be done first
    emscripten_set_canvas_element_size("#canvas", canvas_width, canvas_height);
    
    // Initialize SDL with video subsystem
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cerr << "SDL initialization failed: " << SDL_GetError() << std::endl;
        return;
    }
    
    std::cout << "SDL initialized successfully" << std::endl;
    
    // Use the recommended approach from SDL2 docs: SDL_CreateWindowAndRenderer
    if (SDL_CreateWindowAndRenderer(canvas_width, canvas_height, 0, &window, &renderer) < 0) {
        std::cerr << "Window and Renderer creation failed: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return;
    }
    
    std::cout << "SDL window and renderer created successfully" << std::endl;
    
    // Position the rectangle in the center
    red_rectangle.x = (canvas_width - red_rectangle.width) / 2;
    red_rectangle.y = (canvas_height - red_rectangle.height) / 2;
    
    std::cout << "SDL2 canvas initialized successfully with dimensions: " 
              << canvas_width << "x" << canvas_height << std::endl;
    std::cout << "Red rectangle positioned at: " << red_rectangle.x << ", " << red_rectangle.y << std::endl;
}

// Main render function
void render() {
    //this will use the list of current objects to render the frame, it will implement the clipping functions


    if (!renderer) {
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
    
    // Draw the red rectangle (following the docs pattern)
    SDL_SetRenderDrawColor(renderer, 
                          red_rectangle.color.r, 
                          red_rectangle.color.g, 
                          red_rectangle.color.b, 
                          red_rectangle.color.a);
    
    SDL_Rect rect = {red_rectangle.x, red_rectangle.y, red_rectangle.width, red_rectangle.height};
    SDL_RenderFillRect(renderer, &rect);
    
    // Also draw a simple test rectangle like in the docs to ensure it works
    SDL_SetRenderDrawColor(renderer, 0x00, 0x80, 0x00, 0xFF); // Green like in docs
    SDL_Rect test_rect = {10, 10, 150, 100};
    SDL_RenderFillRect(renderer, &test_rect);
    
    // Draw border if selected
    if (red_rectangle.selected) {
        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255); // Black border
        SDL_RenderDrawRect(renderer, &rect);
        
        // Draw selection handles (small squares at corners)
        SDL_Rect handle;
        handle.w = handle.h = 6;
        
        // Top-left handle
        handle.x = rect.x - 3;
        handle.y = rect.y - 3;
        SDL_RenderFillRect(renderer, &handle);
        
        // Top-right handle
        handle.x = rect.x + rect.w - 3;
        handle.y = rect.y - 3;
        SDL_RenderFillRect(renderer, &handle);
        
        // Bottom-left handle
        handle.x = rect.x - 3;
        handle.y = rect.y + rect.h - 3;
        SDL_RenderFillRect(renderer, &handle);
        
        // Bottom-right handle
        handle.x = rect.x + rect.w - 3;
        handle.y = rect.y + rect.h - 3;
        SDL_RenderFillRect(renderer, &handle);
    }
    
    // Present the rendered frame (like in the docs)
    SDL_RenderPresent(renderer);
    
    // Debug log every 60 frames to avoid spam
    static int frame_count = 0;
    frame_count++;
    if (frame_count % 60 == 0) {
        std::cout << "SDL2: Rendered frame " << frame_count << " - Rectangle at (" 
                  << red_rectangle.x << ", " << red_rectangle.y << ")" << std::endl;
    }
}

// Handle mouse down events
void on_mouse_down(int x, int y, int button) {
    std::cout << "SDL2: Mouse down at (" << x << ", " << y << ") button: " << button << std::endl;
    
    // Check if click is on the rectangle
    if (point_in_rect(x, y, red_rectangle)) {
        red_rectangle.selected = true;
        std::cout << "Rectangle selected!" << std::endl;
        
        // Change color slightly to indicate selection
        red_rectangle.color = {220, 20, 20, 255}; // Darker red
    } else {
        red_rectangle.selected = false;
        red_rectangle.color = {255, 0, 0, 255}; // Reset to bright red
        std::cout << "Rectangle deselected" << std::endl;
    }
}

// Handle mouse move events
void on_mouse_move(int x, int y) {
    // Could implement dragging here
    // For now, just update if mouse is over rectangle
    if (point_in_rect(x, y, red_rectangle)) {
        // Mouse is hovering over rectangle
    }
}

// Handle mouse up events
void on_mouse_up(int x, int y, int button) {
    std::cout << "SDL2: Mouse up at (" << x << ", " << y << ") button: " << button << std::endl;
    
    // Reset rectangle color if it was selected
    if (red_rectangle.selected) {
        red_rectangle.color = {255, 0, 0, 255}; // Back to bright red
    }
}

// Handle keyboard events
void on_key_down(const char* key) {
    std::cout << "SDL2: Key pressed: " << key << std::endl;
    
    const int step = 10;
    
    // Simple keyboard controls for moving the rectangle
    if (strcmp(key, "ArrowLeft") == 0) {
        red_rectangle.x = std::max(0, red_rectangle.x - step);
        std::cout << "Rectangle moved left to x=" << red_rectangle.x << std::endl;
    } else if (strcmp(key, "ArrowRight") == 0) {
        red_rectangle.x = std::min(canvas_width - red_rectangle.width, red_rectangle.x + step);
        std::cout << "Rectangle moved right to x=" << red_rectangle.x << std::endl;
    } else if (strcmp(key, "ArrowUp") == 0) {
        red_rectangle.y = std::max(0, red_rectangle.y - step);
        std::cout << "Rectangle moved up to y=" << red_rectangle.y << std::endl;
    } else if (strcmp(key, "ArrowDown") == 0) {
        red_rectangle.y = std::min(canvas_height - red_rectangle.height, red_rectangle.y + step);
        std::cout << "Rectangle moved down to y=" << red_rectangle.y << std::endl;
    } else if (strcmp(key, "g") == 0 || strcmp(key, "G") == 0) {
        show_grid = !show_grid;
        std::cout << "Grid toggled: " << (show_grid ? "ON" : "OFF") << std::endl;
    } else if (strcmp(key, " ") == 0) { // Spacebar
        // Change rectangle color
        if (red_rectangle.color.r == 255) {
            red_rectangle.color = {0, 255, 0, 255}; // Green
            std::cout << "Rectangle color changed to green" << std::endl;
        } else if (red_rectangle.color.g == 255) {
            red_rectangle.color = {0, 0, 255, 255}; // Blue
            std::cout << "Rectangle color changed to blue" << std::endl;
        } else {
            red_rectangle.color = {255, 0, 0, 255}; // Red
            std::cout << "Rectangle color changed to red" << std::endl;
        }
    }
}

// Handle canvas resize
void resize_canvas(int new_width, int new_height) {
    std::cout << "SDL2: Resizing canvas to: " << new_width << "x" << new_height << std::endl;
    
    // Ensure minimum dimensions
    canvas_width = std::max(new_width, 800);
    canvas_height = std::max(new_height, 600);
    
    if (new_width <= 0 || new_height <= 0) {
        std::cout << "Warning: Invalid resize dimensions, using: " 
                  << canvas_width << "x" << canvas_height << std::endl;
    }
    
    // Set canvas size in Emscripten
    emscripten_set_canvas_element_size("#canvas", canvas_width, canvas_height);
    
    // Keep rectangle within bounds
    red_rectangle.x = std::max(0, std::min(red_rectangle.x, canvas_width - red_rectangle.width));
    red_rectangle.y = std::max(0, std::min(red_rectangle.y, canvas_height - red_rectangle.height));
    
    std::cout << "SDL2: Canvas resized successfully to: " 
              << canvas_width << "x" << canvas_height << std::endl;
}

// Set canvas background color
void set_canvas_background(float r, float g, float b, float a) {
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
void set_grid_settings(bool show, int size) {
    show_grid = show;
    grid_size = std::max(5, size); // Minimum grid size of 5 pixels
    
    std::cout << "SDL2: Grid settings: show=" << show_grid << ", size=" << grid_size << std::endl;
}

// Cleanup function
void cleanup() {
    if (renderer) {
        SDL_DestroyRenderer(renderer);
        renderer = nullptr;
    }
    SDL_Quit();
    std::cout << "SDL2 cleanup completed" << std::endl;
}

// Main function (not used in WASM, but good for testing)
int main() {
    initialize_canvas(800, 600);
    
    // In WASM, the render loop will be called from JavaScript
    // This main function is just for reference
    
    return 0;
}
