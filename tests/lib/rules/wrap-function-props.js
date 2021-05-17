const path = require('path');

const parser = path.join(__dirname, '../../../node_modules', '@babel/eslint-parser');
const type = 'FunctionDeclaration';

/**
 * @fileoverview ESLint rule to wrap function declarations that exceed a max length
 * @author Pascal Balthrop
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/wrap-function-props');

//------------------------------------------------------------------------------
// Valid Tests
//------------------------------------------------------------------------------

const valid = [];

const validNoProps = `
function Component() {
  // function body
}`;
valid.push({ code: validNoProps });

const validShortProps = `
function Component({ one, two, three }) {
  // function body
}`;
valid.push({ code: validShortProps, parser });

const validLargerMaxLength = `
function MyLongComponent({ one, two, three, four, five, six, seven, eight, nine, ten }) {
  // props should not be wrapped on to separate lines because maxLength is larger
}`;
const validLargerMaxLengthOptions = [{ maxLength: 120 }];
valid.push({ code: validLargerMaxLength, options: validLargerMaxLengthOptions, parser });



//------------------------------------------------------------------------------
// Invalid Tests
//------------------------------------------------------------------------------

const invalid = [];

const invalidLongProps = `
function MyLongComponent({ one, two, three, four, five, six, seven, eight, nine, ten }) {
  // props should be wrapped on to separate lines
}`;
const invalidLongPropsOutput = `
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
  // props should be wrapped on to separate lines
}`;
invalid.push({
  code:   invalidLongProps,
  output: invalidLongPropsOutput,
  errors: [
    {
      message: 'Declaration for MyLongComponent has a length of 89. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});


const invalidLongPropsNested = `
function MyComponent() {
  // ensure that nested components match original indentation
  function MyNestedLongComponent({ one, two, three, four, five, six, seven, eight, nine, ten }) {
    // function body
  }
}`;
const invalidLongPropsNestedOutput = `
function MyComponent() {
  // ensure that nested components match original indentation
  function MyNestedLongComponent({
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
    // function body
  }
}`;
invalid.push({
  code:   invalidLongPropsNested,
  output: invalidLongPropsNestedOutput,
  errors: [
    {
      message: 'Declaration for MyNestedLongComponent has a length of 97. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});


const invalidShortPropsNested = `
function MyComponent() {
  // component is short enough on its own
  // but indentation puts it over the limit
  function MyNestedShortComponent({ one, two, three, four, five, six, longer }) {
    // function body
  }
}`;
const invalidShortPropsNestedOutput = `
function MyComponent() {
  // component is short enough on its own
  // but indentation puts it over the limit
  function MyNestedShortComponent({
    one,
    two,
    three,
    four,
    five,
    six,
    longer
  }) {
    // function body
  }
}`;
invalid.push({
  code:   invalidShortPropsNested,
  output: invalidShortPropsNestedOutput,
  errors: [
    {
      message: 'Declaration for MyNestedShortComponent has a length of 81. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});


const invalidLowerMaxLength = `
function MyShortComponent({ one, two, three }) {
  // props should be wrapped on to separate lines
}`;
const invalidLowerMaxLengthOptions = [{ maxLength: 40 }];
const invalidLowerMaxLengthOutput = `
function MyShortComponent({
  one,
  two,
  three
}) {
  // props should be wrapped on to separate lines
}`;
invalid.push({
  code:    invalidLowerMaxLength,
  options: invalidLowerMaxLengthOptions,
  output:  invalidLowerMaxLengthOutput,
  errors:  [
    {
      message: 'Declaration for MyShortComponent has a length of 48. Maximum allowed is 40',
      type,
    },
  ],
  parser,
});


const invalidLargerIndent = `
function MyLongComponent({ one, two, three, four, five, six, seven, eight, nine, ten }) {
    // props should be wrapped on to separate lines
}`;
const invalidLargerIndentOptions = [{ indent: 4 }];
const invalidLargerIndentOutput = `
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
    // props should be wrapped on to separate lines
}`;
invalid.push({
  code:    invalidLargerIndent,
  options: invalidLargerIndentOptions,
  output:  invalidLargerIndentOutput,
  errors:  [
    {
      message: 'Declaration for MyLongComponent has a length of 89. Maximum allowed is 80',
      type,
    },
  ],
  parser,
});


//------------------------------------------------------------------------------
// Run Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('wrap-function-props', rule, { valid, invalid });
