
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FileText, Settings, AdCircleIcon, Code } from 'lucide-react'; // Using Code for Ad settings for now

export default function AdminLayout({ children }: { children: ReactNode }) {
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
