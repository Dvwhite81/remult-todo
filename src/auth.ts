import NextAuth, { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import { type UserInfo } from 'remult';

const validUsers: UserInfo[] = [
  { id: '1', name: 'Jane', roles: ['admin'] },
  { id: '2', name: 'Steve' },
];

const findUser = (name?: string | null) => {
  return validUsers.find((user) => user.name === name);
};

export const auth = NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: {
          placeholder: 'Try Jane or Steve',
        },
      },
      authorize: (credentials) => findUser(credentials?.name) || null,
    }),
  ],
  callbacks: {
    session: ({ session }) => ({
      ...session,
      user: findUser(session.user?.name),
    }),
  },
});

export const getUserOnServer = async () => {
  const session = await getServerSession();
  return findUser(session?.user?.name);
};
