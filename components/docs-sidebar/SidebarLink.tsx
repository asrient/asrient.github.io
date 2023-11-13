/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useEffect } from 'react';
import * as React from 'react';
import cn from 'classnames';
import { IconNavArrow } from '../icon/IconNavArrow';
import Link from 'next/link';

interface SidebarLinkProps {
  href: string;
  selected?: boolean;
  title: string;
  level: number;
  wip: boolean | undefined;
  icon?: React.ReactNode;
  isExpanded?: boolean;
  hideArrow?: boolean;
  isPending: boolean;
}

export function SidebarLink({
  href,
  selected = false,
  title,
  wip,
  level,
  isExpanded,
  hideArrow,
  isPending,
}: SidebarLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (selected && ref && ref.current) {
      // @ts-ignore
      if (typeof ref.current.scrollIntoViewIfNeeded === 'function') {
        // @ts-ignore
        ref.current.scrollIntoViewIfNeeded();
      }
    }
  }, [ref, selected]);

  let target = '';
  if (href.startsWith('https://')) {
    target = '_blank';
  }
  return (
    <Link
      href={href}
      ref={ref}
      title={title}
      target={target}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'p-2 pr-2 w-full text-left relative flex items-center justify-between',
        {
          'pl-4': level === 0,
          'text-sm': level > 0,
          'pl-8': level == 1,
          'pl-12 font-light text-gray-600 dark:text-gray-400': level >= 2,
          'text-base font-bold': level === 0,
          'bg-gray-300/50 hover:bg-gray-700/50': isPending,
          'text-gray-700 dark:text-gray-300': !selected && level >= 1,
          'hover:bg-gray-100/30 dark:hover:bg-gray-700/30 rounded-sm transition-colors duration-200': !selected,
        }
      )}>
      {/* This here needs to be refactored ofc */}
      <span
        className={cn(
          'flex items-center truncate', {
          'text-gray-400 dark:text-gray-500': wip,
        })}>
        {title}
      </span>
      {isExpanded != null && !hideArrow && (
        <span
          className={cn('pr-1', {
            'text-link dark:text-link-dark': isExpanded,
            'text-tertiary dark:text-tertiary-dark': !isExpanded,
          })}>
          <IconNavArrow displayDirection={isExpanded ? 'down' : 'right'} />
        </span>
      )}
    </Link>
  );
}
