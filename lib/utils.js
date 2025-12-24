import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Logic: Stars fade from 1.0 to 0.3 opacity and shrink by up to 50% over 365 days
export function calculateAging(createdAtString, originalSize) {
  const createdDate = new Date(createdAtString);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  const ageFactor = Math.min(diffDays / 365, 1);

  return {
    opacity: 1.0 - (ageFactor * 0.7),
    currentSize: Math.max(2, originalSize * (1 - (ageFactor * 0.5)))
  };
}