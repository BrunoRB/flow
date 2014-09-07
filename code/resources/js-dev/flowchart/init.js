"use strict";

$(document).ready(function() {
    window.flow = Flow;
    window.flowCache = flow.Cache;

    flowCache.setCache();

    flow.Utilities.invokeAllFunctions(flow.FlowchartListeners);
    flow.Utilities.invokeAllFunctions(flow.ShapeListeners);

    flow.JsPlumbDefaults.setJsPlumbDefaults();

    // if requested, load.
    var thereIsAnOpenFlowchart = ($(".flowchart.active").length > 0);
    if (thereIsAnOpenFlowchart) {
        flow.FlowchartHandler.loadFlowchart();
    }
    else {
        flow.UI.openHelp();
    }

    flow.Style.setDefaultStyle();
});