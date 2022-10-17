import React, { useEffect, useRef } from 'react';
import { useSearchQuery } from '../../providers/SearchQueryProvider';
import { useMarkdown } from '../../utils/useMarkDown';

type Props = {
  text: string;
  scrollRatio?: number;
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

export const Render: React.FC<Props> = ({ text, scrollRatio }) => {
  const rendererRef = useRef<HTMLDivElement>(null);
  const md = useMarkdown();
  const renderedHTML = md.render(text);
  const { query } = useSearchQuery();
  const highlightedHTML = query ? highlight(renderedHTML, query) : renderedHTML;

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || !scrollRatio) {
      return;
    }
    renderer.scrollTop = (renderer.scrollHeight - renderer.clientHeight) * scrollRatio;
  }, [scrollRatio]);

  return <div ref={rendererRef} className="renderer" dangerouslySetInnerHTML={{ __html: highlightedHTML }}></div>;
};
