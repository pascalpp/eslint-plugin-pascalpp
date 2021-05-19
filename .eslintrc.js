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
    'comma-dangle':            [ 'error', 'always-multiline' ],
    'comma-spacing':           [ 'error', { before: false, after: true }],
    'indent':                  [ 'error', 2, { ignoredNodes: [ 'TemplateLiteral' ], SwitchCase: 1 }],
    'key-spacing':             [ 'error', { beforeColon: false, afterColon: true, mode: 'strict', align: 'value' }],
    'no-console':              [ 'error', { allow: [ 'warn', 'error' ] }],
    'no-shadow':               [ 'error' ],
    'object-curly-newline':    [ 'error', { multiline: true, consistent: true }],
    'object-curly-spacing':    [ 'error', 'always' ],
    'object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true }],
    'object-shorthand':        [ 'error', 'always' ],
    'semi':                    [ 'error', 'always' ],
    'space-in-parens':         [ 'error', 'never' ],
  },
};
