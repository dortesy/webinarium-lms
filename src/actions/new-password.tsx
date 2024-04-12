"use server"
import * as z from "zod"
import {NewPasswordSchema} from "@/schemas/auth";
import {getPasswordResetToken, getUserByEmail} from "@/lib/helpers/auth-helper";
import bycrypt from "bcryptjs";
import {db} from "@/lib/db";
import {login} from "@/actions/login";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";


export const newPassword = async (values:z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    if (!token) {
        return {error: "Неверный токен"}
    }
    const validatedFields = NewPasswordSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Пароль должен быть не менее 6 символов"}
    }
    const password = validatedFields.data.password;

    const existingToken = await getPasswordResetToken(token);

    if (!existingToken) {
        return {error: "Неверный токен"}
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
        return {error: "Срок действия токена истек"}
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {error: "Пользователь не найден"}
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    })


    return {success: "Пароль успешно изменен, вы будете перенаправлены на страницу входа через 3 секунды"}
}