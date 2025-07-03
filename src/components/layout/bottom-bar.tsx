'use client';

import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CanvasSettingsPanel } from '@/components/canvas/settings-panel';
import { useState, useEffect } from 'react';
import useCanvasState from '@/states/canvasStates';

export function BottomBar() {
    const { showGrid, setShowGrid, zoomLevel } = useCanvasState();
    const [coords, setCoords] = useState({x: 0, y: 0});
    
    useEffect(() => {
        const handleWindowMouseMove = (event: MouseEvent) => {
          setCoords({
            x: event.clientX,
            y: event.clientY,
          });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);
    
        return () => {
          window.removeEventListener('mousemove', handleWindowMouseMove);
        };
      }, []);

  return (
    <footer className="flex h-10 items-center gap-4 border-t bg-card px-4 text-sm">
      <div className="flex items-center gap-2">
        <span>Zoom: {Math.round(zoomLevel)}%</span>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-2 tabular-nums">
        <span>X: {coords.x.toFixed(0)}</span>
        <span>Y: {coords.y.toFixed(0)}</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="grid-toggle" checked={showGrid} onCheckedChange={setShowGrid} />
          <Label htmlFor="grid-toggle">Grid</Label>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <CanvasSettingsPanel />
      </div>
    </footer>
  );
}
