"use strict";

if (window.flow === undefined || window.flow === "undefined") {
    window.flow = Flow;
}

Flow.Utilities = {
    DEBUG_MODE: false,

    getRandomInteger: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * Generate a series of anchors in the flowchart, mainly used to test Drag and Drop
     * @returns {boolean}
     */
    generateFlowchartAnchors: function(numberOfAnchors) {
        $(".shape-anchor").remove();
        var $flowchart = flow.FlowchartHandler.getActiveFlowchart$();

        var maxWidth = $flowchart.scrollLeft();
        var maxHeight = $flowchart.scrollTop();
        for (var i = 1; i <= numberOfAnchors; i++) {
            var left = this.getRandomInteger(0, maxWidth) + $flowchart.scrollLeft() + "px";
            var top = this.getRandomInteger(0, maxHeight) + $flowchart.scrollTop() + "px";
            $flowchart.append("<span class='shape-anchor ancora" + i + "'" +
                "style='position: absolute; top: " + top + "; left: " + left + " '>Anchor</span>");
        }
        return true;
    },

    generateShape: function(shapeName) {
        var $flowchart = flow.FlowchartHandler.getActiveFlowchart$();
        var flowchartWidth = $flowchart.scrollLeft();
        var flowchartHeight = $flowchart.scrollTop();

        var top = this.getRandomInteger(50, flowchartHeight) + flowchartHeight + "px";
        var left = this.getRandomInteger(50, flowchartWidth) + flowchartWidth + "px";

        var $clone = flow.ShapeHandler.getShapeCloneByName(shapeName).css({
            top: top,
            left: left
        });

        var $shape = new flow.Shape($clone);

		$flowchart.append($shape);
    },

    /**
     * calls console.log on data if debugMode is true
     */
    showDebug: function(data) {
        console.log((this.DEBUG_MODE) ? data : "error");
    },

    ajaxError: function(message, error) {
        flow.UI.displayFlowchartErrorMessage(message);
        if (error !== undefined) {
            flow.Utilities.showDebug(error);
        }
    },

    /**
     * Call all functions of a given object (just parameter-less funcs)
     */
    invokeAllFunctions: function(obj) {
        Object.getOwnPropertyNames(obj).forEach(function(propertieName) {
            if (typeof obj[propertieName] === "function") {
                obj[propertieName]();
            }
        });
    }

};

Flow.Constants = {
    AJAX: 'ajax',
    PHP: 'php',

    BEGIN: 'begin',
    END: 'end',
    DISPLAY: 'display',
    MANUAL_INPUT: 'manual_input',
    PROCESS: 'process',
    DECISION: 'decision',
    CONNECTOR: 'connector',

    CONNECTION_BOOLEAN: "boolean",
    CONNECTION_TEXT: "text",

    INPUT_MAX_LENGTH: 30
};