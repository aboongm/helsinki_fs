import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  {
    ignores: ['dist/**'],
  },
  {
    rules: {
      indent: ['error', 2], 
      'linebreak-style': ['error', 'unix'], 
      quotes: ['error', 'single'], 
      semi: ['error', 'never'], 
    },
  },
  pluginJs.configs.recommended,
]
