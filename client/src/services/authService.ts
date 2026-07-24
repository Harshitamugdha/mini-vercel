const API_URL = import.meta.env.VITE_API_URL;

export const loginWithGitHub = () => {
  window.location.href = `${API_URL}/auth/github`;
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  return res.json();
};
export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}