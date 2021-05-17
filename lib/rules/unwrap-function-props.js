/**
 * @fileoverview Unwraps function declarations if they can fit on one line
 * @author Pascal Balthrop
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Unwraps function declarations if they can fit on one line",
      category:    "layout",
      recommended: false,
    },
    fixable: 'whitespace',  // or "code" or "whitespace"
    schema:  [{
      type:       'object',
      properties: {
        maxLength: {
          type: 'integer',
        },
        indent: {
          type: 'integer',
        },
      },
    }],
  },

  create(context) {
    // variables should be defined here
    const configuration = context.options[0] || {};
    const maxLength = configuration.maxLength || 80;
    // const indent = configuration.indent || 2;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function isSinglePropsArgument(params) {
      return params.length === 1 && params[0].type === 'ObjectPattern';
    }

    function getOneLineDeclaration(node) {
      const props = node.params[0];

      const declarationStart = context.getSourceCode().getText({
        range: [ node.range[0], props.range[0] ],
      });
      const declarationEnd = context.getSourceCode().getText({
        range: [ props.range[1], node.body.range[0] ],
      });
      const propStrings = props.properties.map((prop) => {
        return context.getSourceCode().getText(prop);
      });

      const code = [
        `${declarationStart}{`,
        propStrings.join(', '),
        `}${declarationEnd}`,
      ].join(' ');

      return code;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      FunctionDeclaration(node) {
        // declaration does not receive a single props object like { one, two, three }
        if (!isSinglePropsArgument(node.params))
          return;

        const declaration = context.getSourceCode().getText({
          range: [ node.range[0], node.body.range[0] ],
        });

        // declaration is already one line
        if (declaration.split('\n').length <= 1)
          return;

        const oneLineIndent = ' '.repeat(node.loc.start.column);
        const oneLineDeclaration = getOneLineDeclaration(node);
        const oneLine = `${oneLineIndent}${oneLineDeclaration}{`;

        // won't fit on one line
        if (oneLine.length > maxLength)
          return;

        // create error report with fix
        context.report({
          node,
          loc: {
            start: node.loc.start,
            end:   node.body.loc.start,
          },
          message: `Declaration for ${node.id.name} can fit on one line.`,
          fix(fixer) {
            return fixer.replaceTextRange([ node.range[0], node.body.range[0] ], oneLineDeclaration);
          },
        });
      },
    };
  },
};
