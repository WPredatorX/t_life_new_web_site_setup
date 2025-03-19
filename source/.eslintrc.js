module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  extends: [
    "prettier",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "react/prop-types": ["off"],
    "no-unused-vars": "off",
    "no-duplicate-imports": "error",
    "no-unused-expressions": "off",
    "prettier/prettier": [
      "error",
      {
        arrowParens: "avoid",
        bracketSpacing: true,
        bracketSameLine: false,
        printWidth: 100,
        proseWrap: "preserve",
        quoteProps: "as-needed",
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "all",
        useTabs: false,
        endOfLine: "auto",
        jsxSingleQuote: true,
        parser: "babel",
      },
    ],
  },
};
