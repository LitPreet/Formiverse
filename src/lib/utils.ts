import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFirst25Words = (text:string) => {
  if (!text) return ""; 
  const words = text.split(" ").join(",");
  return words.length > 25 ? 
    (words.slice(0, 25).split(",").join(" ")+'...') : text
};