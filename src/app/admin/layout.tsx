
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FileText, Settings, Code, ShieldAlert, PanelLeft } from 'lucide-react';
import { getCurrentUser, isAdmin } from '@/data/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile sidebar
import { useIsMobile } from '@/hooks/use-mobile';


export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted, localStorage is available
  }, []);

  useEffect(() => {
    if (isClient) { // Only run on client
      const mockLoggedIn = localStorage.getItem('mockAdminLoggedIn') === 'true';
      if (!mockLoggedIn) {
        router.replace('/login');
      } else {
        // User is "logged in" via localStorage, now check if they are the designated admin
        const currentUser = getCurrentUser(); // getCurrentUser now considers mockAdminLoggedIn
        const userIsActuallyAdmin = isAdmin(currentUser?.id);
        if (userIsActuallyAdmin) {
          setIsAuthorized(true);
        } else {
          // Logged in flag was true, but not the actual admin OR getCurrentUser didn't return admin
          // This case might happen if localStorage was tampered or if getCurrentUser logic is strict
          localStorage.removeItem('mockAdminLoggedIn'); // Clear tampered/invalid flag
          router.replace('/login'); // Send back to login
        }
        setIsLoading(false);
      }
    }
  }, [isClient, router]);

  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-lg text-muted-foreground">Loading Admin Area...</p>
        {/* You could add a spinner component here */}
      </div>
    );
  }

  if (!isAuthorized) {
    // This covers cases where localStorage flag was true but user isn't the actual admin,
    // or if the loading finished and they were simply not authorized.
    // It might briefly show before redirection if !mockLoggedIn and then quickly redirect.
    // Or show if mockLoggedIn was true, but userIsActuallyAdmin was false.
    return (
      <div className="flex min-h-[calc(100vh-var(--header-height,100px))] items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle className="font-headline text-2xl sm:text-3xl text-destructive">
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to view this page. Please log in as an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login">
                <Home className="mr-2 h-5 w-5" /> Go to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const AdminNavLinks = () => (
    <nav className="space-y-4">
      <h2 className="text-xl font-semibold text-primary mb-6">Admin Panel</h2>
      <Button variant="ghost" asChild className="w-full justify-start text-foreground hover:bg-accent/10 hover:text-accent">
        <Link href="/admin">
          <Home className="mr-2 h-5 w-5" /> Dashboard
        </Link>
      </Button>
      <Button variant="ghost" asChild className="w-full justify-start text-foreground hover:bg-accent/10 hover:text-accent">
        <Link href="/admin/posts">
          <FileText className="mr-2 h-5 w-5" /> Manage Posts
        </Link>
      </Button>
      <Button variant="ghost" asChild className="w-full justify-start text-foreground hover:bg-accent/10 hover:text-accent">
        <Link href="/admin/settings/ads">
          <Code className="mr-2 h-5 w-5" /> Ad Settings
        </Link>
      </Button>
    </nav>
  );


  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,100px))]">
      {isMobile && (
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="fixed top-20 left-4 z-50 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Admin Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6 bg-card">
              <AdminNavLinks />
            </SheetContent>
          </Sheet>
      )}
      <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
        <AdminNavLinks />
      </aside>
      <main className={`flex-1 p-6 sm:p-8 ${isMobile ? 'pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
}
