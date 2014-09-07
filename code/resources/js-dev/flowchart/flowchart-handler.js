"use strict";

Flow.FlowchartHandler = {

    FLOWCHART_OPENED: "flowchartOpened",
    FLOWCHART_DELETED: "flowchartDeleted",
    FLOWCHART_UPDATED: "flowchartUpdated",
	FLOWCHART_CLOSED: "flowchartClosed",

    ajaxCreate: function(name) {
        var that = this;

        $.ajax({
            type: "POST",
            url: "/flowchart/create",
            data: {request_type: flow.Constants.AJAX, name: name},
            dataType: "text json",
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage("Criando fluxgrama...");
            },
            success: function(idFromSavedFlowchart) {
                if (idFromSavedFlowchart !== false) {
                    that.closeOpenFlowchart();
                    var $flowchart = that.appendFlowchartToDOM(name, idFromSavedFlowchart);
					that.setFlowchartAsOwn($flowchart);

                    that.appendFlowchartTabToDOM(name, idFromSavedFlowchart);

                    flow.UI.displayFlowchartSuccessMessage("Fluxograma criado");

                    $flowchart.trigger(that.FLOWCHART_OPENED);

                    flowCache.$ownFlowchartSearch.trigger("keyup", true);
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

	setFlowchartAsOwn: function($flowchart) {
		$flowchart.attr("data-is-own", true);
	},

    appendFlowchartToDOM: function(name, idFromDatabase) {
        var $container = flowCache.$flowchartContainer;

        $container.append(flow.Templates.getFlowchartTemplate(name, idFromDatabase));

        var $appendedFlowchart = $container.find("div.flowchart[data-flow-id='" + idFromDatabase + "']");

        // set the container element for jsPlumb
        this.set_jsPlumbContainer($appendedFlowchart);

        this.ajaxGetFlowchartData(parseInt(idFromDatabase, 10));

        this.setActiveFlowchartScrollPosition();

        flow.UI.enableExecutionButtons();

        return $appendedFlowchart;
    },

    appendFlowchartTabToDOM: function(name, flowchartDatabaseId) {
        flowCache.$flowchartTab.append(flow.Templates.getTabTemplate(name, flowchartDatabaseId));
    },

    setActiveFlowchartScrollPosition: function() {
        var $flowchart = this.getActiveFlowchart$();
        $flowchart.scrollTop($flowchart.height());
        $flowchart.scrollLeft($flowchart.width());
    },

    getActiveFlowchartName: function($activeFlowchart) {
        return ($activeFlowchart !== undefined) ?
            $activeFlowchart.attr("data-flow-name") : this.getActiveFlowchart$().attr("data-flow-name");
    },

    closeOpenFlowchart: function() {
        this.getActiveFlowchartTab$().removeClass("active");
        this.getActiveFlowchart$().remove();

        var ui = flow.UI;
        ui.dropSettingsSidebarContent();
        ui.disableExecutionButtons();
        ui.openHelp();

		flowCache.$flowchartContainer.trigger(this.FLOWCHART_CLOSED);
    },

    ajaxDeleteActiveFlowchart: function($form) {
        var that = this;

        $.ajax({
            type: "POST",
            data: {request_type: flow.Constants.AJAX},
            dataType: "text json",
            url: $form.attr("action"),
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage("Deletando fluxograma...");
            },
            success: function(retval) {
                if (retval === true) { // success, now we expurge the flowchart elements from the DOM
                    that.dropActiveFlowchart();
                    flow.UI.displayFlowchartSuccessMessage("Fluxograma excluído");
                }
                else {
                    flow.Utilities.ajaxError("Ocorreu um erro durante a tentativa de deleção do fluxograma");
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError("Ocorreu um erro durante a tentativa de deleção do fluxograma", errorThrown);
            }
        });
    },

    dropActiveFlowchart: function() {
        this.getActiveFlowchartTab$().remove();
        this.closeOpenFlowchart();

        flowCache.$flowchartContainer.trigger(this.FLOWCHART_DELETED);
    },

    loadFlowchart: function() {
        var $flowchart = this.getActiveFlowchart$();
        this.set_jsPlumbContainer($flowchart);
        flow.ShapeHandler.loadFlowchartContent();
        flow.UI.enableExecutionButtons();
        $flowchart.trigger(this.FLOWCHART_OPENED);
    },

    getActiveFlowchart$: function() {
        return flowCache.$flowchartArea.find(".flowchart.active");
    },

    getActiveFlowchartTab$: function() {
        return flowCache.$flowchartArea.find(".flowchart-tab.active");
    },

    updateActiveFlowchartName: function(newName) {
        var $activeFlowchart = this.getActiveFlowchart$();

        if (newName !== this.getActiveFlowchartName($activeFlowchart)) {
            $activeFlowchart.attr("data-flow-name", newName);

            var $tab = this.getActiveFlowchartTab$();
            $tab.html(newName + "<i class='remove icon medium red right'></i>");
            $tab.prop("id", newName + $tab.attr("data-flow-id") + "-tab-link");

            this.ajaxUpdateActiveFlowchartData({name: newName});
        }
        else {
            flow.UI.displayFlowchartInfoMessage("Nome inalterado");
        }
    },

    ajaxUpdateActiveFlowchartData: function(data) {
        var that = this,
            $flowchart = this.getActiveFlowchart$(),
            idFlowchart = $flowchart.attr("data-flow-id");

        $.ajax({
            type: "POST",
            url: "/flowchart/update/" + idFlowchart,
            data: {request_type: flow.Constants.AJAX, flowchartNewData: data},
            dataType: "text json",
            beforeSend: function() {
                flow.UI.displayFlowchartInfoMessage(flow.Templates.flowchartInfoOnSaveMessage);
            },
            success: function(retval) {
                if (parseInt(retval, 10) === parseInt(idFlowchart, 10)) {
                    flow.UI.displayFlowchartSuccessMessage(flow.Templates.flowchartSuccessOnSaveMessage);
                    $flowchart.trigger(that.FLOWCHART_UPDATED);
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

    getActiveFlowchartDatabaseId: function($flowchart) {
        return ($flowchart !== undefined) ?
            $flowchart.attr("data-flow-id") : this.getActiveFlowchart$().attr("data-flow-id");
    },

    ajaxGetFlowchartData: function(idFlowchart) {
        $.ajax({
            type: "GET",
            url: "/flowchart/getConfigMenu/" + idFlowchart,
            data: {request_type: flow.Constants.AJAX},
            dataType: "text json",
            success: function(retval) {
                if (true) {
                    flow.UI.appendContentToSettingsSidebar(retval);
                }
                else {
                    flow.Utilities.ajaxError("Não foi possível carregar o menu");
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError("Não foi possível carregar o menu", errorThrown);
            }
        });
    },

    ajaxGetPaginationContent: function(parameters) {
        $.ajax({
            type: "GET",
            url: "/flowchart/getPaginationContent" + parameters,
            data: {request_type: flow.Constants.AJAX},
            dataType: "text json",
            success: function(retval) {
                if (retval !== false) {
                    flow.UI.replacePaginationContent(retval);
                }
                else {
                    flow.Utilities.ajaxError("Não foi possível carregar o menu");
                }
            },
            error: function(errorThrown) {
                flow.Utilities.ajaxError("Não foi possível carregar o menu", errorThrown);
            },
            complete: function() {
                var $searchDiv = flowCache.$ownFlowchartSearch.parent();
                $searchDiv.removeClass("loading");
            }
        });
    },

	isOwnFlowchart: function($flowchart) {
		return $flowchart.attr("data-is-own") === "true";
	},

    set_jsPlumbContainer: function(container) {
        jsPlumb.Defaults.Container = container;
    }
};