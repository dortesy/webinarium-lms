import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { db } from '@/lib/db';
import { getUserByEmail, getUserById } from '@/lib/auth/auth-helper';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  UploadImageFromURLToProfile,
  UploadImageToProfile,
} from './lib/media/upload-image';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    newUser: '/auth/register',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        //console.log('Profile:', profile, 'User:', user, 'Account:', account);
        //console.log(profile, user, account);

        const emailExists = await getUserByEmail(user?.email!);

        if (!emailExists) {
          const imageUrl = profile?.picture ?? undefined; // Use optional chaining

          if (imageUrl) {
            user.image = await UploadImageFromURLToProfile(user.id!, imageUrl);
          }
        }
        return true;
      }
      if (account?.provider !== 'credentials') return true;

      const existingUser = user.id ? await getUserById(user.id) : undefined;
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.roleId && session.user) {
        session.user.roleId = Number(token.roleId);
      }

      if (token.isVerified && session.user) {
        session.user.isVerified = Boolean(token.isVerified);
      }

      if (token.image && session.user) {
        //TODO: Find a way to update the session user name when new value of image is empty
        session.user.image = token.image.toString();
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.roleId = existingUser.roleId;
      token.isVerified = existingUser.isVerified;

      token.image = existingUser.image;
      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
