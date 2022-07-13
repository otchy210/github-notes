import React from 'react';
import { render } from '@testing-library/react';
import { Home } from './Home';
import { MemoryRouter } from 'react-router-dom';

describe('Home', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Home />, { wrapper: MemoryRouter });
    expect(asFragment()).toMatchSnapshot();
  });
});
