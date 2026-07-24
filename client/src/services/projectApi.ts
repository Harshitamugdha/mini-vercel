import type { ImportRepoPayload } from "../types/project";

const API = import.meta.env.VITE_API_URL;

export async function createProject(payload: ImportRepoPayload) {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}
export async function deleteProject(projectId: string) {
  const res = await fetch(
    `${API}/projects/${projectId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }

  return res.json();
}
export async function getProjects() {
  const res = await fetch(`${API}/projects`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}
export async function redeployProject(
    projectId: string
) {
    const res = await fetch(
        `${API}/projects/${projectId}/redeploy`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Redeploy failed");
    }

    return res.json();
}