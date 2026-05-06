"use client"
import {
  Label as AriaLabel,
  Text,
  type LabelProps,
} from 'react-aria-components';
import type { ComponentProps } from 'react';

export function Label(props: LabelProps) {
  return <AriaLabel {...props} />;
}

export function Description(props: ComponentProps<typeof Text>) {
  return <Text {...props} slot="description" />;
}
