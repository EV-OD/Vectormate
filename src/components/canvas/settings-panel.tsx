'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { ColorPicker } from '../ui/color-picker';
import useCanvasState from '@/states/canvasStates';
import { arrayToRgbaString, rgbaStringToArray } from '@/lib/utils';


export function CanvasSettingsPanel() {
  const { 
    bgColor, setBg, 
    showGrid, setShowGrid, 
    gridSize, setGridSize,
    width, height, setSize,
  } = useCanvasState();

  const handleNumericInputChange = (setter: (value: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setter(0);
      return;
    }
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      setter(parsedValue);
    }
  };

  const handleSizeChange = () => {
    const { width, height } = useCanvasState.getState();
    setSize(width, height);
  };


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Canvas Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="custom-scrollbar overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Canvas Settings</SheetTitle>
          <SheetDescription>
            Adjust the properties of your workspace.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="canvas-width">Width</Label>
              <Input 
                id="canvas-width"
                type="number"
                value={width || ''}
                onChange={handleNumericInputChange((val) => useCanvasState.setState({ width: val }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canvas-height">Height</Label>
              <Input 
                id="canvas-height"
                type="number"
                value={height || ''}
                onChange={handleNumericInputChange((val) => useCanvasState.setState({ height: val }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker color={arrayToRgbaString(bgColor)} onChange={(rbgaStr) => {
              setBg(rgbaStringToArray(rbgaStr))
            }} />
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Grid & Snapping</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-grid">Show Grid</Label>
              <Switch 
                id="show-grid" 
                checked={showGrid}
                onCheckedChange={setShowGrid}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grid-size">Grid Size (px)</Label>
              <Input 
                id="grid-size" 
                type="number"
                min="1"
                value={gridSize || ''}
                onChange={handleNumericInputChange(setGridSize)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="snap-grid">Snap to Grid</Label>
              <Switch id="snap-grid" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="snap-object">Snap to Object</Label>
              <Switch id="snap-object" defaultChecked />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSizeChange}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
