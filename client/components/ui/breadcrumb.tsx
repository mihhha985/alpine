"use client"
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link,
  type BreadcrumbProps,
  type BreadcrumbsProps,
  type LinkProps,
} from 'react-aria-components/Breadcrumbs';
import { twMerge } from 'tailwind-merge';
import { composeTailwindRenderProps } from '@/lib/compose-tailwind-render-props';

export function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>) {
  return <AriaBreadcrumbs {...props} className={twMerge('flex gap-1', props.className)} />;
}

export function Breadcrumb(props: BreadcrumbProps & Omit<LinkProps, 'className'>) {
  return (
    <AriaBreadcrumb {...props} className={composeTailwindRenderProps(props.className, 'flex items-center gap-1 hover:not-last:underline')}>
      {({isCurrent}) => (<>
       <Link {...props} />
        {!isCurrent && <ChevronRight className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />}
      </>)}
    </AriaBreadcrumb>
  );
}
