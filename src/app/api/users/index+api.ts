// src/app/api/users/index+api.ts

import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function PATCH(request: Request) {
  try {
    const token = getDecodedToken(request);
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name, handle, avatar, push_token } = await request.json();

    const [updatedUser] = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${name}, name),
        handle = COALESCE(${handle}, handle),
        avatar = COALESCE(${avatar}, avatar),
        push_token = COALESCE(${push_token}, push_token)
      WHERE id = ${token.id}
      RETURNING *`;

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Database Error:", error);
    return Response.json({ error: "Error updating user" }, { status: 500 });
  }
}
