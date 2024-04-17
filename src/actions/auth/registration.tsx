'use server'
import * as z from "zod"
import {RegisterSchema, LoginSchema} from "@/schemas/auth.schema";
import {db} from '@/lib/db'
import bcrypt from "bcryptjs";
import {getUserByEmail} from "@/lib/auth/auth-helper";
import {generateVerificationToken} from "@/lib/auth/tokens";
import {sendVerificationEmail} from "@/lib/auth/mail";


export const Registration = async(values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const { email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExist = await getUserByEmail(email)

    if (userExist) {
        return {error: 'Пользователь с таким email уже существует'};
    }

    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {success: "Для активации аккаунта перейдите по ссылке в письме, отправленном на вашу почту"}
}