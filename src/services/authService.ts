export async function signInRequest(handle: string) {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ handle }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign in");
  }

  return response.json();
}
