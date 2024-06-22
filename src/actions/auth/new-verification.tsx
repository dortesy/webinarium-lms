'use server';

import { db } from '@/lib/db';
import { getUserByEmail, getVerificationToken } from '@/lib/auth/auth-helper';
import { getTranslations } from 'next-intl/server';

export const newVerification = async (token: string) => {
  const t = await getTranslations('VerificationForm');
  const existingToken = await getVerificationToken(token);

  if (!existingToken) {
    return { error: t('messages.tokenNotFound') };
  }

  const hasTokenExpired = new Date() > existingToken.expires;

  if (hasTokenExpired) {
    return { error: t('messages.tokenExpired') };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: t('messages.emailNotFound') };
  }

  try {
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: t('messages.verificationSuccess') };
  } catch {
    return {
      error: t('messages.genericError'),
    };
  }
};
