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
  coverageReporters: ['text-summary', 'json-summary'],
  moduleDirectories: ['src', 'node_modules'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};
