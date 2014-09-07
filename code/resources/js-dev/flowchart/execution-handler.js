"use strict";

Flow.ExecutionHandler = {

    currentNode: null,

    $nextNodeSelector: null,

    $cachedNodes: {},

    cleanAttributesValues: function() {
        flow.Nodes.cleanVarTable();
        this.$cachedNodes = {};
        this.currentNode = null;
        this.$nextNodeSelector = null;
    },

    triggertExecution: function() {
        this.cleanAttributesValues();
        flow.UI.unmarkAllShapes();

        var $beginShape = this.getBeginShape$();
        if ($beginShape.length > 0) {
            this.currentNode = flow.Nodes.factory($beginShape);
            this.$nextNodeSelector = this.currentNode.execute();
            this.executeAll();
        }
        else {
            alertify.error("Elemento início não encontrado", 1500);
            return false;
        }
    },

    executeAll: function() {
        while(this.$nextNodeSelector !== null) {
            this.setCurrentNode();
            this.$nextNodeSelector = this.currentNode.execute();
        }
        flow.UI.markShapeHasExecuted(this.currentNode.$selector);
        flow.UI.enableExecutionButtons();
        alertify.success("Execução completa", 1500);
    },

    triggerDebug: function() {
        this.cleanAttributesValues();
        flow.UI.unmarkAllShapes();

        var $beginShape = this.getBeginShape$();
        if ($beginShape.length > 0) {
            alertify.log("Debug iniciado", "info", 1500);
            this.currentNode = flow.Nodes.factory($beginShape);
            this.$nextNodeSelector = this.currentNode.execute();
            flow.UI.markShapeHasExecuted(this.currentNode.$selector);
            flow.UI.disableExecuteButton();
            return true;
        }
        else {
            alertify.error("Elemento início não encontrado", 1500);
            return false;
        }
    },

    executeNext: function() {
        flow.UI.unmarkShapeHasExecuted(this.currentNode.$selector);
        this.setCurrentNode();
        this.$nextNodeSelector = this.currentNode.execute();
        flow.UI.markShapeHasExecuted(this.currentNode.$selector);
        if (this.$nextNodeSelector === null) {
            alertify.success("Execução completa", 1500);
            flow.UI.disableDebugButtons();
            flow.UI.enableExecuteButton();
        }
    },

    stopDebug: function() {
        alertify.success("Debug cancelado", 1500);
        flow.UI.disableDebugButtons();
        flow.UI.enableExecuteButton();
        flow.UI.unmarkAllShapes();
    },

    setCurrentNode: function() {
        if (this.$nextNodeSelector === null) {
            return;
        }

        var nextNodeId = this.$nextNodeSelector.prop("id");
        if (this.$cachedNodes.hasOwnProperty(nextNodeId)) {
            this.currentNode = this.$cachedNodes[nextNodeId];
        }
        else {
            this.currentNode = flow.Nodes.factory(this.$nextNodeSelector);
            this.$cachedNodes[nextNodeId] = this.currentNode;
        }
    },

    getBeginShape$: function() {
        return flow.FlowchartHandler.getActiveFlowchart$().find("div.shape[data-flow-name='begin']");
    },

    getDebugNextNode: function() {
        var $next = this.currentNode.getNextNodeSelector$;
        if ($next !== null) {
            return $next;
        }
        alertify.error("Fim do algoritmo encontrado");
        throw "Fim da execucão";
    }
};