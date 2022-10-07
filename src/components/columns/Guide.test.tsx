import React from 'react';
import { render } from '@testing-library/react';
import { Guide } from './Guide';
import { MemoryRouter } from 'react-router-dom';

describe('Guide', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Guide />, { wrapper: MemoryRouter });
    expect(asFragment()).toMatchSnapshot();
  });
});
