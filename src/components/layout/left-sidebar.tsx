'use client';

import {
  Eye,
  Lock,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

const layers = [
  { name: 'Header Text', type: 'Text' },
  { name: 'Logo Shape', type: 'Path' },
  { name: 'Button Background', type: 'Rectangle' },
  { name: 'User Avatar', type: 'Ellipse' },
  { name: 'Footer Group', type: 'Group' },
];

export function LeftSidebar() {
  return (
    <div className="absolute top-4 left-4 z-20">
      <Card className="w-64 bg-card/80 backdrop-blur-sm">
        <ScrollArea className="max-h-[calc(100svh-12rem)]">
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
      </Card>
    </div>
  );
}
