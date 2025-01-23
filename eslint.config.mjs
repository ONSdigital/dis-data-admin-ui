import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next', 'eslint:recommended'],
        rules: {
            semi: [1, "always"],
            '@next/next/no-html-link-for-pages': 'off', // prevent Next error message claiming can't find "pages" dir
        },
        plugins: [
            "@typescript-eslint",
            "react-hooks",
            "react",
            "testing-library",
        ],
        ignorePatterns: ["**/**.test.**"]
    }),
];

export default eslintConfig;