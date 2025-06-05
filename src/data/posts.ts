
import type { Post, User } from '@/types';

const users: User[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Chaplin', email: 'charlie@example.com' },
];

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
    author: users[0],
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
    author: users[1],
    createdAt: new Date('2024-02-10T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-11T09:00:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "A journey into the heart of the mountains, filled with adventure and stunning landscapes. Discover the allure of high altitudes.",
    category: "Travel",
    tags: ["mountains", "hiking", "nature", "adventure"]
  },
  {
    id: '3',
    slug: 'the-art-of-minimalism',
    title: 'The Art of Minimalism: Living with Less',
    content: `
      <p>Minimalism is more than just decluttering your space; it's a mindset. It's about intentionally living with only the things you truly need or love.</p>
      <p>Adopting a minimalist lifestyle can lead to numerous benefits, including reduced stress, more financial freedom, and a greater appreciation for what you have.</p>
      <h2>Steps to Embrace Minimalism:</h2>
      <ol>
        <li><strong>Identify your values:</strong> Understand what's truly important to you.</li>
        <li><strong>Declutter ruthlessly:</strong> Let go of items that don't serve a purpose or bring you joy.</li>
        <li><strong>Be mindful of purchases:</strong> Think twice before bringing new items into your home.</li>
        <li><strong>Focus on experiences:</strong> Prioritize experiences over material possessions.</li>
      </ol>
      <img src="https://placehold.co/800x400.png" alt="Placeholder for minimalist interior" data-ai-hint="minimalist interior" class="my-4 rounded-md shadow-md" />
      <p>It's a journey, not a destination. Start small and gradually make changes. You might be surprised at how liberating it feels to live with less.</p>
    `,
    author: users[0],
    createdAt: new Date('2024-03-05T09:15:00Z').toISOString(),
    updatedAt: new Date('2024-03-05T17:00:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "Discover the principles of minimalism and how living with less can lead to a more fulfilling and intentional life.",
    category: "Lifestyle",
    tags: ["minimalism", "simple living", "declutter"]
  },
  {
    id: '4',
    slug: 'mastering-javascript-es6',
    title: 'Mastering JavaScript ES6+ Features',
    content: `
      <p>JavaScript has evolved significantly with ES6 and subsequent versions, introducing powerful features that make development more efficient and enjoyable.</p>
      <p>Features like arrow functions, destructuring, template literals, and async/await have become staples in modern JavaScript development.</p>
      <h2>Key ES6+ Features:</h2>
      <ul>
        <li><strong>Arrow Functions:</strong> <code>const add = (a, b) => a + b;</code></li>
        <li><strong>Classes:</strong> Syntactic sugar over prototype-based inheritance.</li>
        <li><strong>Template Literals:</strong> Easy string interpolation with backticks.</li>
        <li><strong>Destructuring:</strong> Conveniently unpack values from arrays or properties from objects.</li>
        <li><strong>Modules:</strong> Import and export functionality between files.</li>
        <li><strong>Promises and Async/Await:</strong> Better handling of asynchronous operations.</li>
      </ul>
      <pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code class="font-code">
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
      </code></pre>
      <p>Understanding and utilizing these features can greatly improve your code quality and productivity. Dive in and explore the world of modern JavaScript!</p>
    `,
    author: users[2],
    createdAt: new Date('2024-04-20T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-04-21T15:45:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "A deep dive into essential ES6+ JavaScript features that every modern web developer should know. Enhance your coding skills.",
    category: "Programming",
    tags: ["javascript", "es6", "web development", "coding"]
  },
  {
    id: '5',
    slug: 'delicious-homemade-pizza',
    title: 'Crafting the Perfect Delicious Homemade Pizza',
    content: `
      <p>There's nothing quite like a delicious homemade pizza, fresh from the oven. With a few simple ingredients and techniques, you can create a pizzeria-quality pie in your own kitchen.</p>
      <h2>Essential Ingredients:</h2>
      <ul>
        <li>Pizza dough (store-bought or homemade)</li>
        <li>Tomato sauce (San Marzano tomatoes are excellent)</li>
        <li>Mozzarella cheese (fresh or low-moisture)</li>
        <li>Your favorite toppings (pepperoni, mushrooms, olives, etc.)</li>
        <li>Olive oil, herbs (oregano, basil)</li>
      </ul>
      <img src="https://placehold.co/800x400.png" alt="Placeholder for homemade pizza" data-ai-hint="homemade pizza" class="my-4 rounded-md shadow-md" />
      <h2>Tips for Success:</h2>
      <p>Preheat your oven and pizza stone (if using) to a high temperature. Stretch your dough gently. Don't overload with toppings. A sprinkle of fresh basil after baking adds a wonderful aroma.</p>
      <p>Experiment with different sauces, cheeses, and toppings to find your perfect combination. Enjoy your culinary creation!</p>
    `,
    author: users[1],
    createdAt: new Date('2024-05-12T18:00:00Z').toISOString(),
    updatedAt: new Date('2024-05-12T20:10:00Z').toISOString(),
    featuredImage: 'https://placehold.co/600x400.png',
    excerpt: "Learn how to make mouth-watering homemade pizza from scratch. Tips, tricks, and ingredient suggestions for the perfect pie.",
    category: "Food",
    tags: ["pizza", "cooking", "recipe", "homemade"]
  }
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

// Function to get all posts (simulates API call with pagination for public pages)
export const getAllPosts = (page: number = 1, limit: number = 6): { posts: Post[], totalPages: number, currentPage: number } => {
  const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedPosts.length / limit);
  return { posts: paginatedPosts, totalPages, currentPage: page };
};

// Function to get all posts for admin (no pagination, for simplicity in admin table)
export const getAllPostsForAdmin = (): Post[] => {
  return [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Function to get a post by slug (simulates API call)
export const getPostBySlug = (slug: string): Post | undefined => {
  return mockPosts.find(post => post.slug === slug);
};

// Function to add a new post
export type CreatePostData = Omit<Post, 'id' | 'slug' | 'author' | 'createdAt' | 'updatedAt'> & { authorId?: string };
export const addPost = (postData: CreatePostData): Post => {
  const newId = (Math.max(...mockPosts.map(p => parseInt(p.id, 10)), 0) + 1).toString();
  const slug = slugify(postData.title);
  // Ensure slug is unique
  let finalSlug = slug;
  let counter = 1;
  while (mockPosts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const author = users.find(u => u.id === postData.authorId) || users[0]; // Default to first user if not found

  const newPost: Post = {
    ...postData,
    id: newId,
    slug: finalSlug,
    author,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : postData.tags,
  };
  mockPosts.unshift(newPost); // Add to the beginning of the array
  return newPost;
};

// Function to update an existing post
export type UpdatePostData = Partial<Omit<Post, 'id' | 'slug' | 'author' | 'createdAt' | 'updatedAt'>> & { authorId?: string };
export const updatePost = (slug: string, postData: UpdatePostData): Post | undefined => {
  const postIndex = mockPosts.findIndex(p => p.slug === slug);
  if (postIndex === -1) {
    return undefined;
  }

  const existingPost = mockPosts[postIndex];
  let newSlug = existingPost.slug;
  if (postData.title && postData.title !== existingPost.title) {
    newSlug = slugify(postData.title);
    // Ensure slug is unique if changed
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
  return updatedPost;
};

// Function to delete a post
export const deletePost = (slug: string): boolean => {
  const initialLength = mockPosts.length;
  mockPosts = mockPosts.filter(p => p.slug !== slug);
  return mockPosts.length < initialLength;
};
