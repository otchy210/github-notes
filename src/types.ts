export type NoteMeta = {
  updatedAt: number;
};

export type Note = {
  key: string;
  content: string;
} & NoteMeta;
