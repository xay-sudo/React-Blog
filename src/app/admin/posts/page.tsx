
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PostsDataTable from '@/components/admin/PostsDataTable';
import { getAllPostsForAdmin } from '@/data/posts';
import { getCurrentUser, isAdmin } from '@/data/users';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export const dynamic = 'force-dynamic'; // Ensure fresh data on each request for admin

export default async function AdminPostsPage() {
  const posts = await getAllPostsForAdmin();
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser?.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Manage Posts
          </h1>
          <p className="text-muted-foreground mt-1">
            View, create, edit, or delete blog posts.
          </p>
        </div>
        {userIsAdmin && (
          <Button asChild>
            <Link href="/admin/posts/create">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
            </Link>
          </Button>
        )}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all blog posts in your BloggerVerse. Total posts: {posts.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostsDataTable posts={posts} isAdminStatus={userIsAdmin} />
        </CardContent>
      </Card>
    </div>
  );
}
