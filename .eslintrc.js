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
    'array-bracket-spacing':   [ 'error', 'always', { objectsInArrays: false }],
    'no-shadow':               [ 'error' ],
    'comma-dangle':            [ 'error', 'always-multiline' ],
    'indent':                  [ 'error', 2, { ignoredNodes: [ 'TemplateLiteral' ], SwitchCase: 1 }],
    'semi':                    [ 'error', 'always' ],
    'key-spacing':             [ 'error', { beforeColon: false, afterColon: true, mode: 'strict', align: 'value' }],
    'space-in-parens':         [ 'error', 'never' ],
    'object-curly-newline':    [ 'error', { multiline: true, consistent: true }],
    'object-curly-spacing':    [ 'error', 'always' ],
    'object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true }],
    'object-shorthand':        [ 'error', 'always' ],
  },
};
