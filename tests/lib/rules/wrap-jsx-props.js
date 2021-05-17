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
const rule = require('../../../lib/rules/wrap-jsx-props');

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

const validLargerMaxLength = `
function Component() {
  return (
    <TestComponent foo bar baz bing bang bong boop bop trip trap trop zip zap zig zag/>
  )
}`;
const validLargerMaxLengthOptions = [{ maxLength: 120 }];
valid.push({ code: validLargerMaxLength, options: validLargerMaxLengthOptions, parser });

const validLongNameNoProps = `
function Component() {
  return (
    <TestComponentFooBarBazBingBangBongBoopBopTripTrapTropZipZapZigZag/>
  )
}`;
valid.push({ code: validLongNameNoProps, parser });

const validAlreadyWrapped = `
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
valid.push({ code: validAlreadyWrapped, parser });

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

const invalidLongProps = `
function Component() {
  return (
    <TestComponent foo bar baz bing bang bong boop bop trip trap trop zip zap zig zag/>
  )
}`;
const invalidLongPropsOutput = `
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
invalid.push({
  code:   invalidLongProps,
  output: invalidLongPropsOutput,
  errors: [
    {
      message: 'Element TestComponent has a length of 87. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});

const invalidSingleLongSpread = `
function Component() {
  return (
    <TestComponent {...{ foo, bar, baz, bing: bang, bong, boop, bop, trip, trap, trop, zip, zap, zig, zag }}/>
  )
}`;
const invalidSingleLongSpreadOutput = `
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
}`;
invalid.push({
  code:   invalidSingleLongSpread,
  output: invalidSingleLongSpreadOutput,
  errors: [
    {
      message: 'Element TestComponent has a length of 110. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});

const invalidMultiplePropsWithShortSpread = `
function Component() {
  return (
    <TestComponent foo bar baz={bang} zig zag zip zap zop {...{ trip, trap, trop }}/>
  )
}`;
const invalidMultiplePropsWithShortSpreadOutput = `
function Component() {
  return (
    <TestComponent
      foo
      bar
      baz={bang}
      zig
      zag
      zip
      zap
      zop
      {...{ trip, trap, trop }}
    />
  )
}`;
invalid.push({
  code:   invalidMultiplePropsWithShortSpread,
  output: invalidMultiplePropsWithShortSpreadOutput,
  errors: [
    {
      message: 'Element TestComponent has a length of 85. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});

const invalidMultiplePropsWithLongSpread = `
function Component() {
  return (
    <TestComponent foo bar baz={bang} {...{ trip, trap, trop, zig, zag, zip, zap, zop, reallyLongPropNameThatIsTooLongComeOn }} extraProp/>
  )
}`;
const invalidMultiplePropsWithLongSpreadOutput = `
function Component() {
  return (
    <TestComponent
      foo
      bar
      baz={bang}
      {...{
        trip,
        trap,
        trop,
        zig,
        zag,
        zip,
        zap,
        zop,
        reallyLongPropNameThatIsTooLongComeOn
      }}
      extraProp
    />
  )
}`;
invalid.push({
  code:   invalidMultiplePropsWithLongSpread,
  output: invalidMultiplePropsWithLongSpreadOutput,
  errors: [
    {
      message: 'Element TestComponent has a length of 139. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});

const invalidCompoundName = `
function Component() {
  return (
    <Test.Component foo bar baz bing bang bong boop bop trip trap trop zip zap zig zag/>
  )
}`;
const invalidCompoundNameOutput = `
function Component() {
  return (
    <Test.Component
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
invalid.push({
  code:   invalidCompoundName,
  output: invalidCompoundNameOutput,
  errors: [
    {
      message: 'Element Test.Component has a length of 88. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});

const invalidKitchenSink = `
function Component() {
  return (
    <TestComponent {...{ foo, bar, baz, bing: bang, bong, boop, bop, trip, trap, trop, zip, zap, zig, zag }} {...props} external/>
  )
}`;
const invalidKitchenSinkOutput = `
function Component() {
  return (
    <TestComponent
      {...{
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
      }}
      {...props}
      external
    />
  )
}`;
invalid.push({
  code:   invalidKitchenSink,
  output: invalidKitchenSinkOutput,
  errors: [
    {
      message: 'Element TestComponent has a length of 130. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});



//------------------------------------------------------------------------------
// Run Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('wrap-jsx-props', rule, { valid, invalid });
