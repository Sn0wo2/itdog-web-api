import type {UserConfig} from '@commitlint/types'

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'test',
                'chore',
                'revert',
                'build',
                'ci',
                'perf',
                'deps',
            ],
        ],
        'subject-full-stop': [2, 'never', '.'],
    },
}

export default config
