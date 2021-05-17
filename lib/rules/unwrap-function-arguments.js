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
      },
    }],
  },

  create(context) {
    // variables should be defined here
    const configuration = context.options[0] || {};
    const maxLength = configuration.maxLength || 80;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getOneLineDeclaration(node) {
      const params = node.params;

      const declarationStart = context.getSourceCode().getText({
        range: [ node.range[0], params[0].range[0] ],
      }).replace(/\s+$/, '');
      const declarationEnd = context.getSourceCode().getText({
        range: [ params[params.length - 1].range[1], node.body.range[0] ],
      }).replace(/^[\s,]+/, '');
      const propStrings = params.map((param) => {
        return context.getSourceCode().getText(param);
      });

      const code = [
        `${declarationStart}`,
        propStrings.join(', '),
        `${declarationEnd}`,
      ].join('');

      return code;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      FunctionDeclaration(node) {
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
