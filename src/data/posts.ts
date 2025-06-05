
import type { Post, User, CreatePostData, UpdatePostData } from '@/types';
import { users, getCurrentUser, isAdmin as checkIsAdmin } from './users';
import { revalidatePath } from 'next/cache';

export let mockPosts: Post[] = [
  {
    id: '1',
    slug: 'first-amazing-post',
    title: 'My First Amazing Post on BloggerVerse',
    content: `
      <p>This is the <strong>full content</strong> of my first amazing post. It's a great day to start blogging on BloggerVerse!</p>
      <p>Blogging is a fantastic way to share your thoughts, ideas, and experiences with the world. Whether you're passionate about technology, travel, food, or personal development, there's an audience out there eager to hear what you have to say.</p>
      <h2>Getting Started</h2>
      <p>To get started, simply create an account, and you'll be on your way to crafting your first masterpiece. Think about what topics you're knowledgeable or enthusiastic about. What insights can you offer that others might find valuable or entertaining?</p>
      <img src="https://placehold.co/800x400.png" alt="Placeholder for post content image" data-ai-hint="writing desk" class="my-4 rounded-md shadow-md" />
      <h2>Engaging Your Audience</h2>
      <p>Once you start publishing, remember to engage with your readers. Respond to comments, ask questions, and build a community around your blog. This interaction can be incredibly rewarding and can help your blog grow.</p>
      <p>Happy blogging!</p>
    `,
    author: users.find(u => u.id === '1')!, // Alice (now Xay) is admin
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-16T12:30:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "Join me as I embark on my blogging journey with BloggerVerse. Discover tips and tricks for new bloggers.",
    category: "Technology",
    tags: ["blogging", "tech", "writing"]
  },
  {
    id: '2',
    slug: 'exploring-the-mountains',
    title: 'Exploring the Serene Beauty of the Mountains',
    content: `
      <p>There's something truly magical about the mountains. The crisp air, the breathtaking views, and the sense of peace you find is unparalleled.</p>
      <p>My recent trip to the Rockies was an unforgettable experience. We hiked through lush forests, کنار (کنار) crystal-clear lakes, and witnessed stunning sunrises that painted the peaks in hues of gold and pink.</p>
      <h2>Preparing for a Mountain Trip</h2>
      <ul>
        <li>Pack layers: Mountain weather can change rapidly.</li>
        <li>Stay hydrated: Altitude can dehydrate you quickly.</li>
        <li>Wear appropriate footwear: Sturdy hiking boots are a must.</li>
        <li>Inform someone of your plans: Safety first!</li>
      </ul>
      <img src="https://placehold.co/800x400.png" alt="Placeholder for mountain landscape" data-ai-hint="mountain landscape" class="my-4 rounded-md shadow-md" />
      <p>Whether you're an avid hiker or just someone looking for a peaceful escape, the mountains have something to offer everyone. The tranquility and raw beauty of these majestic giants can rejuvenate your soul.</p>
    `,
    author: users.find(u => u.id === '2')!, // Bob
    createdAt: new Date('2024-02-10T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-11T09:00:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "A journey into the heart of the mountains, filled with adventure and stunning landscapes. Discover the allure of high altitudes.",
    category: "Travel",
    tags: ["mountains", "hiking", "nature", "adventure"]
  },
  // ... other posts
];

// Helper function to generate slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export const getAllPosts = (page: number = 1, limit: number = 6): { posts: Post[], totalPages: number, currentPage: number } => {
  const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedPosts.length / limit);
  return { posts: paginatedPosts, totalPages, currentPage: page };
};

export const getAllPostsForAdmin = (): Post[] => {
  return [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPostBySlug = (slug: string): Post | undefined => {
  return mockPosts.find(post => post.slug === slug);
};

export const addPost = (postData: CreatePostData): Post => {
  const currentUser = getCurrentUser();
  if (!currentUser || !checkIsAdmin(currentUser.id)) {
    throw new Error("Unauthorized: Only admins can create posts.");
  }

  const newId = (Math.max(...mockPosts.map(p => parseInt(p.id, 10)), 0) + 1).toString();
  const slug = slugify(postData.title);
  let finalSlug = slug;
  let counter = 1;
  while (mockPosts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const author = users.find(u => u.id === (postData.authorId || currentUser.id)) || currentUser;

  const newPost: Post = {
    ...postData,
    id: newId,
    slug: finalSlug,
    author,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : postData.tags,
  };
  mockPosts.unshift(newPost);

  revalidatePath('/'); // Revalidate home page
  revalidatePath(`/posts/${newPost.slug}`); // Revalidate the new post's page
  revalidatePath('/admin/posts'); // Revalidate admin posts list

  return newPost;
};

export const updatePost = (slug: string, postData: UpdatePostData): Post | undefined => {
  const currentUser = getCurrentUser();
  if (!currentUser || !checkIsAdmin(currentUser.id)) {
    throw new Error("Unauthorized: Only admins can update posts.");
  }

  const postIndex = mockPosts.findIndex(p => p.slug === slug);
  if (postIndex === -1) {
    return undefined;
  }

  const existingPost = mockPosts[postIndex];
  const oldSlug = existingPost.slug; // Keep old slug for revalidation if it changes

  let newSlug = existingPost.slug;
  if (postData.title && postData.title !== existingPost.title) {
    newSlug = slugify(postData.title);
    let finalSlug = newSlug;
    let counter = 1;
    while (mockPosts.some(p => p.slug === finalSlug && p.id !== existingPost.id)) {
        finalSlug = `${newSlug}-${counter}`;
        counter++;
    }
    newSlug = finalSlug;
  }
  
  const author = postData.authorId ? users.find(u => u.id === postData.authorId) || existingPost.author : existingPost.author;

  const updatedPost: Post = {
    ...existingPost,
    ...postData,
    slug: newSlug,
    author,
    updatedAt: new Date().toISOString(),
    tags: typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : postData.tags || existingPost.tags,
  };

  mockPosts[postIndex] = updatedPost;

  revalidatePath('/'); // Revalidate home page
  if (oldSlug !== updatedPost.slug) {
    revalidatePath(`/posts/${oldSlug}`); // Revalidate old slug path if changed
  }
  revalidatePath(`/posts/${updatedPost.slug}`); // Revalidate new/current slug path
  revalidatePath('/admin/posts'); // Revalidate admin posts list
  
  return updatedPost;
};

export const deletePost = (slug: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser || !checkIsAdmin(currentUser.id)) {
    throw new Error("Unauthorized: Only admins can delete posts.");
  }
  const initialLength = mockPosts.length;
  mockPosts = mockPosts.filter(p => p.slug !== slug);
  
  if (mockPosts.length < initialLength) {
    revalidatePath('/'); // Revalidate home page
    revalidatePath(`/posts/${slug}`); // Revalidate the deleted post's page (will likely 404, but good to clear)
    revalidatePath('/admin/posts'); // Revalidate admin posts list
    return true;
  }
  return false;
};
