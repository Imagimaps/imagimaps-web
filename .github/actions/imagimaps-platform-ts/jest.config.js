module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useEsm: true }]
  },
  coverageReporters: ['json-summary', 'lcov', 'text'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
};
