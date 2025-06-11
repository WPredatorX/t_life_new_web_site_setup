const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  modulePaths: ["<rootDir>/src/", "<rootDir>/.jest"],
  moduleNameMapper: {
    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle image imports
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i": `<rootDir>/src/__mocks__/fileMock.js`,

    // Handle module aliases
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@apis/(.*)$": "<rootDir>/src/apis/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@stores/(.*)$": "<rootDir>/src/stores/$1",
    "^@utilities/(.*)$": "<rootDir>/src/utilities/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",

    // Handle @next/font
    "@next/font/(.*)": `<rootDir>/src/__mocks__/nextFontMock.js`,

    // Handle next/font
    "next/font/(.*)": `<rootDir>/src/__mocks__/nextFontMock.js`,

    // Handle Additional Library
    "swiper/css": "identity-obj-proxy",
    "swiper/css/pagination": "identity-obj-proxy",
    "swiper/css/navigation": "identity-obj-proxy",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      branches: 80,
      functions: 80,
    },
  },
  testTimeout: 60000,
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/app/layout.jsx", // Cannot render html inside div (of normal render)
    "/src/components/[^/]+/components/", // skip sub-component jest loop infinite
    "/src/components/.+/components/", // skip sub-component jest loop infinite
    "src/components/shares/app-wyswig/*", // Cannot render dynamic import
    "src/constants/*",
    "src/hooks/index.js",
    "src/hooks/useAppIntl.js",
    "src/themes/*",
    "src/constants/*",
    "src/stores/index.js",
  ],
};

module.exports = createJestConfig(customJestConfig);
