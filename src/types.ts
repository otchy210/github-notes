export type NoteMeta = {
  updatedAt: number;
};

export type Note = NoteMeta & {
  key: string;
  content: string;
};
