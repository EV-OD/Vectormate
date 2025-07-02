import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function rgbaStringToArray(rgba: string): number[] {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
  if (!match) throw new Error("Invalid RGBA string");
  const [, r, g, b, a] = match;
  return [
    parseInt(r, 10),
    parseInt(g, 10),
    parseInt(b, 10),
    a !== undefined ? parseFloat(a) : 1
  ];
}

export function arrayToRgbaString(arr: number[]): string {
  if (arr.length !== 4) throw new Error("Array must have 4 elements");
  const [r, g, b, a] = arr;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}