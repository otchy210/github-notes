import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
export const useMarkdown = () => {
  return md;
};
