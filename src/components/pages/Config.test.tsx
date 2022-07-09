import React from 'react';
import { render } from '@testing-library/react';
import { Config } from './Config';

describe('Config', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Config />);
    expect(asFragment()).toMatchSnapshot();
  });
});
