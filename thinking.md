## Canvas Features
+ grid (size, on/off)
+ background 
+ size
+ zoom level
+ panning
+ events
    + mousedown
    + mouseup
    + mousemove
    + keyboard press
    + drag ```(derived)```
        + ondragstart
        + ondragend
        + ondragupdate

## Toolbar State
+ tool selected

## Object State
+  Object selected

## Drawing
+ 

---

## Change Log

### Dependency Fix for `zustand`
*   **Issue**: The application failed to build with a `Module not found: Can't resolve 'zustand'` error.
*   **Resolution**: Updated the `zustand` package version in `package.json`. This action triggered a re-installation of dependencies, resolving the module resolution issue.
