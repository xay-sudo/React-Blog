
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

export type SnippetLocation = 'header' | 'footer';

export interface CodeSnippet {
  id: string;
  name: string;
  code: string;
  location: SnippetLocation;
  isActive: boolean;
}

export interface SiteSettings {
  adsTxtContent: string;
  snippets: CodeSnippet[];
}
