require("dotenv").config({ path: ".env.test" });

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"], // Load environment variables before tests
  transform: {
    "^.+\\.ts?$": ["ts-jest", { isolatedModules: true }], // ✅ Move ts-jest config here
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
  detectOpenHandles: true,
};
