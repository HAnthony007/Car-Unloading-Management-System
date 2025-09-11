import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...input: ClassValue[]): string {
    // Merge conditional class names then resolve Tailwind conflicts
    return twMerge(clsx(...input));
}
