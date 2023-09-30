import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCamelCaseText(str: string) {
  return str.split(/(?=[A-Z]+|[0-9]+)/).join(" ");
}
