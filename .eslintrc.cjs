module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'object-curly-spacing': [2, 'always'],
    'prettier/prettier': ['error', { singleQuote: false }],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
  },
};
