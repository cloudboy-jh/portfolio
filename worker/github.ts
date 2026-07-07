import type { GitHubFacts } from "./types";

const OWNER = "cloudboy-jh";

interface RepoResponse {
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
}

/**
 * Fetch a single repo's live facts from the GitHub REST API.
 * Returns null if the repo is missing or the request fails so a single
 * bad repo never breaks the whole rebuild.
 */
export async function fetchRepo(
  repo: string,
  token?: string,
): Promise<GitHubFacts | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "cloudboy-jh-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${repo}`,
      { headers },
    );
    if (!res.ok) {
      console.warn(`github: ${repo} -> HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as RepoResponse;
    return {
      description: data.description ?? "",
      url: data.html_url,
      homepage: data.homepage && data.homepage.trim() ? data.homepage : null,
      language: data.language,
      stars: data.stargazers_count,
      pushedAt: data.pushed_at,
    };
  } catch (e) {
    console.warn(`github: ${repo} fetch failed`, e);
    return null;
  }
}
