import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
    js.configs.recommended,
    ...nextVitals,
    {
        ignores: [
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "tests/**",
            "**/**.test.**",
            "coverage/**",
        ],
    },
    {
        files: ["**/*.{js,jsx,mjs,cjs}"],
        rules: {
            semi: ["warn", "always"],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-unused-vars": ["warn", { 
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }],
            "prefer-const": "warn",
            "no-var": "error",
            "prefer-arrow-callback": "warn", //
            "no-duplicate-imports": "error",
            "no-useless-return": "warn",
        },
    },
]);

export default eslintConfig;