// utils/githubHelpers.ts
import { expect, APIRequestContext } from '@playwright/test';
import { Repository } from './githubTypes.ts';

export async function fetchAllRepositories( 
  request: APIRequestContext,
  headers: object
  ): Promise<Repository[]> {
  const repositories: Repository[] = [];
  let currentPage = 1;

  try {
    while (true) {
      const response = await request.get(
        `https://api.github.com/orgs/SeleniumHQ/repos?page=${currentPage}&per_page=100`,
        { headers }
      );

      if (!response.ok()) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status()} - ${error}`);
      }

      const pageRepos = await response.json();
      if (pageRepos.length === 0) break;

      repositories.push(...pageRepos);
      currentPage++;
    }
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
  }
  return repositories;
}

export async function findMostWatchedRepository(
  request: APIRequestContext,
  headers: object,
  repos: Repository[]
): Promise<Repository> {
  try {
    for (const repo of repos) {
      const response = await request.get(repo.url, { headers });
      if (!response.ok()) continue;
      
      const details = await response.json();
      repo.subscribers_count = details.subscribers_count;
    }
  } catch (error) {
    console.error('Error fetching watchers:', error);
  }

  return repos.reduce((prev, current) =>
    (prev.subscribers_count || 0) > (current.subscribers_count || 0) ? prev : current
  );
}

export function sortRepositoriesByUpdate(repos: Repository[]): Repository[] {
  return [...repos].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}