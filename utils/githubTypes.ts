// utils/githubTypes.ts
export interface Repository {
    name: string;
    open_issues: number;
    updated_at: string;
    url: string;
    subscribers_count?: number;
  }