
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, LogIn, UserPlus, ShieldCheck, LogOut } from 'lucide-react'; // Added LogOut
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isMockAdminLoggedIn, setIsMockAdminLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted
  }, []);

  useEffect(() => {
    if (isClient) {
      const checkLoginStatus = () => {
        setIsMockAdminLoggedIn(localStorage.getItem('mockAdminLoggedIn') === 'true');
      };
      checkLoginStatus(); // Initial check

      // Optional: Listen for storage changes if login state could change in other tabs
      // window.addEventListener('storage', checkLoginStatus);
      // return () => window.removeEventListener('storage', checkLoginStatus);
    }
  }, [isClient]);


  const handleLogout = () => {
    localStorage.removeItem('mockAdminLoggedIn');
    setIsMockAdminLoggedIn(false);
    router.push('/login');
    router.refresh(); // Ensure layout components re-evaluate based on new state
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-headline font-bold text-primary hover:text-primary/90 transition-colors">
          BloggerVerse
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 hover:text-accent transition-colors">
            <Link href="/">
              <BookOpenText className="mr-0 sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Posts</span>
            </Link>
          </Button>
          
          {isClient && isMockAdminLoggedIn ? (
            <>
              <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 hover:text-accent transition-colors">
                <Link href="/admin">
                  <ShieldCheck className="mr-0 sm:mr-2 h-5 w-5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:bg-accent/10 hover:text-accent transition-colors">
                <LogOut className="mr-0 sm:mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : isClient ? ( // Only render these if isClient is true (i.e. mounted)
            <>
              <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 hover:text-accent transition-colors">
                <Link href="/login">
                  <LogIn className="mr-0 sm:mr-2 h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
              <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/register">
                  <UserPlus className="mr-0 sm:mr-2 h-5 w-5" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </Button>
            </>
          ) : (
            // Fallback or loading state for Navbar links if needed, or render nothing until client check
            <div className="h-10 w-40"></div> // Placeholder to prevent layout shift
          )}
        </nav>
      </div>
    </header>
  );
}
