/**
 * @fileoverview ESLint rule to wrap function declarations that exceed a max length
 * @author
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'ESLint rule to wrap function declarations that exceed max length',
      category:    'layout',
      recommended: false,
    },
    fixable: 'whitespace', // or "code" or "whitespace"
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
    const indent = configuration.indent || 2;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function isSinglePropsArgument(params) {
      return params.length === 1 && params[0].type === 'ObjectPattern';
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
          range: [node.range[0], node.body.range[0]],
        });

        // declaration is already multiple lines
        if (declaration.split('\n').length > 1)
          return;

        const firstLine = context.getSourceCode().getText(node).split('\n')[0];
        const lineLength = node.loc.start.column + firstLine.length;
        if (lineLength <= maxLength)
          return;

        // build fixed output
        const props = node.params[0];

        const declarationStart = context.getSourceCode().getText({
          range: [node.range[0], props.range[0]],
        });
        const declarationEnd = context.getSourceCode().getText({
          range: [props.range[1], node.body.range[0]],
        });

        // place props on separate lines
        const propIndent = node.loc.start.column + indent;
        const propLines = props.properties.map((prop) => {
          return ' '.repeat(propIndent) + context.getSourceCode().getText(prop);
        });

        const code = [
          `${declarationStart}{`,
          propLines.join(',\n'),
          `${' '.repeat(node.loc.start.column)}}${declarationEnd}`,
        ];

        context.report({
          node,
          message: `Declaration for ${node.id.name} has a length of ${lineLength}. Maximum allowed is ${maxLength}`,
          fix(fixer) {
            return fixer.replaceTextRange([node.range[0], node.body.range[0]], code.join('\n'));
          },
        });
      },
    };
  },
};
