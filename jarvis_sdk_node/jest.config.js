module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts)$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    'jose/(.*)': '<rootDir>/node_modules/jose/dist/node/cjs/$1.js',
  },
  collectCoverageFrom: ['src/sdk/**/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['text-summary'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};
