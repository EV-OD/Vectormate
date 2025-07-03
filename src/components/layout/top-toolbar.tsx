'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Undo,
  Redo,
  Grid,
  Expand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Input } from '../ui/input';
import useCanvasState from '@/states/canvasStates';

export function TopToolbar() {
  const { zoomLevel, setZoomLevel } = useCanvasState();
  const handleZoomIn = () => setZoomLevel(zoomLevel + 25);
  const handleZoomOut = () => setZoomLevel(zoomLevel - 25);

  return (
    <header className="z-10 flex h-14 items-center gap-2 border-b bg-card px-4">
      <div className="flex items-center gap-1">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M188 80a52 52 0 0 1-91.44 33.33A52 52 0 1 1 128 204a52 52 0 0 1 31.44-88.67A52 52 0 0 1 188 80Z"
            ></path>
          </svg>
          <span className="sr-only">VectorMate</span>
        </div>
        <h1 className="text-lg font-semibold">VectorMate</h1>
      </div>
      <Menubar className="border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
            <MenubarItem>Open <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
            <MenubarItem>Export <MenubarShortcut>⇧⌘E</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
            <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Toggle Grid <MenubarShortcut>⇧⌘G</MenubarShortcut></MenubarItem>
            <MenubarItem>Toggle Rulers</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Fullscreen</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Separator orientation="vertical" className="h-8" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Undo">
          <Undo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Redo">
          <Redo className="h-5 w-5" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Toggle Grid">
          <Grid className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Fullscreen">
          <Expand className="h-5 w-5" />
        </Button>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Zoom Out">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            className="w-16 h-8 text-center"
            value={`${Math.round(zoomLevel)}%`}
            readOnly
          />
          <Button variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Zoom In">
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
