// src/app/api/posts/index+api.ts

import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Test this endpoint with curl:
// curl -X GET http://localhost:8081/api/posts?limit=2 -H "Authorization: Bearer <token>"
export async function GET(request: Request) {
  const token = getDecodedToken(request);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "3");
  const cursor = searchParams.get("cursor")
    ? parseInt(searchParams.get("cursor") || "0")
    : Number.MAX_SAFE_INTEGER;

  try {
    const posts = await sql`
    SELECT 
      posts.*, 
      row_to_json(users) AS author,
      (SELECT COUNT(*)::INTEGER FROM likes l WHERE l.post_id = posts.id) AS likes_count,
      (SELECT COUNT(*)::INTEGER FROM comments l WHERE l.post_id = posts.id) AS comments_count,
      EXISTS (
           SELECT 1 FROM likes l 
           WHERE l.post_id = posts.id AND l.user_id = ${token.id}
       ) AS is_liked
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id < ${cursor}
    ORDER BY posts.id DESC
    LIMIT ${limit}
  `;
    return Response.json({ posts });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error fetching posts", { status: 500 });
  }
}

// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"content": "Hello, world!"}'
export async function POST(request: Request) {
  try {
    const token = getDecodedToken(request);

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { content } = await request.json();

    const [post] = await sql`
            INSERT INTO posts (user_id, content) 
           VALUES (${token.id}, ${content}) RETURNING *`;

    return new Response(JSON.stringify(post), { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error inserting post", { status: 500 });
  }
}
