import PostCard from '@/components/common/PostCard';
import PaginationControls from '@/components/common/PaginationControls';
import { getAllPosts } from '@/data/posts';
import type { Post } from '@/types';
// AdsenseAd component is no longer used directly. Ads are managed via Code Snippets.

interface HomePageProps {
  searchParams?: {
    page?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = 6; 

  const { posts, totalPages } = getAllPosts(currentPage, postsPerPage);

  // Ad placements on the homepage should now be managed via the 
  // "Code Snippets" feature in the Admin Panel.
  // For example, you could create a snippet with your ad code and assign it to a
  // new location if needed, or for simple banners, potentially edit this page's
  // structure if a snippet location doesn't fit. The existing snippet locations
  // (like 'beforePostContent') are more geared towards post pages.

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
          Welcome to BloggerVerse
        </h1>

        {/* 
          Example Ad Placeholder Removed.
          To add ads here, use the "Code Snippets" manager in the Admin Panel.
          You might create a snippet for a "Homepage Banner" location if you customize
          the snippet locations further, or inject ads via global snippets if appropriate.
          For very specific placements, you might manually edit this component or 
          use a snippet with a broad location if the ad code itself handles targeting.
        */}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No posts found. Check back later!</p>
        )}
      </section>

      {posts.length > 0 && (
         <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      )}
    </div>
  );
}
