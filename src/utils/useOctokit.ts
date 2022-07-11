import { Octokit } from '@octokit/rest';
import { useLocalStorage } from './useLocalStorage';

const userAgent = 'GitHub Notes';

export const useOctokit = (): Octokit | null => {
  const localStorage = useLocalStorage();
  const auth = localStorage.get('accessToken');
  if (!auth) {
    return null;
  }
  return new Octokit({ auth, userAgent, baseUrl: 'https://api.github.com' });
  // check if accessToken is valid
  // auth error?
  // repo permission?
};
