import { router, publicProcedure } from "@/server/trpc";
import {RegisterSchema, LoginSchema} from "@/schemas/auth.schema";
import {db} from '@/lib/db'
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import bcrypt from "bcryptjs";
import {getUserByEmail} from "@/lib/auth/auth-helper";
import {generateVerificationToken} from "@/lib/auth/tokens";
import {sendVerificationEmail} from "@/lib/auth/mail";

export const authRouter = router({
    createUser: publicProcedure
        .input(RegisterSchema)
        .mutation(async ({ input }) => {
            const { email, password } = input;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userExist = await getUserByEmail(email)

            if (userExist) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Пользователь с таким email уже существует',
                    // optional: pass the original error to retain stack trace
                });
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
        }),



});
