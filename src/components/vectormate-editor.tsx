'use client';

import { TopToolbar } from '@/components/layout/top-toolbar';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { BottomBar } from '@/components/layout/bottom-bar';
import { CanvasWorkspace } from '@/components/canvas/workspace';
import { ToolDock } from '@/components/layout/tool-dock';
import { useState } from 'react';

export function VectorMateEditor() {
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  return (
    <div className="grid h-svh w-full grid-rows-[auto_1fr_auto] bg-background text-foreground">
      <TopToolbar zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <div className="grid grid-cols-[auto_1fr_auto] overflow-hidden border-t">
        <LeftSidebar />
        <div className="relative">
          <CanvasWorkspace showGrid={showGrid} zoomLevel={zoomLevel} />
          <ToolDock />
        </div>
        <RightSidebar />
      </div>
      <BottomBar showGrid={showGrid} setShowGrid={setShowGrid} zoomLevel={zoomLevel} />
    </div>
  );
}
