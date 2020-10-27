module.exports = {
  root: true,
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 0,
    'no-await-in-loop': 0,
    'no-underscore-dangle': ["error", { "allowAfterThis": true }],
    'arrow-parens': ["error", "as-needed"],
    'max-len': ['error', { 'code': 80, 'ignoreComments': true}],
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
  },
};
