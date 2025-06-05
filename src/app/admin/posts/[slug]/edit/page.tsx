
import PostForm, { type PostFormValues } from '@/components/admin/PostForm';
import { getPostBySlug, updatePost } from '@/data/posts';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  async function handleUpdatePost(values: PostFormValues) {
    "use server";
    try {
      // In a real app, authorId might be based on logged-in user or retained
      const authorId = post?.author.id;
      updatePost(params.slug, { ...values, authorId });
    } catch (error) {
      console.error("Failed to update post:", error);
      throw new Error("Server failed to update post.");
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
