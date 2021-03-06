import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  errorOnDeprecated: true,
  transform: {
    '^.+\\.scss$': 'jest-transform-stub',
  },
};

export default config;
