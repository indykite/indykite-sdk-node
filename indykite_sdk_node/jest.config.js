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
  coverageReporters: ['text-summary', 'json-summary', 'html'],
  moduleDirectories: ['src', 'node_modules'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};
