
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: User;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  featuredImage?: string;
  excerpt: string;
  category?: string;
  tags?: string[];
}
