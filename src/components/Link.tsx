import React, { type MouseEvent, useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter } from '@/navigation';
import { LinkProps } from '@/lib/types/Link.types';
import { useUnsavedChanges } from '@/providers/UnsavedChangesProvider';

const Link: React.FC<LinkProps> = ({
  href,
  onClick,
  children,
  ...nextLinkProps
}) => {
  const nextRouter = useRouter();
  const { currentPageHasUnsavedChanges, showUnsavedChangesModal } =
    useUnsavedChanges();

  const handleLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
      }

      if (currentPageHasUnsavedChanges) {
        showUnsavedChangesModal(href.toString());
      } else {
        nextRouter.push(href.toString());
      }
    },
    [
      currentPageHasUnsavedChanges,
      href,
      nextRouter,
      onClick,
      showUnsavedChangesModal,
    ],
  );

  return (
    <NextLink href={href} onClick={handleLinkClick} {...nextLinkProps}>
      {children}
    </NextLink>
  );
};

export default Link;
