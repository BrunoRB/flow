"use strict";

var Flow = {

    Style: {
        setDefaultStyle: function() {
            var that = this;

            that.setFlowchartSize();

            $(window).resize(function() {
                that.setFlowchartSize();
            });

            flow.FlowchartHandler.setActiveFlowchartScrollPosition();
        },

        setFlowchartSize: function() {
            var $window = $(window);
            var $flowchartArea = flowCache.$flowchartArea;
            var $leftArea = flowCache.$leftArea;

            var leftAreaWidth = $leftArea.width();

            $flowchartArea.width($window.width() - leftAreaWidth);

            var tabHeight = flowCache.$flowchartTab.height();
            $flowchartArea.height($window.height() - tabHeight);

            flowCache.$logo.height(tabHeight);

            flowCache.$settings.css("top", tabHeight + 1);
        }
    },

    JsPlumbDefaults: {
        defaultPaintStyle: {
            gradient: {
                stops: [
                    [0, "midnightblue"], [1, "black"]
                ]
            },
            strokeStyle: "black",
            lineWidth: 6
        },

        setJsPlumbDefaults: function() {
            var endPointStyles = {fillStyle: "transparent"};
            var jsPlumbDefaults = jsPlumb.Defaults;

            jsPlumbDefaults.EndpointStyles = [endPointStyles, endPointStyles];

            jsPlumbDefaults.ConnectionOverlays = [
                ["Arrow", {width: 25, length: 25, location: 1}]
            ];

            jsPlumbDefaults.Endpoints = [
                ["Rectangle", {cssClass: "source-anchor", radius: 15}],
                ["Rectangle", {radius: 15}]
            ];

            jsPlumbDefaults.Anchor = "AutoDefault";

            jsPlumbDefaults.Connector = "Bezier";
            //jsPlumbDefaults.Connector = "StateMachine";
            //jsPlumbDefaults.Connector = "Flowchart";
            //jsPlumbDefaults.Connector = "Straight";

            jsPlumbDefaults.PaintStyle = this.defaultPaintStyle;

            jsPlumbDefaults.ReattachConnections = true;
        }
    }
};