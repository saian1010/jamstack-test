export const PAGE_SIZE = 10;

type GitHubRepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
};

export type Repository = {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  languageColor: string;
  stargazersCount: number;
  forksCount: number;
};

type RepositoryResult = {
  repositories: Repository[];
  totalPages: number;
  error: string | null;
};

const LANGUAGE_COLORS: Record<string, string> = {
  CSS: "#663399",
  Go: "#0891b2",
  HTML: "#f97316",
  JavaScript: "#facc15",
  PHP: "#7c83fd",
  Python: "#3572a5",
  Ruby: "#a91e2c",
  Rust: "#b45309",
  Shell: "#65d046",
  TypeScript: "#3178c6"
};

function getLanguageColor(language: string | null) {
  if (!language) {
    return "#9ca3af";
  }

  return LANGUAGE_COLORS[language] ?? "#9ca3af";
}

function getRequestHeaders() {
  const headers = new Headers({
    Accept: "application/vnd.github+json"
  });

  if (process.env.GITHUB_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
  }

  return headers;
}

function parsePageCountFromLinkHeader(linkHeader: string | null, currentPage: number) {
  // GitHub's repo list API does not return a total count, so the Link header is the only pagination source of truth.
  if (!linkHeader) {
    return currentPage;
  }

  const lastPageMatch = linkHeader.match(/[\?&]page=(\d+)>;\s*rel="last"/);

  if (lastPageMatch) {
    return Number.parseInt(lastPageMatch[1], 10);
  }

  const nextPageMatch = linkHeader.match(/[\?&]page=(\d+)>;\s*rel="next"/);

  if (nextPageMatch) {
    return Number.parseInt(nextPageMatch[1], 10);
  }

  return currentPage;
}

export async function getRepositories(page: number): Promise<RepositoryResult> {
  const apiUrl = new URL("https://api.github.com/orgs/github/repos");
  apiUrl.searchParams.set("sort", "name");
  apiUrl.searchParams.set("per_page", PAGE_SIZE.toString());
  apiUrl.searchParams.set("page", page.toString());

  try {
    const response = await fetch(apiUrl, {
      headers: getRequestHeaders(),
      // Repo listings change slowly enough that hourly revalidation keeps the page responsive without hammering the API.
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (response.status === 403) {
        return {
          repositories: [],
          totalPages: 1,
          error:
            "GitHub API rate limit reached. Add a GITHUB_TOKEN environment variable or wait for the limit window to reset."
        };
      }

      return {
        repositories: [],
        totalPages: 1,
        error: `GitHub API request failed with status ${response.status}.`
      };
    }

    const payload = (await response.json()) as GitHubRepositoryResponse[];
    const totalPages = parsePageCountFromLinkHeader(response.headers.get("link"), page);

    return {
      repositories: payload.map((repository) => ({
        id: repository.id,
        name: repository.name,
        fullName: repository.full_name,
        htmlUrl: repository.html_url,
        description: repository.description,
        language: repository.language,
        languageColor: getLanguageColor(repository.language),
        stargazersCount: repository.stargazers_count,
        forksCount: repository.forks_count
      })),
      totalPages,
      error: null
    };
  } catch {
    return {
      repositories: [],
      totalPages: 1,
      error: "A network error occurred while contacting the GitHub API."
    };
  }
}
