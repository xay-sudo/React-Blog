
import PostForm, { type PostFormValues } from '@/components/admin/PostForm';
import { getPostBySlug, updatePost } from '@/data/posts';
import { getCurrentUser, isAdmin } from '@/data/users';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser?.id);

  if (!userIsAdmin) {
    return (
      <Card className="shadow-xl w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You do not have permission to edit posts.</p>
        </CardContent>
      </Card>
    );
  }

  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  async function handleUpdatePost(values: PostFormValues) {
    "use server";
    // The updatePost function itself will re-check for admin status.
    try {
      // Keep original author unless explicitly changed and current user is admin
      const authorIdToSet = post?.author.id; 
      await updatePost(params.slug, { ...values, authorId: authorIdToSet });
    } catch (error) {
      console.error("Failed to update post:", error);
      // The error.message will contain "Unauthorized" if that's the cause from updatePost
      throw error;
    }
  }

  return (
    <PostForm
      onSubmit={handleUpdatePost}
      initialData={post}
      isEditing={true}
    />
  );
}
