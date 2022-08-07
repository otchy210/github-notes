import React from 'react';
import { useMarkdown } from '../../utils/useMarkDown';

type Props = {
  text: string;
};

export const View: React.FC<Props> = ({ text }) => {
  const md = useMarkdown();
  const renderedHTML = md.render(text);

  return <div className="view" dangerouslySetInnerHTML={{ __html: renderedHTML }}></div>;
};
