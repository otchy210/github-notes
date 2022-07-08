import { hello } from './index';

describe('hello', () => {
  it('works', () => {
    expect(hello('otchy')).toBe('hello otchy');
  });
});
