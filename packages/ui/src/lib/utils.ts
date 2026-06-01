import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with `clsx` then resolve Tailwind conflicts with `tailwind-merge`.
 * Consumer-supplied classes should be passed last so they win over component defaults.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
