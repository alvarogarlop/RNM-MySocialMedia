// src/app/api/posts/[id]/index+api.ts

import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Test this endpoint with curl:
// curl -X GET http://localhost:8081/api/posts/1 -H "Authorization: Bearer <token>"
export async function GET(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [post] = await sql`
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
      WHERE posts.id = ${id}`;

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json(post);
}
