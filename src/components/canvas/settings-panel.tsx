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

export function CanvasSettingsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Canvas Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
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
                    <Input id="canvas-width" defaultValue="1920" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="canvas-height">Height</Label>
                    <Input id="canvas-height" defaultValue="1080" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex items-center gap-2">
                    <Input type="color" id="bg-color-picker" defaultValue="#F0F8FF" className="h-10 w-10 p-1"/>
                    <Input id="bg-color" defaultValue="#F0F8FF" />
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <h4 className="font-medium">Grid & Snapping</h4>
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid">Show Grid</Label>
                    <Switch id="show-grid" defaultChecked/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="grid-size">Grid Size (px)</Label>
                    <Input id="grid-size" defaultValue="20" />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="snap-grid">Snap to Grid</Label>
                    <Switch id="snap-grid" defaultChecked/>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="snap-object">Snap to Object</Label>
                    <Switch id="snap-object" defaultChecked/>
                </div>
            </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
