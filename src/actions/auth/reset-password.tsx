'use server';

import * as z from 'zod';
import { ForgotPasswordSchema } from '@/schemas/auth.schema';
import { getUserByEmail } from '@/lib/auth/auth-helper';
import { generatePasswordResetToken } from '@/lib/auth/tokens';
import { sendForgotPasswordEmail } from '@/lib/auth/mail';
import { getTranslations } from 'next-intl/server';

export const resetPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>,
) => {
  const t = await getTranslations('ForgotPassword');
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('messages.invalidEmail') };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: t('messages.emailNotFound') };
  }

  if (!existingUser.emailVerified) {
    return { error: t('messages.emailNotVerified') };
  }
  // TODO send email with reset password link

  try {
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendForgotPasswordEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
    return {
      success: t('messages.success'),
    };
  } catch {
    console.error();
    return { error: t('messages.error') };
  }
};
