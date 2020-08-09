module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  rules: {
    'no-underscore-dangle': [0],
    'no-return-assign': [0],
    'react/no-find-dom-node': [0],
  },
};
