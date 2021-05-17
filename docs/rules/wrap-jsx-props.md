# Wrap JSX elements with props that exceed a max length (wrap-jsx-props)

When writing JSX in React, elements with many props can exceed a desired maximum line length. This rule reformats such elements to put each prop on its own line.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

Examples of **incorrect** code for this rule:

```js
function Component() {
  return (
    <TestComponent foo={bar} baz="bing" bang={bong} boop={bop} trip="trap trop" zip={zap} zig={zag}/>
  )
}
```

```js
function Component() {
  return (
    <TestComponent {...{ foo, bar, baz, bing: bang, bong, boop, bop, trip, trap, trop, zip, zap, zig, zag }}/>
  )
}
```

Examples of **correct** code for this rule:

```js
function Component() {
  return (
    <TestComponent
      foo={bar}
      baz="bing"
      bang={bong}
      boop={bop}
      trip="trap trop"
      zip={zap}
      zig={zag}
    />
  )
}
```

```js
function Component() {
  return (
    <TestComponent {...{
      foo,
      bar,
      baz,
      bing: bang,
      bong,
      boop,
      bop,
      trip,
      trap,
      trop,
      zip,
      zap,
      zig,
      zag
    }}/>
  )
}
```

### Usage

```
plugins: [
  'wrap-props'
],
rules: {
  'wrap-props/wrap-jsx-props': ['error', {
    maxLength: 80 (default),
    indent: 2 (default)
  }]
}
```

## When Not To Use It

When you don't use JSX elements in React or you don't care about line lengths.
