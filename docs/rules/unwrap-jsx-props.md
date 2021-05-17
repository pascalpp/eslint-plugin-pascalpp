# Unwrap function declarations with destructured props that are short enough to fit on one line (unwrap-jsx-props)

Companion to `wrap-jsx-props` which unwraps elements which can fit on one line.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```js
function Component() {
  return (
    <TestComponent
      foo={bar}
      baz="bing"
    />
  )
}
```

```js
function Component() {
  return (
    <TestComponent {...{
      foo,
      bar
    }}/>
  )
}
```

Examples of **correct** code for this rule:

```js
function Component() {
  return (
    <TestComponent foo={bar} baz="bing"/>
  )
}
```

```js
function Component() {
  return (
    <TestComponent {...{ foo, bar }}/>
  )
}
```

### Usage

```
plugins: [
  'wrap-props'
],
rules: {
  'wrap-props/unwrap-jsx-props': ['error', {
    maxLength: 80 (default)
  }]
}
```

## When Not To Use It

When you don't use JSX elements in React or you don't care about line lengths.
