import React from 'react';
import { render } from '@testing-library/react';
import { Config } from './Config';
import { MemoryRouter } from 'react-router-dom';

describe('Config', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Config priority={1} />, { wrapper: MemoryRouter });
    expect(asFragment()).toMatchSnapshot();
  });
});
