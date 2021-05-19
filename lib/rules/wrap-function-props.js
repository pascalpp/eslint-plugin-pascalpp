const debug = require('../debug')(__filename);

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

    function getWrappedDeclaration(node) {
      const props = node.params[0];

      const declarationStart = context.getSourceCode().getText({
        range: [ node.range[0], props.range[0] ],
      });
      const declarationEnd = context.getSourceCode().getText({
        range: [ props.range[1], node.body.range[0] ],
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
      ].join('\n');

      return code;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      FunctionDeclaration(node) {
        if (!isSinglePropsArgument(node.params))
          return debug('declaration does not receive a single props object like { one, two, three }');

        const declaration = context.getSourceCode().getText({
          range: [ node.range[0], node.body.range[0] ],
        });

        // declaration is already multiple lines
        if (declaration.split('\n').length > 1)
          return debug('declaration is already multiple lines');

        // calculate line length
        const firstLine = context.getSourceCode().getText(node).split('\n')[0];
        const lineLength = node.loc.start.column + firstLine.length;

        if (lineLength <= maxLength)
          return debug('declaration is already short enough');

        // create error report with fix
        const wrappedDeclaration = getWrappedDeclaration(node);
        context.report({
          node,
          loc: {
            start: node.loc.start,
            end:   node.body.loc.start,
          },
          message: `Declaration for ${node.id.name} has a length of ${lineLength}. Maximum allowed is ${maxLength}`,
          fix(fixer) {
            return fixer.replaceTextRange([ node.range[0], node.body.range[0] ], wrappedDeclaration);
          },
        });
      },
    };
  },
};
