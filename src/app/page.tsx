import PostCard from '@/components/common/PostCard';
import PaginationControls from '@/components/common/PaginationControls';
import { getAllPosts } from '@/data/posts';
import type { Post } from '@/types';

interface HomePageProps {
  searchParams?: {
    page?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = 6; // Display 6 posts per page for a 3-column or 2-column layout

  const { posts, totalPages } = getAllPosts(currentPage, postsPerPage);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
          Welcome to BloggerVerse
        </h1>
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
