"use strict";

Flow.Shape = function(shape, isFromOwnFlowchart) {

    var that = this;

    this.$newShape = this.getNew(shape);

    (function() {
		if (isFromOwnFlowchart !== false) {
			that._makeDraggable();
			that._delimitConnections();
		}
    })();

    return this.$newShape;
};

Flow.Shape.prototype.getNew = function(baseShape) {
    var $new = baseShape instanceof jQuery ? baseShape.clone() : $(baseShape).clone();
    $new.attr('data-created-by-user', true).prop("tabindex", "-1");
    $new.removeClass("ui-draggable");
    return $new;
};

Flow.Shape.prototype._makeDraggable = function() {
    jsPlumb.draggable(this.$newShape, {
        containment: flow.FlowchartHandler.getActiveFlowchart$(),
        opacity: 0.9
    });
};

Flow.Shape.prototype._delimitConnections = function() {
    var $shape = this.$newShape;

    var maxInputs = $shape.attr("data-max-inputs");
    var maxOutputs = $shape.attr("data-max-outputs");

    if (maxInputs === "0") { // Source
        jsPlumb.makeSource($shape, {
            maxConnections: maxOutputs,
            filter: ".connector",
            isSource: true
        });
    }
    else if (maxOutputs === "0") { // Target
        jsPlumb.makeTarget($shape, {
            maxConnections: maxInputs,
            isTarget: true
        });
    }
    else { // Normal, both
        jsPlumb.makeSource($shape, {
            maxConnections: maxOutputs,
            filter: ".connector",
            isSource: true
        });

        jsPlumb.makeTarget($shape, {
            maxConnections: maxInputs,
            isTarget: true
        });
    }
};

Flow.Shape.prototype.canHaveConnectors = function() {
    var maxInputs = this.$newShape.attr("data-max-inputs");
    var maxOutputs = this.$newShape.attr("data-max-outputs");
    if (isNaN(maxInputs) || isNaN(maxOutputs) || maxOutputs === 0
        || maxInputs === null || maxOutputs === null || ((maxInputs === 0 && maxOutputs === 0))
    ) {
        return false;
    }
    return true;
};

/**
 * @Deprecated
 */
Flow.Shape.prototype._createConnectors = function() {
    var $shape = this.$newShape;
    var maxOutputs = $shape.attr("data-max-outputs");
    if (maxOutputs.toString() === "0") {
        return false;
    }

    var halfWidth = $shape.width() / 2 - 10;
    var halfHeight = $shape.height() / 2 - 10;
    var width = $shape.width() - 10;
    var height = $shape.height() - 10;

    $shape.append(flow.Templates.getShapeConnector('', halfWidth, height, ''));
    $shape.append(flow.Templates.getShapeConnector(height, '', '', halfWidth));
    $shape.append(flow.Templates.getShapeConnector('', width, halfHeight, ''));
    $shape.append(flow.Templates.getShapeConnector('', '', halfHeight, width));

    return true;
};
