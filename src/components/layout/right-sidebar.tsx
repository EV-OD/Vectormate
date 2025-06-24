'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Rows,
  Columns,
  Minus,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BooleanOperationsIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';

export function RightSidebar() {
  return (
    <div className="absolute top-4 right-4 z-20">
      <Card className="w-72 bg-card/80 backdrop-blur-sm">
        <ScrollArea className="max-h-[calc(100svh-12rem)]">
          <Accordion type="multiple" defaultValue={['transform', 'appearance', 'typography', 'align', 'boolean']} className="w-full p-2">
            
            <AccordionItem value="transform">
              <AccordionTrigger className="text-sm font-medium">Transform</AccordionTrigger>
              <AccordionContent className="p-2 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="x-pos">X</Label>
                    <Input id="x-pos" defaultValue="128" />
                  </div>
                  <div>
                    <Label htmlFor="y-pos">Y</Label>
                    <Input id="y-pos" defaultValue="256" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="width">W</Label>
                    <Input id="width" defaultValue="200" />
                  </div>
                  <div>
                    <Label htmlFor="height">H</Label>
                    <Input id="height" defaultValue="100" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="appearance">
              <AccordionTrigger className="text-sm font-medium">Appearance</AccordionTrigger>
              <AccordionContent className="p-2 space-y-4">
                 <div>
                    <Label>Fill</Label>
                    <div className="flex items-center gap-2">
                      <Input type="color" defaultValue="#3399FF" className="h-8 w-8 p-1"/>
                      <Input defaultValue="#3399FF" className="flex-1"/>
                    </div>
                 </div>
                 <div>
                    <Label>Stroke</Label>
                    <div className="flex items-center gap-2">
                      <Input type="color" defaultValue="#000000" className="h-8 w-8 p-1"/>
                      <Input defaultValue="#000000" className="flex-1"/>
                      <Input type="number" defaultValue="1" className="w-16"/>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="typography">
              <AccordionTrigger className="text-sm font-medium">Typography</AccordionTrigger>
              <AccordionContent className="p-2 space-y-4">
                <Select defaultValue="inter">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="arial">Arial</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Select defaultValue="regular">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" defaultValue="16" />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="align">
              <AccordionTrigger className="text-sm font-medium">Align & Distribute</AccordionTrigger>
              <AccordionContent className="p-2">
                  <div className="grid grid-cols-3 gap-1">
                      <Button variant="ghost" size="icon"><AlignHorizontalDistributeCenter/></Button>
                      <Button variant="ghost" size="icon"><AlignVerticalDistributeCenter/></Button>
                      <Button variant="ghost" size="icon"><Rows/></Button>
                      <Button variant="ghost" size="icon"><Columns/></Button>
                  </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="boolean">
              <AccordionTrigger className="text-sm font-medium">Boolean Operations</AccordionTrigger>
              <AccordionContent className="p-2">
                  <div className="grid grid-cols-4 gap-1">
                      <Button variant="ghost" size="icon"><BooleanOperationsIcon className="h-5 w-5"/></Button>
                      <Button variant="ghost" size="icon"><Minus/></Button>
                  </div>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </ScrollArea>
      </Card>
    </div>
  );
}
