// src/app/api/posts/[id]/comments.ts

import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts/1/comments -H "Authorization: Bearer <token>"
// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts/1/comments -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"content": "Hello, world!"}'
export async function POST(request: Request, { id }: { id: string }) {
  try {
    const token = getDecodedToken(request);

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { content } = await request.json();

    const [comment] = await sql`
            INSERT INTO comments (user_id, post_id, content)
           VALUES (${token.id}, ${id}, ${content}) RETURNING *`;

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error inserting comment", { status: 500 });
  }
}

export async function GET(request: Request, { id }: { id: string }) {
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
    const comments = await sql`
    SELECT
      comments.*,
      row_to_json(users) AS author
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ${id}
    AND comments.id < ${cursor}
    ORDER BY comments.id DESC
    LIMIT ${limit}
  `;
    return Response.json({ comments });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error fetching posts", { status: 500 });
  }
}
