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
    function isSingleSpreadProp(props) {
      return props.length === 1 && props[0].type === 'JSXSpreadAttribute';
    }

    function getWrappedElement(node) {
      if (isSingleSpreadProp(node.attributes))
        return getWrappedSingleSpreadElement(node);
      else
        return getWrappedMultiplePropsElement(node);
    }

    function getWrappedMultiplePropsElement(node) {
      const props = node.attributes;

      const declarationStart = context.getSourceCode().getText({
        range: [ node.range[0], props[0].range[0] ],
      }).trim();
      const declarationEnd = context.getSourceCode().getText({
        range: [ props[props.length - 1].range[1], node.range[1] ],
      });

      // place props on separate lines
      const propIndent = node.loc.start.column + indent;
      const propLines = props.map((prop) => {
        if (prop.type === 'JSXSpreadAttribute')
          return wrapJSXSpreadAttribute(prop, propIndent);
        else
          return ' '.repeat(propIndent) + context.getSourceCode().getText(prop);
      });

      const code = [
        `${declarationStart}`,
        propLines.join('\n'),
        `${' '.repeat(node.loc.start.column)}${declarationEnd}`,
      ].join('\n');

      return code;
    }

    function wrapJSXSpreadAttribute(prop, propIndent) {
      const isOneLine = prop.loc.start.line === prop.loc.end.line;
      const isMultipleLines = !isOneLine;
      const lineLength = prop.loc.end.column - prop.loc.start.column;
      const isShortLine = isOneLine && lineLength <= maxLength;

      if (isShortLine || isMultipleLines)
        return ' '.repeat(propIndent) + context.getSourceCode().getText(prop);

      const childIndent = propIndent + indent;
      const spread = prop.argument;

      const declarationStart = context.getSourceCode().getText({
        range: [ prop.range[0], spread.range[0] ],
      }).trim();
      const declarationEnd = context.getSourceCode().getText({
        range: [ spread.range[1], prop.range[1] ],
      });

      const propLines = spread.properties.map((childProp) => {
        return ' '.repeat(childIndent) + context.getSourceCode().getText(childProp);
      });

      const code = [
        `${' '.repeat(propIndent)}${declarationStart}{`,
        propLines.join(',\n'),
        `${' '.repeat(propIndent)}}${declarationEnd}`,
      ].join('\n');

      return code;
    }

    function getWrappedSingleSpreadElement(node) {
      const spread = node.attributes[0].argument;

      const declarationStart = context.getSourceCode().getText({
        range: [ node.range[0], spread.range[0] ],
      }).trim();
      const declarationEnd = context.getSourceCode().getText({
        range: [ spread.range[1], node.range[1] ],
      });

      // place props on separate lines
      const propIndent = node.loc.start.column + indent;
      const propLines = spread.properties.map((prop) => {
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
      JSXOpeningElement(node) {
        const name = node.name.name;

        if (node.attributes.length === 0)
          return debug(`Element "${name}" does not have any props`);

        const isOneLine = node.loc.start.line === node.loc.end.line;

        if (!isOneLine)
          return debug(`Element "${name}" is already wrapped`);

        // calculate line length
        const firstLine = context.getSourceCode().getText(node).split('\n')[0];
        const lineLength = node.loc.start.column + firstLine.length;

        if (lineLength <= maxLength)
          return debug(`Element "${name}" length is ${lineLength}. Does not exceed max length ${maxLength}`);

        // create error report with fix
        const wrappedDeclaration = getWrappedElement(node);
        context.report({
          node,
          message: `Element ${name} has a length of ${lineLength}. Maximum allowed is ${maxLength}`,
          fix(fixer) {
            return fixer.replaceTextRange([ node.range[0], node.range[1] ], wrappedDeclaration);
          },
        });
      },
    };
  },
};

// DEBUG=true mocha
function debug(msg) {
  if (process.env.DEBUG)
    console.log(msg);
}
