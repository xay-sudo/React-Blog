import { getPostBySlug, mockPosts } from '@/data/posts';
import type { Post } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, UserCircle, Tags, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdsenseAd from '@/components/ads/AdsenseAd'; // Import the Ad component

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

export default function PostPage({ params }: PostPageProps) {
  const post: Post | undefined = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // IMPORTANT: Replace with your actual AdSense Publisher ID (should be same as in layout)
  const adClient = "ca-pub-YOUR_ADSENSE_PUBLISHER_ID"; 
  // IMPORTANT: Replace with an actual Ad Slot ID for your post pages
  const postPageAdSlot = "YOUR_ADSENSE_AD_SLOT_ID_POSTPAGE";

  return (
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

      <Separator className="my-8" />

      <div
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary prose-p:font-body prose-a:text-accent hover:prose-a:text-accent/80 prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Example Ad Placement on Post Page */}
      {adClient && adClient !== "ca-pub-YOUR_ADSENSE_PUBLISHER_ID" && postPageAdSlot && postPageAdSlot !== "YOUR_ADSENSE_AD_SLOT_ID_POSTPAGE" ? (
        <AdsenseAd adClient={adClient} adSlot={postPageAdSlot} adFormat="auto" className="my-8" />
      ) : (
        <div className="my-8 p-4 text-center bg-muted text-muted-foreground rounded-md">
            <p>Ad placeholder: Configure your AdSense Publisher ID and Ad Slot ID in <code>src/app/posts/[slug]/page.tsx</code> and <code>src/app/layout.tsx</code> to display ads here.</p>
        </div>
      )}
      
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
  );
}
