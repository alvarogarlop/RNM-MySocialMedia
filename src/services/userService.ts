// src/services/userService.ts

type UpdateUserInput = {
  name?: string;
  handle?: string;
  push_token?: string;
};

export async function updateUserRequest(user: UpdateUserInput, token: string) {
  const response = await fetch("/api/users", {
    method: "PATCH",
    body: JSON.stringify(user),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const data = await response.json();
  return data;
}
