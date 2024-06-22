'use server';
import * as z from 'zod';
import { RegisterSchema } from '@/schemas/auth.schema';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/auth/auth-helper';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/auth/mail';
import { getTranslations } from 'next-intl/server';

export const Registration = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  const t = await getTranslations('Registration');

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userExist = await getUserByEmail(email);

  if (userExist) {
    if (!userExist.emailVerified) {
      return { error: t('messages.needVerification') };
    }
    return { error: t('messages.userExists') };
  }

  try {
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch {
    console.error();
    return { error: t('messages.registrationError') };
  }

  try {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success: t('messages.verificationSuccess'),
    };
  } catch {
    console.error();
    return { error: t('messages.verificationError') };
  }
};
