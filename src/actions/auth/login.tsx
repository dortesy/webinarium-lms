'use server';
import * as z from 'zod';

import { LoginSchema } from '@/schemas/auth.schema';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/auth/auth-helper';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/auth/mail';
import { getTranslations } from 'next-intl/server';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  const t = await getTranslations('LoginForm');

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: t('messages.invalidCredentials') };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { error: t('messages.emailNotVerified') };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: t('messages.success') };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: t('messages.invalidLogin') };
        default:
          return { error: t('messages.genericError') };
      }
    }
    throw error;
  }
};
