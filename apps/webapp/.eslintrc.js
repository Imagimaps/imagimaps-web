module.exports = {
  root: true,
  extends: ['@modern-js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    'max-len': ['error', { code: 120 }],
  },
};
