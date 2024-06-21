import { Dispatch, SetStateAction } from 'react';

export interface IUnsavedChangesModalContent {
  title?: string;
  message?: string;
  dismissButtonLabel?: string;
  proceedLinkLabel?: string;
  proceedLinkHref?: string;
}

export interface IUnsavedChangesContext {
  modalContent: IUnsavedChangesModalContent | undefined;
  setModalContent: Dispatch<
    SetStateAction<IUnsavedChangesModalContent | undefined>
  >;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}
