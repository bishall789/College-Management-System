module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "routes/**/*.js",
    "middleware/**/*.js",
    "models/**/*.js",
    "config/**/*.js",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
}
