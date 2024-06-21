'use client';
import React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@/navigation';
import { IUnsavedChangesContext } from '@/lib/types/UnsavedChanges.types';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const UnsavedChangesModal: React.FC<IUnsavedChangesContext> = ({
  modalContent = {},
  setModalContent,
  showModal,
  setShowModal,
}) => {
  const t = useTranslations('UnsavedChangesModal');
  const title = t('title');
  const message = t('message');
  const dismissButtonLabel = t('dismissButtonLabel');
  const proceedLinkLabel = t('proceedLinkLabel');
  return (
    <Dialog
      open={showModal}
      onOpenChange={() => {
        setShowModal(false);
      }}
    >
      <DialogContent className="modal-content">
        <DialogHeader>
          <DialogTitle>{modalContent.title || title}</DialogTitle>
          <DialogDescription>
            {modalContent.message || message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalContent.dismissButtonLabel || dismissButtonLabel}
            </Button>
          </DialogClose>

          <Button asChild>
            <Link
              href={modalContent ? modalContent.proceedLinkHref! : '/'}
              onClick={() => {
                setShowModal(false);
                setModalContent(undefined);
              }}
            >
              {modalContent.proceedLinkLabel || proceedLinkLabel}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnsavedChangesModal;
