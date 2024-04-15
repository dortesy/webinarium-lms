"use server"

import * as z from "zod";
import {ForgotPasswordSchema} from "@/schemas/auth.schema";
import {getUserByEmail} from "@/lib/auth/auth-helper";
import {generatePasswordResetToken} from "@/lib/auth/tokens";
import {sendForgotPasswordEmail} from "@/lib/auth/mail";


export const resetPassword = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const validatedFields = ForgotPasswordSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Неверный E-mail"}
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
        return {error: "E-mail не найден"}
    }

    // TODO send email with reset password link
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendForgotPasswordEmail(passwordResetToken.email, passwordResetToken.token);

    return {success: "Письмо с инструкциями по восстановлению пароля отправлено на вашу почту"}
}