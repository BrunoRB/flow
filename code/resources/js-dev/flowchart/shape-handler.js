"use strict";

Flow.ShapeHandler = {

    loadFlowchartContent: function() {
        var that = this,
            $flowchart = flow.FlowchartHandler.getActiveFlowchart$();

        $.ajax({
            type: "GET",
            data: {request_type: flow.Constants.AJAX},
            dataType: "text json",
            url: "/flowchart/getShapesData/" + $flowchart.attr("data-flow-id"),
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage("Carregando fluxograma");
            },
            success: function(retval) {
                if (retval !== false) {
					var isFromOwnFlowchart = retval.isOwnFlowchart;

                    that.appendShapesToFlowchart(retval.shapes, $flowchart, isFromOwnFlowchart);

                    that.setConnectionsOnFlowchart(retval.shapeconnections, $flowchart);

                    $flowchart.attr("data-is-own", isFromOwnFlowchart);

					$flowchart.find("div.shape[data-flow-name='begin']").focus(); // focus begin after load

					if (!isFromOwnFlowchart) {
						$flowchart.addClass("frozen-anchors");
					}

                    flow.UI.displayFlowchartSuccessMessage("Fluxograma caregado");
                }
                else {
                    flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage);
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, errorThrown);
            }
        });
    },

    appendShapesToFlowchart: function(shapes, $flowchart, isFromOwnFlowchart) {
        var $fragment = $(document.createDocumentFragment());
        for (var i=shapes.length; i--; ) {
            var shapeData = shapes[i];

            var $shape = new flow.Shape(this.createShapeHtmlWithDatabaseData(shapeData), isFromOwnFlowchart);

            $fragment.append($shape);
        }

        $flowchart.append($fragment);
    },

    createShapeHtmlWithDatabaseData: function (shapeData) {
        var $temp = this.getShapeCloneByName(shapeData.fk_shape_definition);
        var $clone = $temp.attr("data-flow-id", shapeData.id).css({
            top: shapeData.position_top + "px",
            left: shapeData.position_left + "px"
        });
        if (shapeData.value !== "") {
            $clone.find("code").text(shapeData.value);
        }
        return $clone;
    },

    setConnectionsOnFlowchart: function(connections, $flowchart) {
        for (var i=connections.length; i--; ) {
            var shapeConnData = connections[i];

            var $source = this.findShapeById(shapeConnData['fk_source_shape']);
            var $target = this.findShapeById(shapeConnData['fk_target_shape']);

            var connection = jsPlumb.connect({source: $source, target: $target});

            if (shapeConnData.value !== "") {
                this.setConnectionLabel(connection, shapeConnData.value, $flowchart);
            }
        }
    },

    setConnectionLabel: function(connection, value, $flowchart) {
        var labelId = flow.UI.getConnectionHtmlId(connection);

        connection.setLabel(flow.Templates.getConnectionPlainText(labelId, value));

        jsPlumb.draggable(labelId, {
            containment: $flowchart,
            opacity: 0.8
        });
    },

    deleteConnection: function(source, target) {
        jsPlumb.detach({source: source, target: target});
        this.ajaxDeleteConnection(source, target);
    },

    ajaxDeleteConnection: function(source, target) {
        $.ajax({
            type: "POST",
            url: "/flowchart/deleteConnection",
            data: {
                request_type: flow.Constants.AJAX,
                sourceId: $(source).attr("data-flow-id"),
                targetId: $(target).attr("data-flow-id")
            },
            dataType: "text json",
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage(flow.Templates.flowchartInfoOnSaveMessage);
            },
            success: function(retval) {
                if (retval) {
                    flow.UI.displayFlowchartSuccessMessage(flow.Templates.flowchartSuccessOnSaveMessage);
                }
                else {
                    flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, retval);
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, errorThrown);
            }
        });
    },

    ajaxDelete: function(shape) {
        var $shape = $(shape);

        $.ajax({
            type: "POST",
            url: "/flowchart/deleteShape/" + $shape.attr("data-flow-id"),
            dataType: "text json",
            data: {request_type: flow.Constants.AJAX},
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage(flow.Templates.flowchartInfoOnSaveMessage);
            },
            success: function(retval) {
                if (retval === true) {
                    flow.UI.displayFlowchartSuccessMessage(flow.Templates.flowchartSuccessOnSaveMessage);
                }
                else {
                    flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, retval);
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, errorThrown);
            }
        });
    },

    ajaxSetConnection: function(source, target, value) {
        $.ajax({
            type: "POST",
            url: "/flowchart/setConnection",
            data: {
                request_type: flow.Constants.AJAX,
                sourceId: source.getAttribute("data-flow-id"),
                targetId: target.getAttribute("data-flow-id"),
                value: (value !== undefined) ? value : null
            },
            dataType: "text json",
            beforeSend: function() {
                $(document.getElementsByClassName("alertify-log")).remove();
                flow.UI.displayFlowchartInfoMessage(flow.Templates.flowchartInfoOnSaveMessage);
            },
            success: function(retval) {
                if (retval) {
                    $(document.getElementsByClassName("alertify-log-success")).remove();
                    flow.UI.displayFlowchartSuccessMessage(flow.Templates.flowchartSuccessOnSaveMessage);
                }
                else {
                    flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, retval);
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, errorThrown);
            }
        });
    },

    getShapeCloneByName: function(name) {
        return flowCache.$menuOfShapes.find("div.shape[data-flow-name='" + name + "']").clone();
    },

    findShapeById: function(id) {
        return $(document.querySelectorAll("div.shape[data-flow-id='" + id + "']"));
    },

    ajaxSave: function(shape, isNew) {
        var $shape = $(shape);

        $.ajax({
            type: "POST",
            url: "/flowchart/saveShape",
            data: {
                request_type: flow.Constants.AJAX,
                shapesData: this.getShapeData($shape)
            },
            dataType: "text json",
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage(flow.Templates.flowchartInfoOnSaveMessage);
            },
            success: function(retval) {
                if (retval !== false) {
                    flow.UI.displayFlowchartSuccessMessage(flow.Templates.flowchartSuccessOnSaveMessage);

                    $shape.attr("data-flow-id", retval);

                    if (isNew) {
                        $shape.trigger(flow.State.SHAPE_CREADTED);
                    }
                }
                else {
                    flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage);
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, errorThrown);
            }
        });
    },

    ajaxRecreate: function(data) {
        $.ajax({
            type: "POST",
            url: "/flowchart/recreateShape",
            data: {
                request_type: flow.Constants.AJAX,
                shapesData: data
            },
            dataType: "text json",
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage(flow.Templates.flowchartInfoOnSaveMessage);
            },
            success: function(retval) {
                if (retval !== false) {
                    flow.UI.displayFlowchartSuccessMessage(flow.Templates.flowchartSuccessOnSaveMessage);
                }
                else {
                    flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, retval);
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError(flow.Templates.flowchartErrorOnSaveMessage, errorThrown);
            }
        });
    },

    getShapeData: function($shape) {
        var shapeName = $shape.attr("data-flow-name");
        return {
            id: $shape.attr("data-flow-id"), // database id, IF == undefined it is a new shape
            htmlId: $shape.attr("id"),
            name: shapeName,
            value: $shape.find("code").text(),
            left: $shape.css("left").replace("px", ""),
            top: $shape.css("top").replace("px", ""),
            idFlowchart: $shape.parent().attr("data-flow-id"), // flowchart database id
            shapeDefinitionName: shapeName // shapedefinition PK
        };
    }
};