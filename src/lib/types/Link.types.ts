import type { HTMLAttributes, PropsWithChildren } from 'react';
import type { LinkProps as NextLinkProps } from 'next/link';

export type LinkProps = PropsWithChildren<
  NextLinkProps & HTMLAttributes<HTMLAnchorElement>
>;
