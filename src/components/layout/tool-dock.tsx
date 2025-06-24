'use client';

import {
  MousePointer2,
  RectangleHorizontal,
  Circle,
  Baseline,
  Type,
  Hand,
} from 'lucide-react';
import { PenToolIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';

const tools = [
  { icon: MousePointer2, label: 'Select (V)' },
  { icon: RectangleHorizontal, label: 'Rectangle (R)' },
  { icon: Circle, label: 'Ellipse (O)' },
  { icon: PenToolIcon, label: 'Pen (P)' },
  { icon: Baseline, label: 'Line (L)' },
  { icon: Type, label: 'Text (T)' },
  { icon: Hand, label: 'Pan (H)' },
];

export function ToolDock() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <TooltipProvider delayDuration={0}>
        <Card className="p-1">
          <div className="flex items-center gap-1">
            {tools.map((tool, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={index === 0 ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9"
                    aria-label={tool.label}
                  >
                    <tool.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </Card>
      </TooltipProvider>
    </div>
  );
}
