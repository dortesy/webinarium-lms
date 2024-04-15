import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema} from "@/schemas/auth.schema";
import {db} from "@/lib/db";
import {getUserByEmail} from "@/lib/auth/auth-helper";
import bcrypt from "bcryptjs";

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const ValidatedCredentials = LoginSchema.safeParse(credentials);
                if (ValidatedCredentials.success) {
                    const {email, password} = ValidatedCredentials.data;
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) return user;
                }
                return null;
            }
        })

    ],
} satisfies NextAuthConfig