import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  //return "http://localhost:3000";
  return "https://proyecto13backend.vercel.app";
   
  }
