'use client';

import {
  MousePointer2,
  RectangleHorizontal,
  Circle,
  Baseline,
  Type,
  Hand,
  Layers,
  Eye,
  Lock,
} from 'lucide-react';
import { PenToolIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '../ui/scroll-area';

const tools = [
  { icon: MousePointer2, label: 'Select (V)' },
  { icon: RectangleHorizontal, label: 'Rectangle (R)' },
  { icon: Circle, label: 'Ellipse (O)' },
  { icon: PenToolIcon, label: 'Pen (P)' },
  { icon: Baseline, label: 'Line (L)' },
  { icon: Type, label: 'Text (T)' },
  { icon: Hand, label: 'Pan (H)' },
];

const layers = [
  { name: 'Header Text', type: 'Text' },
  { name: 'Logo Shape', type: 'Path' },
  { name: 'Button Background', type: 'Rectangle' },
  { name: 'User Avatar', type: 'Ellipse' },
  { name: 'Footer Group', type: 'Group' },
];

export function LeftSidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex flex-none items-center justify-center p-2">
        <div className="grid grid-cols-2 gap-1">
          <TooltipProvider delayDuration={0}>
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
                <TooltipContent side="right">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
              Layers
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 px-2">
                {layers.map((layer, index) => (
                  <div key={index} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <span>{layer.name}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="h-4 w-4 hover:text-foreground" />
                        <Lock className="h-4 w-4 hover:text-foreground"/>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </ScrollArea>
      </div>
    </aside>
  );
}
