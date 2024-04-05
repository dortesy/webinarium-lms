import { router, publicProcedure } from "@/server/trpc";
import {RegisterSchema, LoginSchema} from "@/schemas";
import {db} from '@/lib/db'
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import bcrypt from "bcryptjs";
import {getUserByEmail} from "@/lib/auth-helpers/auth-helpers";

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

            return {
                result: {
                    user,
                },
            };
        }),

    // login: publicProcedure.input(LoginSchema).mutation(async ({ input }) => {
    //     const { email, password } = input;
    //     const user = await db.user.findUnique({
    //         where: {
    //             email: email as string,
    //         },
    //     });
    //
    //     if (!user) {
    //         throw new TRPCError({
    //             code: 'NOT_FOUND',
    //             message: 'Пользователь с таким email не найден',
    //             // optional: pass the original error to retain stack trace
    //         });
    //     }
    //
    //     const isPasswordValid = await bcrypt.compare(password, user.password);
    //
    //     if (!isPasswordValid) {
    //         throw new TRPCError({
    //             code: 'UNAUTHORIZED',
    //             message: 'Неверный пароль',
    //             // optional: pass the original error to retain stack trace
    //         });
    //     }
    //
    //     return {
    //         result: {
    //             user,
    //         },
    //     };
    // }),



});
