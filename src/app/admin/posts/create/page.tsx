
// "use server" directive is not needed here if addPost is called from PostForm client component
// We'll handle the action in PostForm directly for now.

import PostForm, { type PostFormValues } from '@/components/admin/PostForm';
import { addPost } from '@/data/posts'; // This will be called client-side via the form

export default function CreatePostPage() {
  
  async function handleCreatePost(values: PostFormValues) {
    "use server"; // This server action will be called from the client component
    try {
      // For simplicity, using first user as author. In a real app, this would be the logged-in user.
      const authorId = "1"; 
      addPost({ ...values, authorId });
    } catch (error) {
      console.error("Failed to create post:", error);
      throw new Error("Server failed to create post.");
    }
  }

  return (
    <PostForm onSubmit={handleCreatePost} isEditing={false} />
  );
}
