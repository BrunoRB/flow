%lex

%options case-insensitive flex
%%


INICIO          return 'INICIO'
FIM             return 'FIM'

\s[^\n]+             /*EMPTY*/

[0-9]+          return 'NUMERO'
[_a-zA-Z]+      return 'VARIAVEL'
VAR             return 'VAR'
\n+             return 'NOVA_LINHA'
$               return 'EOF'
TRUE            return 'TRUE'
FALSE           return 'FALSE'

IF              return 'SE'
ELSE            return 'SENAO'

ENQUANTO        return 'ENQUANTO'
FAÇA            return 'DO'

'('             return '('
')'             return ')'


'{'             return '{'
'}'             return '}'

'=='					return '=='
'!='					return '!='
'>'						return '>'
'<'						return '<'

'*'						return '*'
'-'						return '-'
'/'						return '/'
'%'						return '%'
'+'						return '+'

'='                     return '='

/lex

%{
    var SymbolTable = {
        symbols: {},

        addKey: function(key) {
            this.symbols[key] = true;
        },

        hasKey: function(key) {
            if (this.symbols.hasOwnProperty(key)) {
                return true;
            }
            return false;
        }
    };
%}


%left   '%' '*' '/'
%left   '-' '+'
%right '='

%left   '==' '!=' '>' '<' '<=' '>='

%start root
%%

root:
    INICIO NOVA_LINHA code FIM EOF
    | INICIO NOVA_LINHA FIM EOF
;   

code:
    code expression NOVA_LINHA
    | code booleanExpression NOVA_LINHALINHA
    | code conditionalStatement NOVA_LINHA
    | code loopStatement NOVA_LINHA
    | expression NOVA_LINHA
    | booleanExpression NOVA_LINHA
    | conditionalStatement NOVA_LINHA
    | loopStatement NOVA_LINHA
;

variableStatement:
    VAR VARIAVEL '=' expression
    | VAR VARIAVEL '=' booleanExpression
    | VARIAVEL '=' expression
    | VARIAVEL '=' booleanExpression
;

booleanExpression:
    booleanExpression '==' booleanExpression
    | booleanExpression '!=' booleanExpression
    | booleanExpression '>' booleanExpression
    | booleanExpression '<' booleanExpression
    | booleanExpression '>=' booleanExpression
    | booleanExpression '<=' booleanExpression
    | TRUE
    | FALSE
;

conditionalStatement:
    ifStatement elseStatement
    | ifStatement
;

loopStatement:
    whileStatement
    | doWhileStatement
;

whileStatement:
    'ENQUANTO' '(' booleanExpression ')' '{' NOVA_LINHA code '}'
;

doWhileStatement:
    'FAÇA' '{' NOVA_LINHA code '}' 'ENQUANTO' '(' booleanExpression ')'
;

ifStatement:
    'SE' '(' booleanExpression ')' '{' NOVA_LINHA code '}' NOVA_LINHA
;

elseStatement:
    'SENAO' '{' NOVA_LINHA code '}' NOVA_LINHA
;

expression:
    expression '+' expression
    | expression '*' expression
    | expression '/' expression
    | expression '-' expression
    | expression '%' expression
    | VARIAVEL
    | NUMERO
;