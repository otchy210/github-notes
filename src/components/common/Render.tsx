import React from 'react';
import { useSearchQuery } from '../../providers/SearchQueryProvider';
import { useMarkdown } from '../../utils/useMarkDown';

type Props = {
  text: string;
};

const highlight = (html: string, query: string) => {
  const root = document.createElement('div');
  root.innerHTML = html;
  const addSpan = (elem: Node) => {
    if (elem.nodeType === Node.TEXT_NODE) {
      const textContent = elem.textContent as string;
      if (textContent.trim().length === 0) {
        return;
      }
      const parent = elem.parentElement;
      if (!parent) {
        return;
      }
      const highlightedContent = textContent.replaceAll(query, `<span class="highlight">${query}</span>`);
      if (textContent === highlightedContent) {
        return;
      }
      parent.innerHTML = highlightedContent;
      return;
    }
    Array.from(elem.childNodes).forEach((child) => {
      addSpan(child);
    });
  };
  addSpan(root);
  return root.innerHTML;
};

export const Render: React.FC<Props> = ({ text }) => {
  const md = useMarkdown();
  const renderedHTML = md.render(text);
  const { query } = useSearchQuery();
  const highlightedHTML = query ? highlight(renderedHTML, query) : renderedHTML;

  return <div dangerouslySetInnerHTML={{ __html: highlightedHTML }}></div>;
};
