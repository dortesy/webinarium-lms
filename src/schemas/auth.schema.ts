import * as z from "zod";
import { RoleId } from '@/enums/roleId';

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Пароль должен быть не менее 6 символов",
    }),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Введите Email",
    }),
});



export const LoginSchema = z.object({
    email: z.string().email({
        message: "Введите Email",
    }),
    password: z.string().min(1, {
        message: "Введите пароль",
    }),
    code: z.optional(z.string()),
});


export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Введите Email",
    }),
    password: z.string().min(6, {
        message: "Пароль должен быть не менее 6 символов",
    }),
})