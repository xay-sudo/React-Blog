
import { getPostBySlug, mockPosts } from '@/data/posts';
import { getSiteSettings } from '@/data/siteSettings';
import type { Post, CodeSnippet } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, UserCircle, Tags, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
// AdsenseAd component is no longer used directly. Ads are managed via Code Snippets.
import HeadInjectorClient from '@/components/layout/HeadInjectorClient'; // For postHeader snippets

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Statically generate routes at build time
export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Helper function to render snippets for a specific location
const RenderSnippets = ({ snippets, location }: { snippets: CodeSnippet[]; location: CodeSnippet['location'] }) => {
  const activeSnippetsForLocation = snippets
    .filter(snippet => snippet.isActive && snippet.location === location)
    .map(snippet => snippet.code)
    .join('\n');

  if (!activeSnippetsForLocation) {
    return null;
  }

  if (location === 'postHeader') { // postHeader uses HeadInjectorClient
    return <HeadInjectorClient htmlStrings={activeSnippetsForLocation.split('\n').filter(s => s.trim() !== '')} />;
  }
  
  // Other locations are injected directly (assuming they are body-safe HTML)
  return <div dangerouslySetInnerHTML={{ __html: activeSnippetsForLocation }} />;
};


export default function PostPage({ params }: PostPageProps) {
  const post: Post | undefined = getPostBySlug(params.slug);
  const siteSettings = getSiteSettings();
  const allSnippets = siteSettings.snippets;

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Ad placements on post pages should now be managed via the 
  // "Code Snippets" feature in the Admin Panel using locations like
  // 'beforePostContent', 'afterPostContent', etc.

  return (
    <>
      {/* For postHeader snippets */}
      <RenderSnippets snippets={allSnippets} location="postHeader" />

      <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        <header className="mb-8">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Link>
          </Button>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              {post.author.name}
            </span>
            <span className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              {formattedDate}
            </span>
            {post.category && (
              <span className="flex items-center">
                <Folder className="h-4 w-4 mr-1.5" />
                {post.category}
              </span>
            )}
          </div>
        </header>

        {post.featuredImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.featuredImage}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={`${post.category?.toLowerCase() || ''} ${post.tags?.[0]?.toLowerCase() || 'blog detail'}`}
              priority
            />
          </div>
        )}
        
        <RenderSnippets snippets={allSnippets} location="beforePostContent" />

        <Separator className="my-8" />

        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary prose-p:font-body prose-a:text-accent hover:prose-a:text-accent/80 prose-img:rounded-md prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <Separator className="my-8" />

        <RenderSnippets snippets={allSnippets} location="afterPostContent" />
        
        {/* 
          Ad placeholder removed. 
          Use the "Code Snippets" manager (e.g., with 'afterPostContent' or 'beforePostContent' locations)
          to insert ad codes from any network (Adsterra, MGID, etc.) here.
        */}
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Tags className="h-5 w-5 mr-2 text-primary" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </article>
      <RenderSnippets snippets={allSnippets} location="postFooter" />
    </>
  );
}
