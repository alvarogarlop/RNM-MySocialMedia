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

    const mysql = `
            INSERT INTO comments (user_id, post_id, content)
           VALUES (${token.id}, ${id}, ${content}) RETURNING *`;

    const [comment] = await sql`
            INSERT INTO comments (user_id, post_id, content)
           VALUES (${token.id}, ${id}, ${content}) RETURNING *`;

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error inserting comment", { status: 500 });
  }
}
