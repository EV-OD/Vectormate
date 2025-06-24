
'use client';

import * as React from 'react';
import { SketchPicker, type ColorResult } from 'react-color';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const handleChange = (newColor: ColorResult) => {
    const { r, g, b, a } = newColor.rgb;
    onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <Popover open={displayColorPicker} onOpenChange={setDisplayColorPicker}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border"
                    aria-label="Pick a color"
                >
                  <div className="w-full h-full rounded-sm" style={{ backgroundColor: color }} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto border-none">
                <SketchPicker color={color} onChangeComplete={handleChange} />
            </PopoverContent>
        </Popover>
        <Input
            value={color}
            onChange={handleInputChange}
            className="flex-1 h-8"
        />
    </div>
  );
}
