import NextAuth from "next-auth"
import authConfig  from "@/auth.config";
import {db} from "@/lib/db";
import {getUserById} from "@/lib/auth-helpers/auth-helpers";
import {PrismaAdapter} from "@auth/prisma-adapter";



export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
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
        async session({token, session}) {

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.roleId && session.user) {
                session.user.roleId = Number(token.roleId);
            }
            return session;
        },

        async jwt({token}) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if(!existingUser) return token;

            token.roleId = existingUser.roleId;

            return token;
        }

    },


    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
   ...authConfig,
})