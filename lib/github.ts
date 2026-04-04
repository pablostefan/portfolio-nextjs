import type { Project } from '@/types';

const GITHUB_API = 'https://api.github.com';
const USERNAME   = 'pablostefan';

/** Raw shape returned by the GitHub REST API */
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  private: boolean;
  archived: boolean;
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchPortfolioProjects(): Promise<Project[]> {
  const url = `${GITHUB_API}/users/${USERNAME}/repos?per_page=100&sort=updated`;

  const res = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos: GitHubRepo[] = await res.json();

  return repos
    .filter(
      (r) =>
        !r.fork &&
        !r.private &&
        !r.archived &&
        r.topics.includes('portfolio'),
    )
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map((r) => ({
      id:               r.id,
      name:             r.name,
      description:      r.description,
      html_url:         r.html_url,
      homepage:         r.homepage,
      topics:           r.topics,
      stargazers_count: r.stargazers_count,
      language:         r.language,
      updated_at:       r.updated_at,
    }));
}
