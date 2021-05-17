const path = require('path');

const parser = path.join(__dirname, '../../../node_modules', '@babel/eslint-parser');
const type = 'JSXOpeningElement';

/**
 * @fileoverview ESLint rule to wrap function declarations that exceed a max length
 * @author Pascal Balthrop
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/unwrap-jsx-props');

//------------------------------------------------------------------------------
// Valid Tests
//------------------------------------------------------------------------------

const valid = [];

const validNoProps = `
function Component() {
  return (
    <TestComponent/>
  )
}`;
valid.push({ code: validNoProps, parser });

const validShortProps = `
function Component() {
  return (
    <TestComponent foo bar baz/>
  )
}`;
valid.push({ code: validShortProps, parser });

const validShortSpread = `
function Component() {
  return (
    <TestComponent {...{ foo, bar, baz }}/>
  )
}`;
valid.push({ code: validShortSpread, parser });

const validSimpleSpread = `
function Component() {
  return (
    <TestComponent {...props}/>
  )
}`;
valid.push({ code: validSimpleSpread, parser });

const validShorterMaxLength = `
function Component() {
  return (
    <TestComponent
      foo
      bar
      baz
      bang
      bong
    />
  )
}`;
const validShorterMaxLengthOptions = [{ maxLength: 40 }];
valid.push({ code: validShorterMaxLength, options: validShorterMaxLengthOptions, parser });

const validLongNameNoProps = `
function Component() {
  return (
    <TestComponentFooBarBazBingBangBongBoopBopTripTrapTropZipZapZigZag/>
  )
}`;
valid.push({ code: validLongNameNoProps, parser });

const validTooLongToUnwwap = `
function Component() {
  return (
    <TestComponent
      foo
      bar
      baz
      bing
      bang
      bong
      boop
      bop
      trip
      trap
      trop
      zip
      zap
      zig
      zag
    />
  )
}`;
valid.push({ code: validTooLongToUnwwap, parser });

const validCompoundName = `
function Component() {
  return (
    <Test.Component foo bar baz/>
  )
}`;
valid.push({ code: validCompoundName, parser });


//------------------------------------------------------------------------------
// Invalid Tests
//------------------------------------------------------------------------------

const invalid = [];

const invalidShortProps = `
function Component() {
  return (
    <TestComponent
      foo
      bar
      baz
    />
  )
}`;
const invalidShortPropsOutput = `
function Component() {
  return (
    <TestComponent foo bar baz/>
  )
}`;
invalid.push({
  code:   invalidShortProps,
  output: invalidShortPropsOutput,
  errors: [
    {
      message: 'Element TestComponent can fit on one line.',
      type,
    },
  ],
  parser,
});

const invalidShortSpread = `
function Component() {
  return (
    <TestComponent {...{
      foo,
      bar,
      baz
    }}/>
  )
}`;
const invalidShortSpreadOutput = `
function Component() {
  return (
    <TestComponent {...{ foo, bar, baz }}/>
  )
}`;
invalid.push({
  code:   invalidShortSpread,
  output: invalidShortSpreadOutput,
  errors: [
    {
      message: 'Element TestComponent can fit on one line.',
      type,
    },
  ],
  parser,
});

const invalidSimpleSpread = `
function Component() {
  return (
    <TestComponent
      {...props}
    />
  )
}`;
const invalidSimpleSpreadOutput = `
function Component() {
  return (
    <TestComponent {...props}/>
  )
}`;
invalid.push({
  code:   invalidSimpleSpread,
  output: invalidSimpleSpreadOutput,
  errors: [
    {
      message: 'Element TestComponent can fit on one line.',
      type,
    },
  ],
  parser,
});

const invalidCompoundName = `
function Component() {
  return (
    <Test.Component
      foo
      bar
      baz
    />
  )
}`;
const invalidCompoundNameOutput = `
function Component() {
  return (
    <Test.Component foo bar baz/>
  )
}`;
invalid.push({
  code:   invalidCompoundName,
  output: invalidCompoundNameOutput,
  errors: [
    {
      message: 'Element Test.Component can fit on one line.',
      type,
    },
  ],
  parser,
});


//------------------------------------------------------------------------------
// Run Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('unwrap-jsx-props', rule, { valid, invalid });
