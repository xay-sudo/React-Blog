
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FileText, Settings, Code, ShieldAlert } from 'lucide-react'; // Using Code for Ad settings for now, ShieldAlert for Access Denied
import { getCurrentUser, isAdmin } from '@/data/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser?.id);

  if (!userIsAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-var(--header-height,100px))] items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle className="font-headline text-2xl sm:text-3xl text-destructive">
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Please contact the site administrator if you believe this is an error.
            </p>
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-5 w-5" /> Go to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,100px))]">
      <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
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
              <Code className="mr-2 h-5 w-5" /> Ad Settings {/* Changed icon */}
            </Link>
          </Button>
          {/* <Button variant="ghost" asChild className="w-full justify-start text-foreground hover:bg-accent/10 hover:text-accent">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-5 w-5" /> General Settings
            </Link>
          </Button> */}
        </nav>
      </aside>
      <main className="flex-1 p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
