"use client"
import { XIcon } from 'lucide-react';
import { createContext, useContext } from 'react';
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps as AriaTagProps,
  Button,
  TagList,
  type TagListProps,
  Text,
} from 'react-aria-components/TagGroup';
import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { FieldDescription, FieldLabel } from './Field';
import { focusRing } from '@/lib/focus-ring';

const colors = {
  gray: 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500',
  green: 'bg-green-100 text-green-700 border-green-200 hover:border-green-300 dark:bg-green-300/20 dark:text-green-400 dark:border-green-300/10 dark:hover:border-green-300/20',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:border-yellow-300 dark:bg-yellow-300/20 dark:text-yellow-400 dark:border-yellow-300/10 dark:hover:border-yellow-300/20',
  blue: 'bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 dark:bg-blue-400/20 dark:text-blue-300 dark:border-blue-400/10 dark:hover:border-blue-400/20'
};

type Color = keyof typeof colors;
const ColorContext = createContext<Color>('gray');

const tagStyles = tv({
  base: 'outline-none transition cursor-default text-xs rounded-full border px-3 py-0.5 flex items-center max-w-fit gap-1 font-sans [-webkit-tap-highlight-color:transparent]',
  variants: {
    color: {
      gray: '',
      green: '',
      yellow: '',
      blue: '',
    },
    allowsRemoving: {
      true: 'pr-1',
    },
    isSelected: {
      true: 'bg-primary text-white border-transparent forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-color-adjust-none',
    },
    isDisabled: {
      true: 'bg-neutral-100 dark:bg-transparent dark:border-white/20 text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]',
    },
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
  compoundVariants: [
    { isSelected: false, isDisabled: false, color: 'gray', class: colors.gray },
    { isSelected: false, isDisabled: false, color: 'green', class: colors.green },
    { isSelected: false, isDisabled: false, color: 'yellow', class: colors.yellow },
    { isSelected: false, isDisabled: false, color: 'blue', class: colors.blue },
  ],
});

export interface TagGroupProps<T> extends Omit<AriaTagGroupProps, 'children'>, Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  color?: Color;
  label?: string;
  description?: string;
  errorMessage?: string;
}

export interface TagProps extends AriaTagProps {
  color?: Color
}

export function TagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    ...props
  }: TagGroupProps<T>
) {
  return (
    <AriaTagGroup {...props} className={twMerge('flex flex-col gap-2 font-sans', props.className)}>
      <FieldLabel>{label}</FieldLabel>
      <ColorContext.Provider value={props.color || 'gray'}>
        <TagList items={items} renderEmptyState={renderEmptyState} className="flex flex-wrap gap-1">
          {children}
        </TagList>
      </ColorContext.Provider>
      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <Text slot="errorMessage" className="text-sm text-red-600">{errorMessage}</Text>}
    </AriaTagGroup>
  );
}

const removeButtonStyles = tv({
  extend: focusRing,
  base: 'cursor-default rounded-full transition-[background-color] p-0.5 flex items-center justify-center bg-transparent text-[inherit] border-0 hover:bg-black/10 dark:hover:bg-white/10 pressed:bg-black/20 dark:pressed:bg-white/20'
});

export function Tag({ children, color, ...props }: TagProps) {
  const textValue = typeof children === 'string' ? children : undefined;
  const groupColor = useContext(ColorContext);
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={composeRenderProps(
        props.className,
        (resolvedClassName, renderProps) =>
          tagStyles({
            ...renderProps,
            className: resolvedClassName,
            color: color || groupColor,
          }),
      )}>
      {composeRenderProps(children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving &&
            <Button slot="remove" className={(renderProps) => removeButtonStyles(renderProps)}>
              <XIcon aria-hidden className="w-3 h-3" />
            </Button>
          }
        </>
      ))}
    </AriaTag>
  );
}
