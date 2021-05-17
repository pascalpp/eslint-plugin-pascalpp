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
const rule = require('../../../lib/rules/unwrap-function-arguments');

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
function Component(one, two, three) {
  // function body
}`;
valid.push({ code: validShortProps, parser });

const validLongPropsWrapped = `
function MyLongComponent(
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
  // function body
}`;
valid.push({ code: validLongPropsWrapped, parser });

const validAlmostWouldFit = `
function MyShortComponent(
  one,
  two,
  three
) {
  // props could almost fit one on line
}`;
const validAlmostWouldFitOptions = [{ maxLength: 43 }];
valid.push({ code: validAlmostWouldFit, options: validAlmostWouldFitOptions, parser });


//------------------------------------------------------------------------------
// Invalid Tests
//------------------------------------------------------------------------------

const invalid = [];

const invalidShortPropsWrapped = `
function MyShortComponent(
  one,
  two,
  three
) {
  // props could fit one on line
}`;
const invalidShortPropsWrappedOutput = `
function MyShortComponent(one, two, three) {
  // props could fit one on line
}`;
invalid.push({
  code:   invalidShortPropsWrapped,
  output: invalidShortPropsWrappedOutput,
  errors: [
    {
      message: 'Declaration for MyShortComponent can fit on one line.',
      type,
    },
  ],
  parser,
});


const invalidShortNested = `
function MyComponent() {
  function MyNestedComponent(
    one,
    two,
    three
  ) {
    // props could fit one on line
  }
}`;
const invalidShortNestedOutput = `
function MyComponent() {
  function MyNestedComponent(one, two, three) {
    // props could fit one on line
  }
}`;
invalid.push({
  code:   invalidShortNested,
  output: invalidShortNestedOutput,
  errors: [
    {
      message: 'Declaration for MyNestedComponent can fit on one line.',
      type,
    },
  ],
  parser,
});


const invalidClosingParenOnNewLine = `
function shortCall(one, two, three,
  ) {
  // paren should be moved up to first line
}`;
const invalidClosingParenOnNewLineOutput = `
function shortCall(one, two, three) {
  // paren should be moved up to first line
}`;
invalid.push({
  code:   invalidClosingParenOnNewLine,
  output: invalidClosingParenOnNewLineOutput,
  errors: [
    {
      message: 'Declaration for shortCall can fit on one line.',
      type,
    },
  ],
  parser,
});


//------------------------------------------------------------------------------
// Run Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('unwrap-function-arguments', rule, { valid, invalid });
