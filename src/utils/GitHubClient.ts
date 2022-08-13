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

type TextFileResponse = OctokitResponse<
  {
    type: string;
    size: number;
    name: string;
    path: string;
    content?: string | undefined;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    encoding: string;
    _links: {
      git: string;
      html: string;
      self: string;
    };
  },
  200
>;

type NoteMeta = {
  updatedAt: number;
};

type Note = NoteMeta & {
  key: string;
  content: string;
};

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
  async getNotesTree(headTreeResponse?: TreeResponse): Promise<TreeResponse> {
    const tree = headTreeResponse ?? (await this.getHeadTree());
    const metaTreeSha = tree.data.tree
      .filter(({ path }) => {
        return path === 'notes';
      })
      .map(({ sha }) => sha)[0];
    return this.api.git.getTree({ ...this.repo.apiParam, tree_sha: metaTreeSha ?? '' });
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
  private async getNoteContentResponse(key: string): Promise<TextFileResponse> {
    return this.api.repos.getContent({ ...this.repo.apiParam, path: `notes/${key}.md` }) as Promise<TextFileResponse>;
  }
  private async getNoteMetaResponse(key: string): Promise<TextFileResponse> {
    return this.api.repos.getContent({ ...this.repo.apiParam, path: `meta/${key}.json` }) as Promise<TextFileResponse>;
  }
  private async getTextContent(file: TextFileResponse): Promise<string> {
    const { type, encoding, content } = file.data;
    if (type !== 'file') {
      throw new Error(`note type is not file: ${type}`);
    }
    if (encoding !== 'base64') {
      throw new Error(`encoding is not base64: ${encoding}`);
    }
    if (!content) {
      throw new Error('no content');
    }
    const response = await window.fetch(`data:text/plain;charset=UTF-8;base64,${content}`);
    return response.text();
  }
  private async getNoteContent(key: string): Promise<string> {
    const file = await this.getNoteContentResponse(key);
    return await this.getTextContent(file);
  }
  private async getNoteMeta(key: string): Promise<NoteMeta> {
    const file = await this.getNoteMetaResponse(key);
    const jsonText = await this.getTextContent(file);
    return JSON.parse(jsonText) as NoteMeta;
  }
  async getNote(key: string): Promise<Note> {
    const content = await this.getNoteContent(key);
    const meta = await this.getNoteMeta(key);
    return {
      key,
      content,
      ...meta,
    };
  }
  async pushNote(key: string, content: string): Promise<Note> {
    const contentBlob = await this.createTextBlob(content);
    const meta: NoteMeta = {
      updatedAt: Date.now(),
    };
    const metaJson = JSON.stringify(meta);
    const metaBlob = await this.createTextBlob(metaJson);
    await this.pushBlobs('Save note', [
      { blob: metaBlob, path: `meta/${key}.json` },
      { blob: contentBlob, path: `notes/${key}.md` },
    ]);
    return {
      key,
      content,
      ...meta,
    };
  }
}
