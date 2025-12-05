import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow setState in effects when using requestAnimationFrame or setTimeout
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn", // Allow setState in effects with requestAnimationFrame
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@next/next/no-html-link-for-pages": "warn", // Allow <a> for external links
      "react-hooks/purity": "warn", // Allow Math.random in useEffect
      "react-hooks/error-boundaries": "warn", // Allow JSX in try/catch for error handling
      "react/no-unescaped-entities": "warn", // Allow quotes in JSX
      "prefer-const": "warn", // Allow let for reassignment
    },
  },
]);

export default eslintConfig;
