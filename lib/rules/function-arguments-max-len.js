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

    function getWrappedDeclaration(context, node) {
      const params = node.params;

      const declarationStart = context.getSourceCode().getText({
        range: [node.range[0], params[0].range[0]],
      });
      const declarationEnd = context.getSourceCode().getText({
        range: [params[params.length - 1].range[1], node.body.range[0]],
      });

      // place props on separate lines
      const paramIndent = node.loc.start.column + indent;
      const paramLines = params.map((param) => {
        return ' '.repeat(paramIndent) + context.getSourceCode().getText(param);
      });

      const code = [
        `${declarationStart}`,
        paramLines.join(',\n'),
        `${' '.repeat(node.loc.start.column)}${declarationEnd}`,
      ].join('\n');

      return code;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      FunctionDeclaration(node) {
        const declaration = context.getSourceCode().getText({
          range: [node.range[0], node.body.range[0]],
        });

        // declaration is already multiple lines
        if (declaration.split('\n').length > 1)
          return;

        // calculate line length
        const firstLine = context.getSourceCode().getText(node).split('\n')[0];
        const lineLength = node.loc.start.column + firstLine.length;

        // declaration is already short enough
        if (lineLength <= maxLength)
          return;

        // create error report with fix
        const wrappedDeclaration = getWrappedDeclaration(context, node);
        context.report({
          node,
          loc: {
            start: node.loc.start,
            end:   node.body.loc.start,
          },
          message: `Declaration for ${node.id.name} has a length of ${lineLength}. Maximum allowed is ${maxLength}`,
          fix(fixer) {
            return fixer.replaceTextRange([node.range[0], node.body.range[0]], wrappedDeclaration);
          },
        });
      },
    };
  },
};
