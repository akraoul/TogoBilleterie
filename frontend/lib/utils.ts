import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValidImageUrl(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined;

  // If we are in production (not localhost) but the URL points to localhost (bad data), fix it.
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Replace localhost:3001 with the actual backend URL from env
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') || 'https://togobilleterie-production.up.railway.app';
    return imageUrl.replace('http://localhost:3001', backendUrl);
  }

  return imageUrl;
}
