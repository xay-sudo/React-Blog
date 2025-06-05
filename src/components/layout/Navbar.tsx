import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
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
        </nav>
      </div>
    </header>
  );
}
