"use client";

import React, { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { FileProvider } from '@/context/file-context';
import { LoadingSpinner } from '../loading-spinner';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Or a redirect component
  }

  return (
    <FileProvider>
        {children}
    </FileProvider>
  );
}
