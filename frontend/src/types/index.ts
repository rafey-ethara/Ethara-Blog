export interface Author {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  role: 'admin' | 'author';
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'published';
  readingTime: number;
  likeCount: number;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  name: string;
  content: string;
  approved: boolean;
  createdAt: string;
}

export interface Subscriber {
  _id: string;
  name: string;
  email: string;
  subscribedAt: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
  details?: Record<string, string>;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface SearchResponse {
  posts: Post[];
  query: string;
  pagination: Pagination;
}

export interface AdminStats {
  posts: number;
  subscribers: number;
  contacts: number;
  comments: number;
  totalViews: number;
}
