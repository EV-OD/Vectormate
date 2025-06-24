# **App Name**: VectorMate

## Core Features:

- Top Toolbar: Set up a top toolbar for global commands and document-level controls like File (New, Open, Save, Export), Edit (Undo, Redo), View (Grid, Rulers, Fullscreen), Tool Shortcuts, Canvas Settings, and Zoom Control.
- Left Sidebar: Implement a left sidebar with vertical icon bar for vector creation tools such as Select, Rectangle, Ellipse, Pen/Path, Line, Text, and Zoom/Pan. Include a toggleable Layers panel with object hierarchy.
- Canvas Workspace: Develop a central drawing canvas with zooming and panning capabilities, grid rendering via background CSS, and support for rendering basic SVG shapes for placeholder visuals. The entire scene, geometry, and rendering is handled inside C++ (WASM). JavaScript only handles user input (mouse, keyboard) and passes it to WASM. This keeps performance optimal even for complex drawings or thousands of objects. The canvas in the DOM is just a view surface all rendering is handled inside WebAssembly via OpenGL ES2 (WebGL) or Canvas 2D API. WASM rendering will be manually implemented.
- Right Sidebar: Establish a right sidebar as a dynamic properties panel to edit properties of selected objects. Sections include Transform, Appearance, Typography (for text), Constraints/Align, and Boolean Ops.
- Bottom Bar: Create a bottom bar for showing zoom level, cursor position, toggling grid, and canvas settings. This includes items such as Zoom level display, X/Y position updates, grid toggle switch, and a canvas settings button.
- Canvas Settings: Design a canvas settings panel (drawer or modal) activated via the top or bottom bar buttons, featuring fields for Canvas Width/Height, Background color picker, Grid settings (Show/hide, Size), and Snapping options (Snap to Grid, Snap to Object).
- placeholder function: A placeholder function in js to implement WASM
- Modular Codebase: every file are modular and seperated in different file to manage code and do it in standard way
- WASM Docs: A docs for WASM needed function and setup docs to integrate wasm function wiht js

## Style Guidelines:

- Primary color: HSL(210, 70%, 50%) - A vibrant blue (#3399FF) evokes trust and clarity, essential for design software.
- Background color: HSL(210, 20%, 95%) - A very light blue (#F0F8FF) creates a clean, unobtrusive backdrop.
- Accent color: HSL(180, 60%, 40%) - A contrasting teal (#33BDBD) highlights interactive elements and calls to action.
- Font: 'Inter' (sans-serif) for both headlines and body text; this font has a modern, machined, objective, neutral look and is very legible.
- Crisp, minimalist icons that clearly represent each tool and function.
- Modular panel design to enhance the customizability, re-arrange the panels according to user preference
- Subtle animations on panel transitions, button hover and interactive notifications provide instant and helpful feedback for a smooth and responsive feel