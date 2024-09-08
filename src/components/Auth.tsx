import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { remult, type UserInfo } from 'remult';
import Todo from './Todo';

export default function Auth() {
  const session = useSession();
  remult.user = session.data?.user as UserInfo;

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      signIn();
    }
  }, [session]);

  return (
    <div>
      Hello {remult.user?.name}{' '}
      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
      <Todo />
    </div>
  );
}
