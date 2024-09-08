'use client';
import Auth from '@/components/Auth';
import { SessionProvider } from 'next-auth/react';

export default function Home() {
  return (
    <SessionProvider>
      <Auth />
    </SessionProvider>
  );
}
