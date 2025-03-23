// tests/seleniumHQ.spec.ts
import { test, expect } from '@playwright/test';
import { Repository } from '../../utils/githubTypes';
import { fetchAllRepositories, sortRepositoriesByUpdate, findMostWatchedRepository } from '../../utils/githubHelpers';

require('dotenv').config();

// Lấy token từ biến môi trường
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

test('GitHub Project', async ({ request }) => {
  // Thêm headers xác thực
  const authHeaders = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  };
  // Fetch and process data
  const allRepos = await fetchAllRepositories(request, authHeaders);
  const totalIssues = calculateTotalIssues(allRepos);
  const sortedRepos = sortRepositoriesByUpdate(allRepos);
  const mostWatchedRepo = await findMostWatchedRepository(request, authHeaders, allRepos);

  // Log results
  logResults(totalIssues, sortedRepos, mostWatchedRepo);

  // Add assertions if needed
  expect(totalIssues).toBeGreaterThan(0);
});

// Local helper functions
function calculateTotalIssues(repos: Repository[]): number {
  return repos.reduce((sum, repo) => sum + repo.open_issues, 0);
}

function logResults(totalIssues: number, sortedRepos: Repository[], mostWatchedRepo: Repository) {
  console.log(`Total Open Issues: ${totalIssues}`);
  
  console.log('\nRepositories Sorted by Last Update:');
  sortedRepos.forEach(repo => 
    console.log(`- ${repo.name.padEnd(30)} ${repo.updated_at}`)
  );

  console.log(`\nMost Watched Repository: ${mostWatchedRepo.name}`);
  console.log(`Watchers Count: ${mostWatchedRepo.subscribers_count}`);
}