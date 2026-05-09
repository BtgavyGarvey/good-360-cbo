import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLabel(str : string) {
  // Insert a space before each capital letter
  const withSpaces = str.replace(/([A-Z])/g, ' $1');
  // Capitalize the first letter
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

