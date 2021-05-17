# Unwrap function declarations with arguments that are short enough to fit on one line (unwrap-function-arguments)

Companion to `wrap-function-arguments` which unwraps functions which can fit on one line.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```js
function MyFewArguments(
  one,
  two,
  three
) {
  // function body here
}
```

Examples of **correct** code for this rule:

```js
function MyFewArguments(one, two, three) {
  // function body here
}
```

### Usage

```
plugins: [
  'wrap-props'
],
rules: {
  'wrap-props/unwrap-function-props': ['error', {
    maxLength: 80 (default)
  }]
}
```

## When Not To Use It

When you don't use `wrap-function-arguments` or you don't care about line lengths.
