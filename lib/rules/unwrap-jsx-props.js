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

    function isObjectPatternSpread(prop) {
      return (
        prop.type === 'JSXSpreadAttribute'
        && prop.argument
        && prop.argument.type === 'ObjectExpression'
      );
    }

    function getOneLineDeclaration(node) {
      const props = node.attributes;

      const declarationStart = context.getSourceCode().getText({
        range: [ node.range[0], props[0].range[0] ],
      }).replace(/\s+$/, '');

      const declarationEnd = context.getSourceCode().getText({
        range: [ props[props.length - 1].range[1], node.range[1] ],
      }).replace(/^[\s,]+/, '');

      const propStrings = props.map((prop) => {
        if (isObjectPatternSpread(prop))
          return unwrapJSXSpreadAttribute(prop).trim();
        else
          return context.getSourceCode().getText(prop).trim();
      }).join(' ');

      const code = `${declarationStart} ${propStrings}${declarationEnd}`;

      return code;
    }

    function unwrapJSXSpreadAttribute(prop) {
      const spread = prop.argument;

      const declarationStart = context.getSourceCode().getText({
        range: [ prop.range[0], spread.range[0] ],
      }).trim();
      const declarationEnd = context.getSourceCode().getText({
        range: [ spread.range[1], prop.range[1] ],
      });

      const propLines = spread.properties.map((childProp) => {
        return context.getSourceCode().getText(childProp);
      });

      const code = [
        `${declarationStart}{`,
        propLines.join(', '),
        `}${declarationEnd}`,
      ].join(' ');

      return code;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      JSXOpeningElement(node) {
        const name = node.name.name;

        if (node.attributes.length === 0)
          return debug(`Element "${name}" does not have any props`);

        const isOneLine = node.loc.start.line === node.loc.end.line;

        if (isOneLine)
          return debug(`Element "${name}" is already unwrapped`);

        // calculate line length
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
            end:   node.loc.end,
          },
          message: `Element ${name} can fit on one line.`,
          fix(fixer) {
            return fixer.replaceTextRange([ node.range[0], node.range[1] ], oneLineDeclaration);
          },
        });
      },
    };
  },
};

// DEBUG=true mocha
function debug(msg) {
  if (process.env.DEBUG === 'unwrap-jsx-props')
    console.log(msg);
}
