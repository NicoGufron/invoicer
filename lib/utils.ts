import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD"}).format(n);
}

export function formatDate(d: string) {
  if (!d) return;
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}