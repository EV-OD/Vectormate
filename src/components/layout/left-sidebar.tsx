'use client';

import {
  Eye,
  Lock,
  RectangleHorizontal,
  Circle,
  Type,
  Scissors,
  Folder as GroupIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { PenToolIcon } from '@/components/icons';

const layers = [
  { name: 'Hero Illustration', icon: GroupIcon, type: 'Group' },
  { name: 'Character Outline', icon: PenToolIcon, type: 'Path' },
  { name: 'Shading', icon: PenToolIcon, type: 'Path' },
  { name: 'Button Base', icon: RectangleHorizontal, type: 'Rectangle' },
  { name: 'Icon Circle', icon: Circle, type: 'Ellipse' },
  { name: 'Clipping Mask', icon: Scissors, type: 'Clip' },
  { name: 'Main Title', icon: Type, type: 'Text' },
  { name: 'Sub-heading', icon: Type, type: 'Text' },
  { name: 'Footer links', icon: Type, type: 'Text' },
  { name: 'Background Pattern', icon: PenToolIcon, type: 'Path' },
  { name: 'Logo Shape', icon: PenToolIcon, type: 'Path' },
  { name: 'User Avatar', icon: Circle, type: 'Ellipse' },
  { name: 'CTA Button', icon: RectangleHorizontal, type: 'Rectangle' },
  { name: 'Another Group', icon: GroupIcon, type: 'Group' },
  { name: 'Some other path', icon: PenToolIcon, type: 'Path' },
];

export function LeftSidebar() {
  return (
    <div className="absolute top-4 left-4 z-20">
      <Card className="w-64 bg-card/80 backdrop-blur-sm">
        <div className="max-h-[calc(100svh-8rem)] overflow-y-auto custom-scrollbar">
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                Layers
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-1">
                <div className="flex flex-col gap-0.5 px-1">
                  {layers.map((layer, index) => (
                    <div key={index} className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent">
                      <div className="flex min-w-0 items-center gap-2">
                        <layer.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">{layer.name}</span>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4 hover:text-foreground" />
                          <Lock className="h-4 w-4 hover:text-foreground"/>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  );
}
