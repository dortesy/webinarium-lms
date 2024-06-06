"use client";

import { PlaceholdersAndVanishInput } from "@/components/custom-ui/placeholders-and-vanish-input";
import { useMessages, useTranslations } from 'next-intl';

export function SearchInput() {


  const t = useTranslations('header.searchBlock');
  const messages = useMessages();
  // @ts-ignore
  const keys = Object.keys(messages.header.searchBlock.placeholders);
  // @ts-ignore
  const placeholders = keys.map((word) => t(`placeholders.${word}`));



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
  );
}

