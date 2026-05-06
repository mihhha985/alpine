"use client"
import { tv } from 'tailwind-variants';

export const focusRing = tv({
  base: 'outline-none',
  variants: {
    isFocusVisible: {
      false: '',
      true: 'outline-2 outline-offset-2 outline-blue-600',
    },
    isInvalid: {
      false: '',
      true: 'outline-red-600',
    },
  },
  defaultVariants: {
    isFocusVisible: false,
    isInvalid: false,
  },
});
