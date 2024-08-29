import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  reporters: ["jest-summarizing-reporter"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
