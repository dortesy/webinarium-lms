'use server'
import * as z from "zod";

import { LoginSchema} from "@/schemas/auth";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {getUserByEmail} from "@/lib/helpers/auth-helper";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const {email, password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Введены неверные данные"};
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { error: "Email не подтвержден, пожалуйста подтвердите ваш email. Письмо с подтверждением отправлено на вашу почту" };
    }

    try {
         await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });

        return {success: true};


    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Неверный логин или пароль"};
                default:
                    return {error: "Что-то пошло не так. Попробуйте позже"};
            }
        }
        throw error;
    }


};