import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
import { GitHubRepo } from '../providers/GitHubProvider';

type RefResponse = OctokitResponse<
  {
    ref: string;
    node_id: string;
    url: string;
    object: {
      type: string;
      sha: string;
      url: string;
    };
  },
  200
>;

type CommitResponse = OctokitResponse<
  {
    sha: string;
    node_id: string;
    url: string;
    author: {
      date: string;
      email: string;
      name: string;
    };
    committer: {
      date: string;
      email: string;
      name: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    parents: {
      url: string;
      sha: string;
      html_url: string;
    }[];
    verification: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
    html_url: string;
  },
  200
>;

type TreeResponse = OctokitResponse<
  {
    sha: string;
    url: string;
    truncated: boolean;
    tree: {
      path?: string | undefined;
      mode?: string | undefined;
      type?: string | undefined;
      sha?: string | undefined;
      size?: number | undefined;
      url?: string | undefined;
    }[];
  },
  200
>;

type BlobResponse = OctokitResponse<
  {
    url: string;
    sha: string;
  },
  201
>;

export class GitHubClient {
  api: Octokit;
  repo: GitHubRepo;
  constructor(api: Octokit, repo: GitHubRepo) {
    this.api = api;
    this.repo = repo;
  }
  async getHeadRef(): Promise<RefResponse> {
    return this.api.git.getRef({ ...this.repo.apiParam, ref: `heads/${this.repo.defaultBranch}` });
  }
  async getHeadCommit(refResponse?: RefResponse): Promise<CommitResponse> {
    const ref = refResponse ?? (await this.getHeadRef());
    const commitSha = ref.data.object.sha;
    return this.api.git.getCommit({ ...this.repo.apiParam, commit_sha: commitSha });
  }
  async getHeadTree(commitResponse?: CommitResponse): Promise<TreeResponse> {
    const commit = commitResponse ?? (await this.getHeadCommit());
    const treeSha = commit.data.tree.sha;
    return this.api.git.getTree({ ...this.repo.apiParam, tree_sha: treeSha });
  }
  async createTextBlob(content: string): Promise<BlobResponse> {
    return this.api.git.createBlob({ ...this.repo.apiParam, encoding: 'utf-8', content });
  }
  async pushBlobs(message: string, blobs: { blob: BlobResponse; path: string }[]): Promise<RefResponse> {
    const commit = await this.getHeadCommit();
    const commitSha = commit.data.sha;
    const treeSha = commit.data.tree.sha;
    const newTree = await this.api.git.createTree({
      ...this.repo.apiParam,
      base_tree: treeSha,
      tree: blobs.map(({ blob, path }) => {
        return { path, mode: '100644', type: 'blob', sha: blob.data.sha };
      }),
    });
    const newCommit = await this.api.git.createCommit({ ...this.repo.apiParam, message, parents: [commitSha], tree: newTree.data.sha });
    return this.api.git.updateRef({ ...this.repo.apiParam, ref: `heads/${this.repo.defaultBranch}`, sha: newCommit.data.sha });
  }
}
