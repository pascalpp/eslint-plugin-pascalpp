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
// Tests
//------------------------------------------------------------------------------

const validNoProps = `
function Component() {
  // function body
}`;

const validShortProps = `
function Component({ one, two, three }) {
  // function body
}`;

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


const ruleTester = new RuleTester();
ruleTester.run('unwrap-function-props', rule, {
  valid: [
    { code: validNoProps },
    { code: validShortProps, parser },
    { code: validLongPropsWrapped, parser },
  ],

  invalid: [
    {
      code:   invalidShortPropsWrapped,
      output: invalidShortPropsWrappedOutput,
      errors: [
        {
          message: 'Declaration for MyShortComponent can fit on one line.',
          type,
        },
      ],
      parser,
    },
  ],
});
