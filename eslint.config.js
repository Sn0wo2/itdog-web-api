import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'error'
        }
    },
    {
        files: ['example/**/*.ts', 'test/**/*.ts'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        ignores: [
            'dist/',
            'node_modules/',
            '**/*.js',
            '**/*.mjs',
            '**/*.cjs',
            'coverage/',
            '*.config.*'
        ]
    }
)
