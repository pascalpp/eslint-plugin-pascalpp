# Wrap function declarations with destructured props that exceed a max length (wrap-function-props)

When defining React components with a destructured props object as the sole argument, adding props can exceed a desired maximum line length. This rule reformats such function declarations to put each prop on its own line.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```js
function MyLongComponent({ one, two, three, four, five, six, seven, eight, nine, ten }) {
  // function body here
}
```

Examples of **correct** code for this rule:

```js
function MyLongComponent({
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
}) {
  // function body here
}
```

### Usage

```
plugins: [
  'wrap-props'
],
rules: {
  'wrap-props/wrap-function-props': ['error', {
    maxLength: 80 (default),
    indent: 2 (default)
  }]
}
```

## When Not To Use It

When you don't use destructured props arguments or you don't care about line lengths.
