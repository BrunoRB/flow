"use strict";

Flow.Nodes = {

    varTable: {},

    factory: function($node) {
        var nodeName = $node.attr("data-flow-name");
        switch (nodeName) {
            case flow.Constants.PROCESS:
                return new Process($node);
                break;
            case flow.Constants.DISPLAY:
                return new Display($node);
                break;
            case flow.Constants.MANUAL_INPUT:
                return new ManualInput($node);
                break;
            case flow.Constants.DECISION:
                return new Decision($node);
                break;
            default:
                return new Node($node);
                break;
        }
    },

    cleanVarTable: function() {
        this.varTable = {};
    }
};

var Node = function($selector) {
    this.$selector = $selector;

    this.execute = function() {
        this.validate();

        return this.getNextNodeSelector$();
    };

    this.getParsedContent = function() {

    };

    this.getNextNodeSelector$ = function() {
        var connections = jsPlumb.getConnections({source: this.$selector});
        return (connections.length > 0) ? $(connections[0].target) : null;
    };

    this.validate = function() {
        var connections = jsPlumb.getConnections({source: this.$selector});
        if (connections.length < 1 && this.$selector.attr("data-max-outputs") !== "0") {
            flow.UI.markFailure("É necessário existir um <b>fluxo de saída</b> ", this.$selector);
        }
    };

};

Node.prototype = {
    getContent: function() {
        return this.$selector.find("code").text();
    }
};

// PROCESS
var Process = function($selector) {
    Node.call(this, $selector);

    this.execute = function() {
        this.validate();

        try {
            eval(this.getParsedContent());
        }
        catch (e) {
            flow.Utilities.showDebug(e);
            flow.UI.markFailure("Erro de sintaxe", this.$selector);
        }

        return this.getNextNodeSelector$();
    };

    this.getParsedContent = function() {
        var parsedContent = this.getContent().replace("<-", "=").split(/("[^"]*")/);

        for (var i = 0, length = parsedContent.length; i < length; i++) {
            if (!(/^"[^"]*"$/.test(parsedContent[i]))) {
                parsedContent[i] = parsedContent[i].replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)/g, " flow.Nodes.varTable.$1 ");
            }
            else if (parsedContent[i] === "") {
                delete parsedContent[i];
            }
        }
        return parsedContent.join(" ");
    };
};
Process.prototype = Object.create(Node.prototype);

// DISPLAY
var Display = function($selector) {
    Node.call(this, $selector);

    this.execute = function() {
        this.validate();

        var parsedContent = this.getParsedContent();

        var expression = "<span style='color: teal;'>" + getExpression(parsedContent) + " -> </span>";

        var evaluatedValue = getEvaluatedValue(parsedContent);

        flow.UI.appendContentToConsole(expression + evaluatedValue);

        return this.getNextNodeSelector$();
    };

    var getExpression = function(content) {
        return content.replace(/flow\.Nodes\.varTable\./g, "");
    };

    var getEvaluatedValue = function(content) {
        try {
            var result = eval(content);
        }
        catch (e) {
            flow.Utilities.showDebug(e);
            flow.UI.markFailure("Erro de sintaxe", this.$selector);
        }

        if (
            !Array.isArray(result) && (result === undefined || result === null ||
            (typeof result !== "string" && isNaN(result)))
        ) {
            result = "nulo";
        }

        return result;
    };

    this.getParsedContent = function() {
        var parsedContent = this.getContent().split(/("[^"]*")/);
        for (var i = 0, length = parsedContent.length; i < length; i++) {
            if (!(/^"[^"]*"$/.test(parsedContent[i]))) {
                parsedContent[i] = parsedContent[i].replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)/g, " flow.Nodes.varTable.$1 ");
            }
            else if (parsedContent[i] === "") {
                delete parsedContent[i];
            }
        }
        return parsedContent.join(" ");
    };
};
Display.prototype = Object.create(Node.prototype);

// MANUAL_INPUT
var ManualInput = function($selector) {
    Node.call(this, $selector);

    this.execute = function() {
        this.validate();

        try {
            eval(this.getParsedContent());

            var varName = this.getContent();
            if ($.isNumeric(flow.Nodes.varTable[varName])) {
                flow.Nodes.varTable[varName] = parseFloat(flow.Nodes.varTable[varName]);
            }
        }
        catch (e) {
            flow.Utilities.showDebug(e);
            flow.UI.markFailure("Erro de sintaxe", this.$selector);
        }

        return this.getNextNodeSelector$();
    };

    this.getParsedContent = function() {
        return this.getContent().
            replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)/, " flow.Nodes.varTable.$1 = prompt('Insira o valor de $1');");
    };
};
ManualInput.prototype = Object.create(Node.prototype);

// DECISION
var Decision = function($selector) {
    Node.call(this, $selector);

    this.execute = function() {
        this.validate();

        try {
            var expressionIsTrue = eval(this.getParsedContent());
        }
        catch (e) {
            flow.Utilities.showDebug(e);
            flow.UI.markFailure("Erro de sintaxe", this.$selector);
        }

        return this.getNextNodeSelector$(expressionIsTrue);
    };

    this.getParsedContent = function() {
        var parsedContent = this.getContent().split(/("[^"]*")/);
        for (var i = 0, length = parsedContent.length; i < length; i++) {
            if (!(/^"[^"]*"$/.test(parsedContent[i]))) {
                parsedContent[i] = parsedContent[i].replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)/g, " flow.Nodes.varTable.$1 ");
            }
            else if (parsedContent[i] === "") {
                delete parsedContent[i];
            }
        }
        return parsedContent.join(" ");
    };

    this.getNextNodeSelector$ = function(isTrue) {
        var connections = jsPlumb.getConnections({source: this.$selector});

        if (isTrue === true) {
            if (/verdadeiro/i.test(connections[0].getLabel())) {
                return $(connections[0].target);
            }
            else {
                return $(connections[1].target);
            }
        }
        else if(isTrue === false){
            if (/verdadeiro/i.test(connections[0].getLabel())) {
                return $(connections[1].target);
            }
            else {
                return $(connections[0].target);
            }
        }
        else {
            flow.UI.markFailure("Erro de execućão", this.$selector);
        }
    };

    this.validate = function() {
        var connections = jsPlumb.getConnections({source: this.$selector});

        if (connections.length < 2) {
            flow.UI.markFailure("É necessário que existam dois fluxos de saída", this.$selector);
        }

        var hasTrue = false,
            hasFalse = false;
        for (var i = 0; i < connections.length; i++) {
            if (/verdadeiro/i.test(connections[i].getLabel())) {
                hasTrue = true;
            }
            else if (/falso/i.test(connections[i].getLabel())) {
                hasFalse = true;
            }
        }

        if (!hasTrue || !hasFalse) {
            flow.UI.markFailure(
                "É necessário haver um fluxo <b>verdadeiro</b> e outro <b>falso</b>", this.$selector
            );
        }
    };
};
Decision.prototype = Object.create(Node.prototype);