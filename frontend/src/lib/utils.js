import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getBaseURL = () => {
    return "http://localhost:3000/";
    //return "https://smartysubbackend.vercel.app/";
};
