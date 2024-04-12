import NextAuth from "next-auth"
import authConfig  from "@/auth.config";
import {db} from "@/lib/db";
import {getUserById} from "@/lib/helpers/auth-helper";
import {PrismaAdapter} from "@auth/prisma-adapter";



export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        newUser: "/auth/register",
        error: "/auth/error",
    },
    events: {
        async linkAccount({user}) {
            if (user.id) {
                await db.user.update({
                    where: { id: user.id },
                    data: { emailVerified: new Date() },
                })
            }
        }
    },
    callbacks: {

        async signIn({user, account}) {
            if (account?.provider !== "credentials") return true;

            const existingUser = user.id ? await getUserById(user.id) : undefined;
            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({token, session}) {

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.roleId && session.user) {
                session.user.roleId = Number(token.roleId);
            }

            if (token.isVerified && session.user) {
                session.user.isVerified = Boolean(token.isVerified);
            }

            return session;
        },

        async jwt({token}) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if(!existingUser) return token;

            token.roleId = existingUser.roleId;
            token.isVerified = existingUser.isVerified;

            return token;
        }

    },


    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
   ...authConfig,
})