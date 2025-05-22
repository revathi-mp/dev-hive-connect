
// Database schema types for Supabase
export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  category_id?: string;
  likes?: number;
  views?: number;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  created_at: string;
  updated_at?: string;
  likes?: number;
  parent_id?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at?: string;
  skills?: string[];
  reputation?: number;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface InterviewQuestion {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at?: string;
  difficulty: string;
  category?: string;
  likes?: number;
}
