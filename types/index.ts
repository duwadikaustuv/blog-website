export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  excerpt: string;
  content?: string;
  coverImage: string;
  readTime: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string | null;
  published: boolean;
  readTime: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    name: string | null;
    image: string | null;
  };
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  _count?: {
    articles: number;
  };
}
