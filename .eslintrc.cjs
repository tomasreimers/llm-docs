module.exports = {
  root: true,
  plugins: [
    "simple-import-sort",
    "import",
    "@typescript-eslint",
    "check-file",
    "switch-case",
  ],
  rules: {
    "no-console": 2,
    "require-await": "off",
    "@typescript-eslint/await-thenable": "error",
    "no-return-await": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "inline-type-imports", prefer: "type-imports" },
    ],
    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    // ***********
    // import rules
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": ["error", { "prefer-inline": true }],
    "import/no-cycle": "warn",
    "import/no-unresolved": 2,
    "import/default": 2,
    "switch-case/newline-between-switch-case": [
      "error",
      "always",
      { fallthrough: "never" },
    ],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  overrides: [
    {
      files: ['*.mdx'],
      extends: ['plugin:mdx/recommended'],
      plugins: [],
      rules: {
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/return-await": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import/no-cycle": "off",
      }, 
      parserOptions: {
        extensions: [".mdx"],
        markdownExtensions: [".md"]
      }
    }
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    extensions: [".ts", ".tsx"],
  },
};
