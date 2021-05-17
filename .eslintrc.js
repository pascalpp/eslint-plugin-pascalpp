module.exports = {
  env: {
    browser:  true,
    commonjs: true,
    es2021:   true,
    node:     true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser:        '@babel/eslint-parser',
  parserOptions: {
    sourceType:                  'module',
    allowImportExportEverywhere: false,
    ecmaVersion:                 12,
  },
  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'indent':       [ 'error', 2, { ignoredNodes: [ 'TemplateLiteral' ], SwitchCase: 1 }],
    'semi':         [ 'error', 'always' ],
    'key-spacing':  [ 'error', { beforeColon: false, afterColon: true, mode: 'strict', align: 'value' }],
  },
};
