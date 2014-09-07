"use strict";

Flow.UI = {

    appendContentToConsole: function(text) {
        flowCache.$consoleContent.append("<code>" + text + "</code><br>");
    },

    cleanConsoleContent: function() {
        flowCache.$consoleContent[0].innerHTML = "";
    },

    enableExecutionButtons: function() {
        var that = this;
        this.disableExecutionButtons();
        this.enableExecuteButton();
        this.enableDebugButton();
    },

    disableExecutionButtons: function() {
        this.disableExecuteButton();
        this.disableDebugButton();
        this.disableDebugNextButton();
        this.disableDebugStopButton();
    },

    disableDebugButtons: function() {
        this.disableDebugNextButton();
        this.disableDebugStopButton();
        this.enableDebugButton();
    },

    enableDebugNextButton: function() {
        $("#debug-next").removeClass("disabled");
    },

    disableDebugNextButton: function() {
        $("#debug-next").addClass("disabled");
    },

    enableExecuteButton: function() {
        flowCache.$executeButton.removeClass("disabled");
    },

    disableExecuteButton: function() {
        flowCache.$executeButton.addClass("disabled");
    },

    enableDebugStopButton: function() {
        $("#debug-stop").removeClass("disabled");
    },

    disableDebugStopButton: function() {
        $("#debug-stop").addClass("disabled");
    },

    enableDebugButton: function() {
        flowCache.$debugButton.removeClass("disabled");
    },

    disableDebugButton: function() {
        flowCache.$debugButton.addClass("disabled");
    },

    toggleConsole: function() {
        if (flowCache.$consoleArea.hasClass("disabled")) {
            this.displayConsole();
        }
        else {
            this.hideConsole();
        }
    },

    hideConsole: function() {
        flowCache.$flowchartContainer.animate({height: "100%"}, 300);
        flowCache.$consoleArea.addClass("disabled");
        flowCache.$toggleConsoleButton.attr("title", "Exibir console");
    },

    displayConsole: function() {
        flowCache.$flowchartContainer.animate({height: "80%"}, 300);
        flowCache.$consoleArea.removeClass("disabled");
        flowCache.$toggleConsoleButton.attr("title", "Esconder console");
    },

    openHelp: function() {
        flowCache.$helpTab.addClass("active");
        document.getElementById("help-content").style.display = "block";
    },

    closeHelp: function() {
        flowCache.$helpTab.removeClass("active");
        document.getElementById("help-content").style.display = "none";
    },

    replacePaginationContent: function(newContent) {
        flowCache.$paginationContent.empty();
        flowCache.$paginationContent.append(newContent);
    },

    dropActiveFlowchart: function() {
        flow.FlowchartHandler.getActiveFlowchart$().remove();
    },

    dropTabOfActiveFlowchart: function() {
        flow.FlowchartHandler.getActiveFlowchartTab$().remove();
    },

    dropSettingsSidebarContent: function() {
        flowCache.$settings.children().remove(); // drop elements contet
        flowCache.$settings.sidebar("hide");
    },

    appendContentToSettingsSidebar: function(data) {
        flowCache.$settings.append(data);
    },

    markConnectionHasSelected: function(connection) {
        //TODO
        throw "TODO";
    },

    unmarkConnectionHasSelected: function(connection) {
        connection.setPaintStyle(flow.JsPlumbDefaults.defaultPaintStyle);
    },

    openTextConnection: function(connection) {
        var idConnLabel = this.getConnectionHtmlId(connection);

        if (connection.getLabel() === null) { // case there's no label yet
            connection.setLabel(
                flow.Templates.getConnectionEmptyInput(idConnLabel)
            );
        }
        else { // here we alredy have a label
            var existantLabel = document.getElementById(idConnLabel);
            var oldText = existantLabel.innerHTML;

            connection.setLabel(
                flow.Templates.getConnectionFilledInput(
                    idConnLabel, oldText, existantLabel.style.top, existantLabel.style.left
                )
            );
        }

        this.blurOnConnectionInput(connection, oldText);
    },

    blurOnConnectionInput: function(connection, oldText) {
        var that = this;

        var labelInputField = document.getElementById(this.getConnectionHtmlId(connection));
        labelInputField.select();

        var $inputField = $(labelInputField);
        $inputField.focus();

        $inputField.blur(function() {
            that.setNewValueOfConnection(connection, this, oldText);
        });
    },

    openBooleanConnection: function(connection) {
        var idConnection = this.getConnectionHtmlId(connection);
        var labelField = document.getElementById(idConnection);

        if (labelField !== null && /verdadeiro|true/i.test(labelField.textContent)) {
            connection.setLabel(
                flow.Templates.getConnectionSelectWithTrueSelected(
                    idConnection,
                    labelField.style.top,
                    labelField.style.left
                )
            );
        }
        else if (labelField !== null && /falso|false/i.test(labelField.textContent)) {
            connection.setLabel(
                flow.Templates.getConnectionSelectWithFalseSelected(
                    idConnection,
                    labelField.style.top,
                    labelField.style.left
                )
            );
        }
        else if (labelField !== null) {
            connection.setLabel(flow.Templates.getConnectionSelect(idConnection));
        }
        else {
            connection.setLabel(flow.Templates.getConnectionSelect(idConnection));
        }

        this.clickOrBlurOnConnectionSelect(connection);
    },

    clickOrBlurOnConnectionSelect: function(connection) {
        var that = this;
        var $selectField = $(document.getElementById(this.getConnectionHtmlId(connection)));
        $selectField.focus();
        var oldText = $selectField.val();

        $selectField.one("change blur", function() {
            $selectField.off(); // when don't want that the two events trigger the func at the same time
            that.setNewValueOfConnection(connection, this, oldText);
        });

    },

    getConnectionHtmlId: function(connection) {
        return connection.sourceId + "_" + connection.targetId;
    },

    setNewValueOfConnection: function(connection, field, oldText) {
        var labelId = field.id;
        var newText = field.value;

        connection.setLabel(
            flow.Templates.getConnectionPlainText(
                labelId, newText, field.style.top, field.style.left
            )
        );

        var $labelField = $(document.getElementById(labelId));

        jsPlumb.draggable($labelField, {
            containment: flow.FlowchartHandler.getActiveFlowchart$(),
            opacity: 0.8
        });

        // avoid unnecessary save (when text stay the same or when empty text stay empty)
        if (newText !== oldText && !(oldText === undefined && newText === "")) {
            flow.ShapeHandler.ajaxSetConnection(connection.source, connection.target, newText);
        }
    },

    openShapeInput: function($shape) {
        var $textElement = $shape.find("code");

        var oldText = $textElement.text();

        $textElement.replaceWith(flow.Templates.getShapeInput(oldText));

        $textElement = $shape.find("input");

        $textElement.focus(); // set focus here so he can alredy start typing

        $textElement[0].select();

        // back to "code"
        $textElement.on("blur keyup", function(event) {
            if (event.type === "keyup" && event.keyCode !== 13) {
                return;
            }
            $textElement.replaceWith(flow.Templates.getShapeCode($textElement.val())); //Hidden again

            $textElement = $shape.find("code");
            var newText = $textElement.text();

            if (oldText !== newText) { // save only when text changes
                flow.ShapeHandler.ajaxSave($shape[0]);
            }
        });
    },

    markShapeHasSelected: function(shape) {
        var shapeStyle = shape.style;
        shapeStyle.borderColor = "#9ecaed";
        shapeStyle.boxShadow = "0 0 40px teal";
        shapeStyle.zIndex = "100";
        shape.setAttribute("name", "shape-with-focus");
        shape.focus();
    },

    unmarkShapeHasSelected: function(shape) {
        var shapeStyle = shape.style;
        shapeStyle.borderColor = "black";
        shapeStyle.boxShadow = "none";
        shapeStyle.zIndex = "10";
        shape.setAttribute("name", "");
    },

    unmarkAllShapes: function() {
        var focusedShapes = document.getElementsByName("shape-with-focus");
        var $shapes = flow.FlowchartHandler.getActiveFlowchart$().find("div.shape").not(focusedShapes);

        $shapes.css({
            "border-color": "black",
            "box-shadow": "none",
            "z-index": "10"
        });
    },

    unmarkShapeHasExecuted: function($shape) {
        if ($shape[0].getAttribute("name") !== "shape-with-focus") {
            $shape.css({
                "border-color": "black",
                "box-shadow": "none"
            });
        }
        else {
            this.markShapeHasSelected($shape[0]);
        }
    },

    markShapeHasExecuted: function($shape) {
        $shape.css({
            "border-color": "green",
            "box-shadow": "0px 0px 40px green"
        });
        $shape.focus();
    },

    markShapeHasInvalid: function(shape) {
        if (shape instanceof jQuery) {
            shape.css({borderColor: "#D95C5C", boxShadow: "0 0 40px #D95C5C"});
        }
        else {
            shape.style.borderColor = "D95C5C";
            shape.style.boxShadow = "0 0 40px #D95C5C";
        }
        shape.focus();
    },

    unmarkShapeHasInvalid: function(shape) {
        if (shape instanceof jQuery) {
            shape.css({borderColor: "black", boxShadow: "none"});
        }
        else {
            shape.style.borderColor = "black";
            shape.style.boxShadow = "none";
        }
        shape.focus();
    },

    markFailure: function(message, shape) {
        if (shape !== undefined) {
            this.markShapeHasInvalid(shape);
        }
        alertify.error(message);

        this.enableExecutionButtons();

        throw message;
    },

    displayFlowchartInfoMessage: function(message) {
        alertify.log(message, "info", 600);
    },

    displayFlowchartSuccessMessage: function(message) {
        alertify.success(message, 600);
    },

    displayFlowchartErrorMessage: function(message) {
        alertify.error(message, 600);
    }
};