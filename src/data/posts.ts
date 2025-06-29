
'use server';

import type { Post, User, CreatePostData, UpdatePostData } from '@/types';
import { users, getCurrentUser, isAdmin as checkIsAdmin, MOCK_ADMIN_USER_ID } from './users';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file
const postsFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');

// Pre-resolve authors for initial data if needed
const adminAuthorUser = users.find(u => u.id === MOCK_ADMIN_USER_ID);
if (!adminAuthorUser) {
  throw new Error(`Critical: Default admin author with ID '${MOCK_ADMIN_USER_ID}' not found. Check users data in src/data/users.ts.`);
}
const bobAuthorUser = users.find(u => u.id === '2');
if (!bobAuthorUser) {
  throw new Error("Critical: Default author with ID '2' (Bob The Builder) not found. Check users data in src/data/users.ts.");
}

const initialMockPostsData: Post[] = [
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
    author: adminAuthorUser,
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
    author: bobAuthorUser,
    createdAt: new Date('2024-02-10T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-11T09:00:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "A journey into the heart of the mountains, filled with adventure and stunning landscapes. Discover the allure of high altitudes.",
    category: "Travel",
    tags: ["mountains", "hiking", "nature", "adventure"]
  },
];

// Helper function to read posts from the JSON file
async function readPostsFromFile(): Promise<Post[]> {
  try {
    const fileData = await fs.readFile(postsFilePath, 'utf-8');
    const posts = JSON.parse(fileData) as Post[];
    // Re-associate author objects as JSON stringification loses object references/methods
    return posts.map(post => {
      const author = users.find(u => u.id === post.author.id);
      return { ...post, author: author || post.author }; // Fallback to stored author if not found in users array
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File not found, initialize with default data and write it
      await fs.writeFile(postsFilePath, JSON.stringify(initialMockPostsData, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(initialMockPostsData)); // Return a deep copy
    }
    console.error('Failed to read posts file:', error);
    // Fallback to initial mock data in case of other errors, but don't write it
    // as the file might exist but be corrupted.
    return JSON.parse(JSON.stringify(initialMockPostsData));
  }
}

// Helper function to write posts to the JSON file
async function writePostsToFile(posts: Post[]): Promise<void> {
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write posts file:', error);
    throw new Error('Failed to save posts data.');
  }
}

// Helper function to generate slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-'); 
}

export async function getAllPosts(page: number = 1, limit: number = 6): Promise<{ posts: Post[], totalPages: number, currentPage: number }> {
  const allPosts = await readPostsFromFile();
  const sortedPosts = [...allPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedPosts.length / limit);
  return { posts: paginatedPosts, totalPages, currentPage: page };
};

export async function getAllPostsForAdmin(): Promise<Post[]> {
  const allPosts = await readPostsFromFile();
  return [...allPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const allPosts = await readPostsFromFile();
  return allPosts.find(post => post.slug === slug);
};

export async function addPost(postData: CreatePostData): Promise<Post> {
  const serverCurrentUser = getCurrentUser();
  if (!serverCurrentUser || !checkIsAdmin(serverCurrentUser.id)) {
    throw new Error("Unauthorized: Only admins can create posts.");
  }

  const author = users.find(u => u.id === serverCurrentUser.id); 
  if (!author) {
    console.error("CRITICAL: Admin author could not be resolved for new post. Admin ID:", serverCurrentUser.id);
    throw new Error(`Post author (admin) could not be determined. This is an unexpected error preventing post creation.`);
  }
  
  const currentPosts = await readPostsFromFile();
  
  let maxId = 0;
  if (currentPosts.length > 0) {
    const ids = currentPosts.map(p => parseInt(p.id, 10)).filter(id => !isNaN(id));
    if (ids.length > 0) {
      maxId = Math.max(...ids);
    }
  }
  const newId = (maxId + 1).toString();

  const slug = slugify(postData.title);
  let finalSlug = slug;
  let counter = 1;
  while (currentPosts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const newPost: Post = {
    ...postData,
    id: newId,
    slug: finalSlug,
    author, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : (postData.tags || []),
  };
  
  const updatedPosts = [newPost, ...currentPosts];
  await writePostsToFile(updatedPosts);

  revalidatePath('/');
  revalidatePath(`/posts/${newPost.slug}`);
  revalidatePath('/admin/posts');

  return newPost;
};

export async function updatePost(slug: string, postData: UpdatePostData): Promise<Post | undefined> {
  const currentUser = getCurrentUser();
  if (!currentUser || !checkIsAdmin(currentUser.id)) {
    throw new Error("Unauthorized: Only admins can update posts.");
  }
  
  const currentPosts = await readPostsFromFile();
  const postIndex = currentPosts.findIndex(p => p.slug === slug);
  if (postIndex === -1) {
    return undefined;
  }

  const existingPost = currentPosts[postIndex];
  const oldSlug = existingPost.slug;

  let newSlug = existingPost.slug;
  if (postData.title && postData.title !== existingPost.title) {
    newSlug = slugify(postData.title);
    let finalSlug = newSlug;
    let counter = 1;
    while (currentPosts.some(p => p.slug === finalSlug && p.id !== existingPost.id)) {
        finalSlug = `${newSlug}-${counter}`;
        counter++;
    }
    newSlug = finalSlug;
  }
  
  const authorIdToSet = postData.authorId || existingPost.author.id;
  const author = users.find(u => u.id === authorIdToSet);

  if (!author) {
     console.error("CRITICAL: Author could not be resolved for updating post. Author ID provided:", postData.authorId, "Existing author ID:", existingPost.author.id);
     throw new Error(`Post author could not be determined for update. This is an unexpected error.`);
  }

  const updatedPost: Post = {
    ...existingPost,
    ...postData,
    slug: newSlug,
    author,
    updatedAt: new Date().toISOString(),
    tags: typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : (postData.tags || existingPost.tags),
  };

  currentPosts[postIndex] = updatedPost;
  await writePostsToFile(currentPosts);

  revalidatePath('/');
  if (oldSlug !== updatedPost.slug) {
    revalidatePath(`/posts/${oldSlug}`);
  }
  revalidatePath(`/posts/${updatedPost.slug}`);
  revalidatePath('/admin/posts');
  
  return updatedPost;
};

export async function deletePost(slug: string): Promise<boolean> {
  const currentUser = getCurrentUser();
  if (!currentUser || !checkIsAdmin(currentUser.id)) {
    throw new Error("Unauthorized: Only admins can delete posts.");
  }
  
  let currentPosts = await readPostsFromFile();
  const initialLength = currentPosts.length;
  currentPosts = currentPosts.filter(p => p.slug !== slug);
  
  if (currentPosts.length < initialLength) {
    await writePostsToFile(currentPosts);
    revalidatePath('/');
    revalidatePath(`/posts/${slug}`); 
    revalidatePath('/admin/posts'); 
    return true;
  }
  return false;
};
