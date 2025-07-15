export type User = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
};

export type Post = {
  id: number;
  author: User;
  content: string;
  created_at: string;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  is_liked?: boolean;
};

export type Comment = {
  id: number;
  created_at: string;
  user_id: string;
  post_id: number;
  content: string;
};
