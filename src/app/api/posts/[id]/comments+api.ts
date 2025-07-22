// src/app/api/posts/[id]/comments.ts

import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";
import { sendNotification } from "@/services/serverNotifications";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts/1/comments -H "Authorization: Bearer <token>"
// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts/1/comments -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"content": "Hello, world!"}'
export async function POST(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { content } = await request.json();

    const [comment] = await sql`
            INSERT INTO comments (user_id, post_id, content)
           VALUES (${token.id}, ${id}, ${content}) RETURNING *`;

    await notifyPostAuthorAboutComment(id, token.id);

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

async function notifyPostAuthorAboutComment(
  comment_id: string,
  user_id: string
) {
  const [comment] = await sql`
    SELECT 
      comments.*, 
      row_to_json(posts) as post, 
      row_to_json(commenter) AS comment_author, 
      row_to_json(post_author) AS post_author 
    FROM comments
    JOIN users AS commenter ON comments.user_id = commenter.id
    JOIN posts ON comments.post_id = posts.id
    JOIN users AS post_author ON posts.user_id = post_author.id
    WHERE comments.id = ${comment_id};`;

  const [user] = await sql`
    SELECT * FROM users WHERE id = ${user_id}
  `;

  if (comment.post_author.push_token) {
    await sendNotification({
      to: comment.post_author.push_token,
      title: "You got a new comment",
      body: `${user.handle} commented on your post.  ${comment.content}`,
      data: { comment_id, url: `/post/${comment_id}` },
    });
  }
}
