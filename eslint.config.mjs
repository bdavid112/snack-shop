import eslintPluginPrettier from 'eslint-plugin-prettier'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default await tseslint.config({
  files: ['**/*.{ts,tsx}'],
  ignores: ['node_modules', 'dist', 'build'],

  languageOptions: {
    parserOptions: {
      project: ['./client/tsconfig.json', './server/tsconfig.json'],
      tsconfigRootDir: new URL('.', import.meta.url).pathname,
    },
  },

  plugins: {
    prettier: eslintPluginPrettier,
  },

  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      rules: {
        'prettier/prettier': 'warn',
      },
    },
  ],
})
