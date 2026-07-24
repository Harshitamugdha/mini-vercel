import { fetchRepositories } from "../services/github.service.js";

export async function getRepositories(req, res) {
  try {
    const repos = await fetchRepositories(req.user.accessToken);

    res.json(repos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch repositories",
    });
  }
}