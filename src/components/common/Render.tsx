import React from 'react';
import { useMarkdown } from '../../utils/useMarkDown';

type Props = {
  text: string;
};

export const Render: React.FC<Props> = ({ text }) => {
  const md = useMarkdown();
  const renderedHTML = md.render(text);

  return <div dangerouslySetInnerHTML={{ __html: renderedHTML }}></div>;
};
