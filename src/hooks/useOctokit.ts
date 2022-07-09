import { Octokit } from '@octokit/rest';

const userAgent = 'GitHub Notes';

export const useOctokit = (auth: string) => {
  return new Octokit({ auth, userAgent, baseUrl: 'https://api.github.com' });
};
