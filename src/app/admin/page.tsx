
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, PlusCircle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
        Admin Dashboard
      </h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to the Admin Panel</CardTitle>
          <CardDescription>Manage your BloggerVerse content from here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This is your central hub for managing posts and other aspects of your application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/admin/posts">
                <FileText className="mr-2 h-5 w-5" /> Manage Posts
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/posts/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
