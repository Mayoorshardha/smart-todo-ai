import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-purple-100 text-purple-800',
    health: 'bg-green-100 text-green-800',
    shopping: 'bg-orange-100 text-orange-800',
    education: 'bg-cyan-100 text-cyan-800',
    finance: 'bg-lime-100 text-lime-800',
    home: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[category.toLowerCase()] || colors.other;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };
  return colors[priority.toLowerCase()] || colors.medium;
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}