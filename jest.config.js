module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['./console/tests/setupTests.js']
};
