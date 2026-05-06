import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

type RenderProps<T extends object> = T & { defaultClassName: string | undefined };

export function composeTailwindRenderProps<T extends object>(
  className: string | ((values: RenderProps<T>) => string) | undefined,
  tailwind: string,
) {
  return composeRenderProps(className, (prev, _renderProps) =>
    twMerge(tailwind, prev ?? ''),
  );
}
