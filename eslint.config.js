import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config([
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tseslint.parser,
            globals: {
                node: true,
                es6: true,
            },
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
        ignores: ['dist/', 'node_modules/'],
    },
])
