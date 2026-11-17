const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const testDatabaseConfig = {
  POSTGRES_HOST: "127.0.0.1",
  POSTGRES_PORT: "5433",
  POSTGRES_DB: "clone_tabnews_test",
};

for (const [variable, expectedValue] of Object.entries(testDatabaseConfig)) {
  if (process.env[variable] !== expectedValue) {
    throw new Error(
      `Jest requires the isolated test database (${variable}=${expectedValue}).`,
    );
  }
}

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 80000,
});

module.exports = jestConfig;
