import React from 'react';

type Props = {
  toggleNavShown: () => void;
};

export const Header: React.FC<Props> = ({ toggleNavShown }: Props) => {
  return (
    <header>
      <div className="icon-holder">
        <div className="icon menu" onClick={() => toggleNavShown()}>
          <svg viewBox="0 0 32 32">
            <path fill="#999" stroke="none" d="M 0 18 L 32 18 L 32 14 L 0 14 Z" />
            <path fill="#999" stroke="none" d="M 0 8 L 32 8 L 32 4 L 0 4 Z" />
            <path fill="#999" stroke="none" d="M 0 28 L 32 28 L 32 24 L 0 24 Z" />
          </svg>
        </div>
      </div>
      <form className="search">
        <div>
          <input placeholder="Search notes" />
        </div>
      </form>
      <div className="icon-holder">
        <div className="icon user">
          <svg viewBox="0 0 32 32">
            <path
              fill="#999"
              stroke="none"
              d="M 24 12 C 24 7.581722 20.418278 4 16 4 C 11.581722 4 8 7.581722 8 12 C 8 16.418278 11.581722 20 16 20 C 20.418278 20 24 16.418278 24 12 Z"
            />
            <path fill="#999" stroke="none" d="M 4 32 L 4 28 C 4 23.581745 7.581745 20 12 20 L 20 20 C 24.418259 20 28 23.581745 28 28 L 28 32 L 4 32 Z" />
          </svg>
        </div>
      </div>
    </header>
  );
};
