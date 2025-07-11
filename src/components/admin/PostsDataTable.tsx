
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";
import { deletePost as deletePostAction } from "@/data/posts"; 
import { useToast } from "@/hooks/use-toast";
import DeletePostDialog from "./DeletePostDialog";
import { Edit, Eye } from "lucide-react";

interface PostsDataTableProps {
  posts: Post[];
  isAdminStatus: boolean;
}

export default function PostsDataTable({ posts, isAdminStatus }: PostsDataTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async (slug: string, title: string) => {
    if (!isAdminStatus) {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to delete posts.",
        variant: "destructive",
      });
      return;
    }
    setIsDeleting(true);
    try {
      // Server action (deletePostAction) already checks for admin internally
      // but this client-side check is good for UX
      deletePostAction(slug); // Will throw if not admin
      toast({
        title: "Post Deleted",
        description: `The post "${title}" has been successfully deleted.`,
      });
      router.refresh(); // Re-fetch posts on the server component
    } catch (error) {
      toast({
        title: "Error Deleting Post",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (posts.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No posts found. {isAdminStatus ? "Create your first post!" : ""}</p>;
  }

  return (
    <div className="border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <Link href={`/posts/${post.slug}`} className="hover:underline" target="_blank" rel="noopener noreferrer">
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>
                {post.category ? <Badge variant="secondary">{post.category}</Badge> : <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>{post.author.name}</TableCell>
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon" asChild  className="h-8 w-8">
                    <Link href={`/posts/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Post</span>
                    </Link>
                  </Button>
                  {isAdminStatus && (
                    <>
                      <Button variant="outline" size="icon" asChild  className="h-8 w-8">
                        <Link href={`/admin/posts/${post.slug}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit Post</span>
                        </Link>
                      </Button>
                      <DeletePostDialog 
                        onConfirm={() => handleDeletePost(post.slug, post.title)}
                        isDeleting={isDeleting}
                      />
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
