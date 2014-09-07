"use strict";

(function() {
    jsPlumb.ready(function() {
        flow.JsPlumbDefaults.setJsPlumbDefaults();

        var $container = $("#flowchart-container");
        var $shapes = $container.find("div.shape");

        jsPlumb.draggable($shapes, {
            containment: $container,
            opacity: 0.9
        });

        var $begin = $("#begin-shape");
        var $process = $("#process-shape");
        var $display = $("#display-shape");
        var $end = $("#end-shape");

        jsPlumb.doWhileSuspended(function() {
            jsPlumb.connect({source: $begin, target: $process});

            jsPlumb.connect({source: $process, target: $display});

            jsPlumb.connect({source: $display, target: $end});
        });
    });
})();
