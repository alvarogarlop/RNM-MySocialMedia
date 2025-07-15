// src/app/api/posts/[id]/like+api.ts

import { sendNotification } from "@/services/serverNotifications";
import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts/1/like -H "Authorization: Bearer <token>"
export async function POST(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [like] = await sql`
      INSERT INTO likes (user_id, post_id) 
      VALUES (${token.id}, ${id})
      ON CONFLICT (user_id, post_id) DO NOTHING 
      RETURNING * ;`;

    await notifyPostAuthorAboutLike(id, token.id);

    return new Response(JSON.stringify(like), { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error liking post", { status: 500 });
  }
}

// Test this endpoint with curl:
// curl -X DELETE http://localhost:8081/api/posts/1/like -H "Authorization: Bearer <token>"
export async function DELETE(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [like] = await sql`
      DELETE FROM likes 
      WHERE user_id = ${token.id} AND post_id = ${id};`;

    return new Response(JSON.stringify(like), { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error unliking post", { status: 500 });
  }
}

async function notifyPostAuthorAboutLike(post_id: string, user_id: string) {
  // fetch post with author
  const [post] = await sql`
    SELECT posts.*, row_to_json(users) AS author 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ${post_id};`;

  const [user] = await sql`
    SELECT * FROM users WHERE id = ${user_id}
  `;

  if (post.author.push_token) {
    await sendNotification({
      to: post.author.push_token,
      title: "You got a new like",
      body: `${user.handle} liked your post.  ${post.content}`,
      data: { post_id, url: `/post/${post_id}` },
    });
  }
}
