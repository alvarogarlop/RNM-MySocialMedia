type CreateCommentInput = {
  content: string;
};

type GetCommentsParams = {
  post_id: number;
  cursor?: string;
  limit?: number;
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

export async function getComments(pageParam: GetCommentsParams, token: string) {
  const searchParams = new URLSearchParams();

  if (pageParam.cursor) {
    searchParams.append("cursor", pageParam.cursor);
  }

  if (pageParam.limit) {
    searchParams.append("limit", pageParam.limit.toString());
  }

  const url = `/api/posts/${
    pageParam.post_id
  }/comments?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();

  return data.comments;
}
