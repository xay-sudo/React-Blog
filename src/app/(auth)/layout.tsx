
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) { // Ensure localStorage is accessed only on the client
      if (localStorage.getItem('mockAdminLoggedIn') === 'true') {
        router.replace('/admin');
      }
    }
  }, [isClient, router]);

  // Render children immediately, redirection will happen client-side if needed
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,100px))] items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
