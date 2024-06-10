import { useSession } from 'next-auth/react';

interface User {
  email: string;
  image?: string;
  // Add other properties if needed
}

export const useCurrentUser = () => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return null;
  }

  const user: User = {
    email: session.user.email ?? '',
    image: session.user.image ?? undefined,
    // Add other properties if needed
  };

  return user;
};

