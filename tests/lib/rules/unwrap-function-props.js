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
const rule = require('../../../lib/rules/unwrap-function-props');

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

const validLongPropsWrapped = `
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
  // function body
}`;
valid.push({ code: validLongPropsWrapped, parser });

const validAlmostWouldFit = `
function MyShortComponent({
  one,
  two
}) {
  // props could almost fit one on line
}`;
const validAlmostWouldFitOptions = [{ maxLength: 40 }];
valid.push({ code: validAlmostWouldFit, options: validAlmostWouldFitOptions, parser });

const validWithInlineComments = `
function loadNextPage({
  // comment1
  param1,
  // comment2,
  param2
}) {
  // function body
}`;
valid.push({ code: validWithInlineComments, parser });

//------------------------------------------------------------------------------
// Invalid Tests
//------------------------------------------------------------------------------

const invalid = [];

const invalidShortPropsWrapped = `
function MyShortComponent({
  one,
  two,
  three
}) {
  // props could fit one on line
}`;
const invalidShortPropsWrappedOutput = `
function MyShortComponent({ one, two, three }) {
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


//------------------------------------------------------------------------------
// Run Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('unwrap-function-props', rule, { valid, invalid });
