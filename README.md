# eslint-plugin-wrap-props

A set of ESLint rules to wrap functions or JSX elements that exceed a desired line length, and companion rules to unwrap functions or JSX elements which can fit on one line.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-wrap-props`:

```
$ npm install eslint-plugin-wrap-props --save-dev
```

## Usage

Add `wrap-props` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "wrap-props"
  ]
}
```


Then configure the rules under the rules section.

```
{
  "rules": {
    'wrap-props/wrap-function-props':       ['error'],
    'wrap-props/wrap-function-arguments':   ['error']
    'wrap-props/wrap-jsx-props':            ['error']
    'wrap-props/unwrap-function-props':     ['error']
    'wrap-props/unwrap-function-arguments': ['error']
    'wrap-props/unwrap-jsx-props':          ['error']
  }
}
```

## Options

- `maxLength` : (integer, default: 80)

Determine how long a line must be before wrapping is applied. For `unwrap` rules, this is used to determine which lines are short enough to be safely unwrapped.

- `indent` : (integer, default: 2)

Used to indent props or arguments when wrapping. Not applicable for `unwrap` rules.

## More information

- [wrap-props/wrap-function-props](docs/rules/wrap-function-props.md) -
Wrap function declarations with destructured props
- [wrap-props/unwrap-function-props](docs/rules/unwrap-function-props.md) - Companion to `wrap-function-props`

- [wrap-props/wrap-function-arguments](docs/rules/wrap-function-arguments.md) - Wrap function declarations with conventional arguments

- [wrap-props/unwrap-function-arguments](docs/rules/unwrap-function-arguments.md) - Companion to `wrap-function-arguments`

- [wrap-props/wrap-jsx-props](docs/rules/wrap-jsx-props.md) - Wrap function declarations with destructured props

- [wrap-props/unwrap-jsx-props](docs/rules/unwrap-jsx-props.md) - Companion to `wrap-jsx-props`
