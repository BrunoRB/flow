"use strict";

Flow.Cache = {

    $executeButton: null,

    $flowchartArea: null,

    $logo: null,

    $menuOfShapes: null,

    $rightArea: null,

    $settings: null,

    $leftArea: null,

    $flowchartTab: null,

    $flowchartContainer: null,

    $consoleContent: null,

    $consoleArea: null,

    $pagination: null,

    $debugButton: null,

    $displayContentScroll: null,

    $toggleConsole: null,

    $paginationContent: null,

    $helpTab: null,

    $ownFlowchartSearch: null,

    $helpContent: null,

    setCache: function() {
        var that = this;
        var doc = document;

        that.$executeButton = $(doc.getElementById("execute"));

        that.$flowchartArea = $(doc.getElementById("flowchart-area"));

        that.$menuOfShapes = $(doc.getElementById("shape-menu"));

        that.$settings = $(doc.getElementById("flowchart-settings"));

        that.$rightArea = $(doc.getElementById("right-area"));

        that.$leftArea = $(doc.getElementById("left-area"));

        that.$flowchartTab = $(doc.getElementById("flowchart-tab"));

        that.$flowchartContainer = $(doc.getElementById("flowchart-container"));

        that.$consoleContent = $(doc.getElementById("console-display-content"));

        that.$consoleArea = $(doc.getElementById("console-area"));

        that.$pagination = $(doc.getElementById("pagination"));

        that.$debugButton = $(doc.getElementById("debug"));

        that.$displayContentScroll = $(doc.getElementById("console-display"));

        that.$toggleConsoleButton = $(doc.getElementById("toggle-console"));

        that.$logo = $(doc.getElementById("logo"));

        that.$paginationContent = that.$pagination.find(".dynamic-content");

        that.$helpTab = $(doc.getElementById("help-tab"));

        that.$ownFlowchartSearch = $(doc.getElementById("own-flowchart-search"));

        that.$helpContent = $(doc.getElementById("help-content"));
    }
};