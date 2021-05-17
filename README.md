# eslint-plugin-pascalpp

ESLint rule to wrap function declarations that exceed a max length

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-pascalpp`:

```
$ npm install eslint-plugin-pascalpp --save-dev
```

## Usage

Add `pascalpp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "pascalpp"
  ]
}
```


Then configure the rule under the rules section.

```
{
  "rules": {
    'pascalpp/function-props-max-len': ['error', {
      maxLength: <integer> (default: 80),
      indent:    <integer> (default: 2)
    }]
  }
}
```
