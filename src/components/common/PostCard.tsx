import type { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {post.featuredImage && (
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={post.featuredImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${post.category?.toLowerCase() || ''} ${post.tags?.[0]?.toLowerCase() || 'blog abstract'}`}
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-2xl leading-tight">
          <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <div className="text-xs text-muted-foreground flex items-center space-x-4 pt-2">
          <span className="flex items-center">
            <UserCircle className="h-4 w-4 mr-1" />
            {post.author.name}
          </span>
          <span className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            {formattedDate}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3">
            {post.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary hover:text-accent p-0">
          <Link href={`/posts/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
