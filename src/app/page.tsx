import PostCard from '@/components/common/PostCard';
import PaginationControls from '@/components/common/PaginationControls';
import { getAllPosts } from '@/data/posts';
import type { Post } from '@/types';
import AdsenseAd from '@/components/ads/AdsenseAd'; // Import the Ad component

interface HomePageProps {
  searchParams?: {
    page?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = 6; 

  const { posts, totalPages } = getAllPosts(currentPage, postsPerPage);

  // IMPORTANT: Replace with your actual AdSense Publisher ID
  const adClient = "ca-pub-YOUR_ADSENSE_PUBLISHER_ID"; 
  // IMPORTANT: Replace with an actual Ad Slot ID for your homepage
  const homePageAdSlot = "YOUR_ADSENSE_AD_SLOT_ID_HOMEPAGE"; 

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
          Welcome to BloggerVerse
        </h1>

        {/* Example Ad Placement on Homepage */}
        {adClient && adClient !== "ca-pub-YOUR_ADSENSE_PUBLISHER_ID" && homePageAdSlot && homePageAdSlot !== "YOUR_ADSENSE_AD_SLOT_ID_HOMEPAGE" ? (
          <AdsenseAd adClient={adClient} adSlot={homePageAdSlot} adFormat="auto" />
        ) : (
          <div className="my-4 p-4 text-center bg-muted text-muted-foreground rounded-md">
            <p>Ad placeholder: Configure your AdSense Publisher ID and Ad Slot ID in <code>src/app/page.tsx</code> and <code>src/app/layout.tsx</code> to display ads here.</p>
          </div>
        )}

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
