import { Post } from "./types/models";

const dummyPosts: Post[] = [
  {
    id: 1,
    author: {
      id: "1",
      name: "John Doe",
      handle: "@johndoe",
      avatar:
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
    },
    content: "Just deployed my first React app! 🚀 #webdev #coding",
    created_at: "2025-02-20T10:30:00Z",
    likes_count: 42,
    retweets_count: 12,
    replies_count: 5,
    is_liked: false,
  },
  {
    id: 2,
    author: {
      id: "2",
      name: "Jane Smith",
      handle: "@janesmith",
      avatar:
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg",
    },
    content:
      "Beautiful morning for some coding ☕️ Working on a new TypeScript project today.",
    created_at: "2024-03-20T09:15:00Z",
    likes_count: 28,
    retweets_count: 8,
    replies_count: 3,
  },
  {
    id: 3,
    author: {
      id: "3",
      name: "Tech News Daily",
      handle: "@technews",
      avatar:
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/11.png",
    },
    content:
      "Breaking: New JavaScript framework promises to revolutionize web development! What are your thoughts? 🤔",
    created_at: "2024-03-20T08:00:00Z",
    likes_count: 156,
    retweets_count: 45,
    replies_count: 28,
  },
  {
    id: 4,
    author: {
      id: "4",
      name: "Vadim",
      handle: "@vadim",
      avatar:
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.png",
    },
    content: "Just deployed my first React Native app! 🚀 #mobiledev #coding",
    created_at: "2024-03-20T10:30:00Z",
    likes_count: 42,
    retweets_count: 12,
    replies_count: 5,
  },
];

export default dummyPosts;
