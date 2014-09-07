"use strict";

Flow.ShapeListeners = {

    lastClickedConnection: {}, // {flowchartId: connection}

    lastClickedShape: {}, // {flowchartId: shape}

    /**
     * @see flowchart-listeners.js _flowchartOpenedOrDeleted()
     */
    _shapeFromMenuDrag: function() {
        flowCache.$menuOfShapes.find("div.shape").draggable({
            helper: "clone",
            cursor: "move",
            revert: true
        });
    },

    _beforeDropConnection: function() {
        jsPlumb.bind("beforeDrop", function(info) {
            var source = document.getElementById(info.sourceId);
            var target = document.getElementById(info.targetId);

            // assuming its a A - B conn this gets the B - A conn (if exists)
            var reverseConn = jsPlumb.getConnections({source: target, target: source});
            var conn = jsPlumb.getConnections({source: source, target: target});

            if (source === target) { // recursive conn, prohibited
                alertify.error("Você não não pode conectar um elemento a ele mesmo !", 1000);
                return false;
            }
            else if (reverseConn.length > 0) { // A-B B-A conn, prohibited
                alertify.error("Dois elementos não podem compartilhar mais de uma conexão entre si !", 1000);
                return false;
            }
            else if (conn.length > 0) {
                alertify.error("Não é permitido duplicar uma conexão !", 1000);
                return false;
            }
            else if (connectionAlredyExists(source, target)) {
                return false;
            }
            else {
                var newConnection = info.connection;
                var suspendedTarget = newConnection.suspendedElement;
                if (suspendedTarget !== undefined) {
                    triggerConnectionMoved(target, newConnection);

                    flow.ShapeHandler.ajaxDeleteConnection(newConnection.source, suspendedTarget);
                }

                return true;
            }
        });

        var connectionAlredyExists = function(source, target) {
            var sourceConns = jsPlumb.getConnections({source: source});
            for (var i = 0; i < sourceConns.length; i++) {
                if (sourceConns[i].suspendedElement === target) {
                    return true;
                }
            }
            return false;
        };

        var triggerConnectionMoved = function(target, connection) {
            var source = connection.source;
            var suspended = connection.suspendedElement;
            var connections = {
                deletedConnectionInfo: {
                    source: source,
                    target: suspended,
                    value: "" // TODO
                },
                createdConnectionInfo: {
                    source: source,
                    target: target,
                    value: $(connection.getLabel()).text()
                },
                idFlowchart: source.parentNode.getAttribute("data-flow-id")
            };
            flowCache.$flowchartContainer.trigger(flow.State.CONNECTION_ALTERATION, connections);
        };
    },

    _connectionClick: function() {
        var that = this;

        var clickedConnectionStyle = {
            gradient: {stops: [[0, "#D95C5C"], [1, "white"]]}, strokeStyle: "#D95C5C"
        };

        jsPlumb.bind("click", function(connection) {
			var $flowchart = flow.FlowchartHandler.getActiveFlowchart$(),
				activeFlowchartId = $flowchart.prop("id");

			if (!flow.FlowchartHandler.isOwnFlowchart($flowchart)) {
				return false;
			}

            if (that.lastClickedConnection[activeFlowchartId] !== undefined
                && that.lastClickedConnection[activeFlowchartId] !== connection
            ) {
                flow.UI.unmarkConnectionHasSelected(that.lastClickedConnection[activeFlowchartId]);
            }

            connection.setPaintStyle(clickedConnectionStyle);

            that.lastClickedConnection[activeFlowchartId] = connection;
        });
    },

    _connectionMaded: function() {
        jsPlumb.bind("connection", function(info, originalEvent) {
            if (originalEvent !== undefined) { // acontece no load (conexão estabelecida programaticamente)
                var connection = info.connection;
                var value = getConnectionValue(connection);
                flow.ShapeHandler.ajaxSetConnection(info.source, info.target, value);
                setConnectionLabel(connection, value);

                if (connection.suspendedElement === undefined) {
                    triggerConnectionMoved(info.source, info.target, value);
                }
            }
        });

        var triggerConnectionMoved = function(source, target, value) {
            var connections = {
                createdConnectionInfo: {
                    source: source,
                    target: target,
                    value: value
                },
                idFlowchart: source.parentNode.getAttribute("data-flow-id")
            };
            flowCache.$flowchartContainer.trigger(flow.State.CONNECTION_ALTERATION, connections);
        };

        var setConnectionLabel = function(connection, value) {
            var id = flow.UI.getConnectionHtmlId(connection);
            connection.setLabel(flow.Templates.getConnectionPlainText(id, value));
        };

        var getConnectionValue = function(connection) {
            return $(connection.getLabel()).text();
        };
    },

    _activeFlowchartClick: function() {
        var that = this;
        flowCache.$flowchartArea.on("click", ".flowchart.active[data-is-own='true']", function(event) {
            var target = event.target;
            var tagName = target.tagName.toLowerCase();

            if (tagName === "input") {
                return;
            }
            else if (tagName === "code" || tagName === "img") {
                target = target.parentNode;
            } // typeof of first case is for svg-connection click
            else if (typeof target.className !== "string" || target.className.indexOf("shape ") === -1) {
                flow.UI.unmarkAllShapes();
            }

            var lastShape = that.lastClickedShape[this.id];
            if (lastShape !== undefined && lastShape !== target) {
                flow.UI.unmarkShapeHasSelected(lastShape);
                delete that.lastClickedShape[this.id];
            }

            var lastConnection = that.lastClickedConnection[this.id];
            if (target.id !== "" && lastConnection !== undefined) {
                flow.UI.unmarkConnectionHasSelected(lastConnection);
                delete that.lastClickedConnection[this.id];
            }
        });
    },

    _activeFlowchartKeyUp: function() {
        var that = this;
        flowCache.$flowchartArea.on("keyup", ".flowchart.active[data-is-own='true']", function(event) {
            var flowchart = this;
            var idFlowchart = this.id;

            var targetNodeName = event.target.nodeName.toUpperCase();

            if (event.keyCode === 46 && targetNodeName !== "INPUT" && that.lastClickedConnection[idFlowchart] !== undefined) {
                deleteConnection(flowchart);
            }
            else if(
                event.keyCode === 46 && targetNodeName !== "INPUT" && that.lastClickedShape[idFlowchart] !== undefined
            ) {
                deleteShape(flowchart);
            }
            else if (event.keyCode === 90 && event.ctrlKey) {
                flow.State.revert(flowchart);
            }
            else if (event.keyCode === 89 && event.ctrlKey) {
                flow.State.undoRevert(flowchart);
            }
        });

        var deleteConnection = function(flowchart) {
            var idFlowchart = flowchart.id;
            var connection = that.lastClickedConnection[idFlowchart];

            triggerConnectionAlteration(connection, flowchart);

            var source = connection.source;
            var target = connection.target;
            flow.ShapeHandler.deleteConnection(source, target);
            delete that.lastClickedConnection[idFlowchart];
            flowchart.focus();
        };

        var deleteShape = function(flowchart) {
            var idFlowchart = flowchart.id;

            var $shape = $(that.lastClickedShape[idFlowchart]);

            $shape.trigger(flow.State.SHAPE_DELETION);

            jsPlumb.detachAllConnections($shape); // first expurge all connections
            $shape.remove(); // them kill the element
            flow.ShapeHandler.ajaxDelete($shape[0]);
            delete that.lastClickedShape[idFlowchart];
            flowchart.focus();
        };

        var triggerConnectionAlteration = function(connection, flowchart) {
            var connections = {
                deletedConnectionInfo: {
                    source: connection.source,
                    target: connection.target,
                    value: $(connection.getLabel()).text()
                },
                idFlowchart: flowchart.getAttribute("data-flow-id")
            };
            flowCache.$flowchartContainer.trigger(flow.State.CONNECTION_ALTERATION, connections);
        };
    },

    _shapeClicked: function() {
        var that = this;
        flowCache.$flowchartArea.on("click", "div.flowchart[data-is-own='true'] div.shape", function(event) {
            var shape = this;
            var tagName = event.target.tagName.toLowerCase();

            if (tagName === "input") {
                return;
            }
            else if (tagName === "code") {
                shape = event.target.parentNode;
            }

            var flowchartId = shape.parentNode.id;
            if (that.lastClickedShape[flowchartId] !== undefined) {
                flow.UI.unmarkShapeHasSelected(that.lastClickedShape[flowchartId]);
                delete that.lastClickedShape[flowchartId];
            }

            that.lastClickedShape[flowchartId] = shape;
            flow.UI.markShapeHasSelected(shape);
        });
    },

    _shapeDoubleClicked: function() {
        flowCache.$flowchartArea.on("dblclick", "div.flowchart[data-is-own='true'] div.shape", function() {
            var $shape = $(this);

            if ($shape.attr("data-has-user-text") === "true") {
                $shape.trigger(flow.State.SHAPE_ALTERATION);

                flow.UI.openShapeInput($shape);
            }
            else {
                alertify.error("Elemento não pode conter texto", 2000);
            }
        });
    },

    _shapeStartToBeDragged: function() {
        var that = this;
        flowCache.$flowchartArea.on("dragstart", "div.shape", function(event) {
            var flowchartId = this.parentNode.id;

            dismarkSelectedShape(flowchartId);
            dismarkSelectedConnection(flowchartId);

            that.lastClickedShape[flowchartId] = this;
            flow.UI.markShapeHasSelected(this);

            $(this).trigger(flow.State.SHAPE_ALTERATION);
        });

        var dismarkSelectedShape = function(flowchartId) {
            if (that.lastClickedShape[flowchartId] !== undefined) {
                flow.UI.unmarkShapeHasSelected(that.lastClickedShape[flowchartId]);
                delete that.lastClickedShape[flowchartId];
            }
        };

        var dismarkSelectedConnection = function(flowchartId) {
            if (that.lastClickedConnection[flowchartId] !== undefined) {
                flow.UI.unmarkConnectionHasSelected(that.lastClickedConnection[flowchartId]);
                delete that.lastClickedConnection[flowchartId];
            }
        };
    },

    _shapeStopToBeDragged: function() {
        flowCache.$flowchartArea.on("dragstop", "div.shape", function(event) {
            flow.ShapeHandler.ajaxSave(this);
        });
    },

    _connectionDoubleClick: function() {
		var fHandler = flow.FlowchartHandler;
        jsPlumb.bind("dblclick", function(connection) {
			if (!(fHandler.isOwnFlowchart(fHandler.getActiveFlowchart$()))) {
				return false;
			}

            var connectionType = connection.source.dataset.connLabelType;
            if (connectionType === flow.Constants.CONNECTION_BOOLEAN) {
                flow.UI.openBooleanConnection(connection);
            }
            else {
                flow.UI.openTextConnection(connection);
            }
        });
    },

    _shapeAlteration: function() {
        flowCache.$flowchartContainer.on(flow.State.SHAPE_ALTERATION, '.flowchart div.shape', function(event) {
            flow.State.pushShapeAlteration($(event.target));
        });
    },

    _shapeDeleted: function() {
        flowCache.$flowchartContainer.on(flow.State.SHAPE_DELETION, '.flowchart div.shape', function(event) {
            flow.State.pushShapeDeletion($(event.target));
        });
    },

    _shapeCreated: function() {
        flowCache.$flowchartContainer.on(flow.State.SHAPE_CREADTED, '.flowchart div.shape', function(event) {
            flow.State.pushShapeCreated($(event.target));
        });
    },

    _connectionAlteration: function() {
        flowCache.$flowchartContainer.on(flow.State.CONNECTION_ALTERATION, function(event, connectionInfo) {
            flow.State.pushConnectionAlteration(connectionInfo);
        });
    }
};