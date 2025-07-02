'use client';

import { TopToolbar } from '@/components/layout/top-toolbar';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { BottomBar } from '@/components/layout/bottom-bar';
import { CanvasWorkspace } from '@/components/canvas/workspace';
import { ToolDock } from '@/components/layout/tool-dock';
import { DebugPanel } from '@/components/debug-panel';
import { useState } from 'react';

export function VectorMateEditor() {
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  return (
    <div className="grid h-svh w-full grid-rows-[auto_1fr_auto] bg-background text-foreground">
      <TopToolbar zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <div className="relative flex flex-1 overflow-hidden border-t">
        <CanvasWorkspace showGrid={showGrid} zoomLevel={zoomLevel} />
        <LeftSidebar />
        <RightSidebar />
        <ToolDock />
        {/* <DebugPanel /> */}
      </div>
      <BottomBar showGrid={showGrid} setShowGrid={setShowGrid} zoomLevel={zoomLevel} />
    </div>
  );
}
