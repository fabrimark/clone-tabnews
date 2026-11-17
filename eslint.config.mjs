import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextVitals,

  {
    files: [
      "**/*.test.js",
      "**/*.test.jsx",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.js",
      "**/*.spec.jsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],

    ...jest.configs["flat/recommended"],

    settings: {
      jest: {
        version: 29,
      },
    },
  },

  {
    rules: {
      "no-unused-vars": ["error", { args: "none" }],
    },
  },

  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
];

export default eslintConfig;
