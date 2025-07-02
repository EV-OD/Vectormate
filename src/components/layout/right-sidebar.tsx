
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { BooleanOperationsIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ColorPicker } from '../ui/color-picker';

export function RightSidebar() {
  const [fillColor, setFillColor] = useState('rgba(51, 153, 255, 1)');
  const [strokeColor, setStrokeColor] = useState('rgba(0, 0, 0, 1)');

  return (
    <div data-interactive-panel="true" className="absolute top-4 right-4 z-20">
      <Card className="w-72 bg-card/80 backdrop-blur-sm">
        <div className="max-h-[calc(100svh-8rem)] overflow-y-auto custom-scrollbar">
          <div className="pr-1">
            <Accordion type="multiple" defaultValue={['transform', 'appearance', 'typography', 'align', 'boolean']} className="w-full">
              
              <AccordionItem value="transform">
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">Transform</AccordionTrigger>
                <AccordionContent className="px-4 space-y-4">
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
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">Appearance</AccordionTrigger>
                <AccordionContent className="px-4 space-y-4">
                  <div className="space-y-2">
                      <Label>Fill</Label>
                      <ColorPicker color={fillColor} onChange={setFillColor} />
                  </div>
                  <div className="space-y-2">
                      <Label>Stroke</Label>
                      <div className="flex items-center gap-2">
                        <ColorPicker color={strokeColor} onChange={setStrokeColor} className="flex-1" />
                        <Input type="number" defaultValue="1" className="w-16 h-8"/>
                      </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="typography">
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">Typography</AccordionTrigger>
                <AccordionContent className="px-4 space-y-4">
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
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">Align & Distribute</AccordionTrigger>
                <AccordionContent className="px-4">
                    <div className="grid grid-cols-3 gap-1">
                        <Button variant="ghost" size="icon"><AlignHorizontalDistributeCenter/></Button>
                        <Button variant="ghost" size="icon"><AlignVerticalDistributeCenter/></Button>
                        <Button variant="ghost" size="icon"><Rows/></Button>
                        <Button variant="ghost" size="icon"><Columns/></Button>
                    </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="boolean" className="border-b-0">
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">Boolean Operations</AccordionTrigger>
                <AccordionContent className="px-4">
                    <div className="grid grid-cols-4 gap-1">
                        <Button variant="ghost" size="icon"><BooleanOperationsIcon className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon"><Minus/></Button>
                    </div>
                </AccordionContent>
              </AccordionItem>
              
            </Accordion>
          </div>
        </div>
      </Card>
    </div>
  );
}
