module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  settings: {
    "import/extensions": [".ts"],
    "import/resolver": {
      node: {
        extensions: [".ts"],
      },
    },
  },
  rules: {
    quotes: 0, // 关闭单引号
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
  },
};
