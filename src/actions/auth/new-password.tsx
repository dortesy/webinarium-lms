'use server';
import * as z from 'zod';
import { NewPasswordSchema } from '@/schemas/auth.schema';
import { getPasswordResetToken, getUserByEmail } from '@/lib/auth/auth-helper';
import { db } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import bcrypt from 'bcryptjs';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  const t = await getTranslations('NewPasswordForm');

  if (!token) {
    return { error: t('messages.invalidToken') };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('messages.passwordTooShort') };
  }

  const password = validatedFields.data.password;

  const existingToken = await getPasswordResetToken(token);

  if (!existingToken) {
    return { error: t('messages.invalidToken') };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return { error: t('messages.tokenExpired') };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: t('messages.userNotFound') };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
    return { success: t('messages.success') };
  } catch {
    return { error: t('messages.error') };
  }
};
