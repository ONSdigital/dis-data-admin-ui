import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
    //files: ["src/**/*.{js,jsx}"],
    // ignores: ["**/**.test.**"]
});

const eslintConfig = [
    ...compat.config({
        extends: ['next', 'eslint:recommended'],
        rules: { 
            semi: [1, "always"],
            '@next/next/no-html-link-for-pages': 'off', // prevent Next error message claiming can't find "pages" dir
        }
    }),
];

// configure each rule to ignore test files 
eslintConfig.forEach(config => {
    config.ignores = ["**/**.test.**"]
})

export default eslintConfig;