import globals from 'globals'
import pluginJs from '@eslint/js'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  // { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  // { languageOptions: { globals: globals.node } },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        es2021: true,
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parserOptions: {
        requireConfigFile: false,
        'ecmaVersion': 'latest'
      },
    },
  },
  {
    ignores: ['dist/**'],
  },
  {
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
    },
  },
  pluginJs.configs.recommended,
]
