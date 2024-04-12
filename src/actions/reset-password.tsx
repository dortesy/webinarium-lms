"use server"

import * as z from "zod";
import {ForgotPasswordSchema} from "@/schemas/auth";
import {getUserByEmail} from "@/lib/helpers/auth-helper";
import {generatePasswordResetToken} from "@/lib/tokens";
import {sendForgotPasswordEmail} from "@/lib/mail";


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