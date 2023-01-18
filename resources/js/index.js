var Parser = require("jison").Parser;

var expression = {
  lex: {
    rules: [["([+-]?[0-9]+|[+-]?((?R)))([-+*/]([0-9]+|((?R))))*"]],
  },
};

var parser = new Parser(expression);
parser.parse("(2*3)/2");
