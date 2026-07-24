export async function fetchRepositories(accessToken) {
  const response = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=100",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  const repos = await response.json();
  repos.sort(
  (a, b) =>
    new Date(b.updated_at) - new Date(a.updated_at)
);
return repos.map((repo) => ({
  id: repo.id,
  name: repo.name,
  owner: repo.owner.login,
  fullName: repo.full_name,

  isPrivate: repo.private,

  visibility: repo.visibility,

  description: repo.description,

  defaultBranch: repo.default_branch,

  language: repo.language,

  updatedAt: repo.updated_at,

  pushedAt: repo.pushed_at,

  url: repo.html_url,

  fork: repo.fork,

  archived: repo.archived,
}));
}