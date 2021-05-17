# Wrap function declarations with destructured props that exceed a max length (wrap-function-arguments)

Function declarations with lots of arguments can exceed a desired maximum line length. This rule reformats such function declarations to put each argument on its own line.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```js
function MyManyArguments(one, two, three, four, five, six, seven, eight, nine, ten) {
  // function body here
}`;
```

Examples of **correct** code for this rule:

```js
function MyManyArguments(
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten
) {
  // function body here
}`;
```

### Usage

```
plugins: [
  'wrap-props'
],
rules: {
  'wrap-props/wrap-function-arguments': ['error', {
    maxLength: 80 (default),
    indent: 2 (default)
  }]
}
```

## When Not To Use It

When you don't use functions with lots of arguments (good job) or you don't care about line lengths.
