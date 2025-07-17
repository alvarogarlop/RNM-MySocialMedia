type CreateCommentInput = {
  content: string;
};

export async function createCommentRequest(
  comment: CreateCommentInput,
  id: number,
  accessToken: string
) {
  const response = await fetch(`/api/posts/${id}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}
