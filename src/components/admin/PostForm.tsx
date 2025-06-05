
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(150, { message: "Title must not exceed 150 characters."}),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }).max(300, { message: "Excerpt must not exceed 300 characters."}),
  featuredImage: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

export type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  onSubmit: (values: PostFormValues) => Promise<void>;
  initialData?: Partial<Post>;
  isEditing?: boolean;
}

export default function PostForm({ onSubmit, initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = initialData ? {
    title: initialData.title || "",
    content: initialData.content || "",
    excerpt: initialData.excerpt || "",
    featuredImage: initialData.featuredImage || "",
    category: initialData.category || "",
    tags: initialData.tags?.join(", ") || "",
  } : {
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    category: "",
    tags: "",
  };
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {formState: {isSubmitting}} = form;

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: `Post ${isEditing ? 'Updated' : 'Created'} Successfully`,
        description: `Your post "${values.title}" has been saved.`,
      });
      router.push("/admin/posts");
      router.refresh(); // Refresh server components
    } catch (error) {
      toast({
        title: `Error ${isEditing ? 'Updating' : 'Creating'} Post`,
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-xl w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl sm:text-3xl text-primary">
          {isEditing ? "Edit Post" : "Create New Post"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Modify the details of your existing post." : "Fill in the details to publish a new post."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your post content here..." {...field} rows={10} />
                  </FormControl>
                  <FormDescription>
                    Supports basic HTML. For complex formatting, consider a WYSIWYG editor integration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short summary of the post" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technology, Travel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., blogging, tech, travel" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of tags.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Post")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
