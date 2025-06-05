
import PostForm, { type PostFormValues } from '@/components/admin/PostForm';
import { addPost } from '@/data/posts';
import { getCurrentUser, isAdmin } from '@/data/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreatePostPage() {
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser?.id);

  if (!userIsAdmin) {
    return (
      <Card className="shadow-xl w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You do not have permission to create new posts.</p>
        </CardContent>
      </Card>
    );
  }
  
  async function handleCreatePost(values: PostFormValues) {
    "use server"; 
    // The addPost function itself will re-check for admin status as a security measure.
    try {
      // If authorId is not explicitly set, addPost will default to the current admin user.
      const authorIdToSet = currentUser?.id; // Ensure we are using the current (admin) user
      addPost({ ...values, authorId: authorIdToSet });
    } catch (error) {
      console.error("Failed to create post:", error);
      // The error.message will contain "Unauthorized" if that's the cause from addPost
      throw error; 
    }
  }

  return (
    <PostForm onSubmit={handleCreatePost} isEditing={false} />
  );
}
