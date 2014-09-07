"use strict";

Flow.FlowchartListeners = {

    _helpClick: function() {
        flowCache.$helpTab.on("click", function() {
            flow.UI.openHelp();
            flow.FlowchartHandler.closeOpenFlowchart();

            history.pushState(null, null, "/flowchart/");
        });
    },

    _helpAccordions: function() {
        flowCache.$helpContent.accordion();
    },

    _logoutClick: function() {
        $("#leave").on("click", function(event) {
            if (!confirm("Deseja mesmo sair?")) {
                event.preventDefault();
            }
        });
    },

    _createNewFlochartButtonClick: function() {
        $("#createNew").on("click", function() {
            alertify.set({labels: {ok: "Sim", cancel: "Cancelar"}});

            alertify.prompt("Insira o nome do novo fluxograma", function(event, name) {
                if (event && name.length >= 4) {
                    flow.FlowchartHandler.ajaxCreate(name);
                }
                else if (event) {
                    alertify.error("Nome do fluxograma devo conter ao menos 4 caracteres");
                }
            });
        });
    },

    _deleteButtonClick: function() {
        flowCache.$settings.on("click", "#delete", function() {
            alertify.set({
                labels: {ok: "Sim", cancel: "Não"},
                buttonFocus: "cancel"}
            );

            alertify.confirm("<strong>Tem certeza que deseja excluir este fluxograma?</strong>", function(event) {
                if (event) {
                    $("#delete-flowchart-modal").submit();
                }
            });
        });
    },

    _deleteFlowchartSubmit: function() {
        flowCache.$settings.on("submit", "#delete-flowchart-modal", function(event) {
            event.preventDefault();
            flow.FlowchartHandler.ajaxDeleteActiveFlowchart($(this));
        });
    },

    _toggleSettingsButtonClick: function() {
        var $settings = flowCache.$settings;

        $settings.sidebar({overlay: true});

        flowCache.$flowchartContainer.on("click", "#toggle-settings", function() {
            $settings.sidebar("toggle");
        });
    },

    _flowchartNameChanged: function() {
        var $settings = flowCache.$settings;

        $settings.on("click", "#confirm-name", function() {
            updateName($("#flowchart-name").val());
        });

        $settings.on("keyup", "#flowchart-name", function(event) {
            if (event.keyCode === 13) {
                updateName(this.value);
            }
        });

        var updateName = function(newName) {
            if (newName.length >= 4) {
                flow.FlowchartHandler.updateActiveFlowchartName(newName);
            }
            else {
                alertify.error("O nome do fluxograma deve conter ao menos 4 caracteres.", 2000);
            }
        };
    },

    _flowchartTabsClick: function() {
        var that = this;
        flowCache.$flowchartTab.on("click", "a.flowchart-tab", function(event) {
            var fHandler = flow.FlowchartHandler;

            var $activeTab = fHandler.getActiveFlowchartTab$();

            if (event.target === event.currentTarget && $activeTab[0] !== event.target) {
                that.lastClickedConnection = {}; //TODO

                var $clickedTab = $(event.target);

                fHandler.closeOpenFlowchart();

                $clickedTab.addClass("active");

                var flowchartDatabaseId = $clickedTab.attr("data-flow-id");

                var flowchartName = $clickedTab.prop("id").replace(flowchartDatabaseId + "-tab-link", "");

                fHandler.appendFlowchartToDOM(flowchartName, flowchartDatabaseId);

                fHandler.loadFlowchart();
            }
        });
    },

    _flowchartRemoveTabClick: function() {
        flowCache.$flowchartTab.on("click", "a.flowchart-tab i.remove", function(event) {
            var $tab = $(this.parentNode);
            if ($tab.attr("data-flow-id") === $(".flowchart.active").attr("data-flow-id")) {
               flow.FlowchartHandler.closeOpenFlowchart();
            }
            $tab.remove();
        });
    },

    _refreshConsoleIconClick: function() {
        $("#refresh-content").on("click", function() {
            flow.UI.cleanConsoleContent();
        });
    },

    _executeButtonClick: function() {
        flowCache.$executeButton.on("click", function() {
            if (!$(this).hasClass("disabled")) {
                flow.ExecutionHandler.triggertExecution();
            }
        });
    },

    _debugButtonClick: function() {
        flowCache.$debugButton.on("click", function() {
            if (!$(this).hasClass("disabled") && flow.ExecutionHandler.triggerDebug()) {
                var ui = flow.UI;
                ui.enableDebugNextButton();
                ui.disableDebugButton();
                ui.enableDebugStopButton();
            }
        });
    },

    _debugNextClick: function() {
        $("#debug-next").on("click", function() {
            if (!$(this).hasClass("disabled")) {
                flow.ExecutionHandler.executeNext();
            }
        });
    },

    _debugStopClick: function() {
        $("#debug-stop").on("click", function() {
            if (!$(this).hasClass("disabled")) {
                flow.ExecutionHandler.stopDebug();
            }
        });
    },

    _hideConsoleClick: function() {
        flowCache.$toggleConsoleButton.on("click", function() {
            flow.UI.toggleConsole();
        });
    },

    _flowchartLinkClicked: function() {
        var cache = flowCache;

        cache.$pagination.on("click", "a.paginated", function(event) {
            flowchartLinkClicked.call(this, event);
        });

        cache.$helpContent.on("click", ".help-example", function(event) {
            flowchartLinkClicked.call(this, event);
        });

        var flowchartLinkClicked = function(event) {
            event.preventDefault();
            var $flowchart = $(this);
            var id = $flowchart.attr("data-flow-id");
            var name = $flowchart.attr("data-flow-name");

            var $tabs = cache.$flowchartTab.find("a.flowchart-tab[data-flow-id='" + id + "']");

            var fHandler = flow.FlowchartHandler;
            if ($tabs.length === 0) {
                fHandler.closeOpenFlowchart();
                fHandler.appendFlowchartToDOM(name, id);
                fHandler.appendFlowchartTabToDOM(name, id);
                fHandler.loadFlowchart();
            }
            else if (id !== flow.FlowchartHandler.getActiveFlowchartDatabaseId()) {
                fHandler.closeOpenFlowchart();
                fHandler.appendFlowchartToDOM(name, id);
                $tabs.addClass("active");
                fHandler.loadFlowchart();
            }
            else {
                alertify.log("Fluxograma ja está aberto", "", 1000);
            }
        };
    },

    _paginationBarClick: function() {
        flowCache.$pagination.on("click", "#pagination-bar a", function(event) {
            event.preventDefault();

            var $button = (event.target.tagName.toLowerCase() === "a") ? $(event.target) : $(event.target.parentNode);

            if ($button.hasClass("disabled")) {
                return;
            }

            var href = $button.prop("href");
            var parameters = href.substring(href.indexOf("?")) + "&name=" + $("#own-flowchart-search").val();

            flow.FlowchartHandler.ajaxGetPaginationContent(parameters);
        });
    },

    _ownFlowchartSearch: function() {
        var timeoutSearch;
        var $searchDiv = flowCache.$ownFlowchartSearch.parent();

        $("#own-flowchart-search").on("keyup", function(event, ignoreTimeout) {
            var that = this;

            $searchDiv.addClass("loading");

            if (ignoreTimeout === true) {
                search(that.value);
                return;
            }
            else if (timeoutSearch) {
                clearTimeout(timeoutSearch);
            }

            // delay search casually the user will leave some time to type the search
            timeoutSearch = setTimeout(function() {
                search(that.value);
            }, 700);

        });

        var search = function(value) {
            var parameters = "?name=" + value;
            flow.FlowchartHandler.ajaxGetPaginationContent(parameters);
        };
    },

    _flowchartOpened: function() {
        var $flowchartContainer = flowCache.$flowchartContainer,
            fHandler = flow.FlowchartHandler;

        $flowchartContainer.on(fHandler.FLOWCHART_OPENED, function(event) {

            history.pushState(null, null, "/flowchart/load/" + fHandler.getActiveFlowchartDatabaseId());

            flow.UI.closeHelp();

            flow.State.cleanState();
            Pace.restart();

            setupElementSelection.call(event.target);

            var $flowchart = $(event.target);

            $flowchart.droppable({
                accept: '#shape-menu div.shape',
                drop: function(event, ui) {
                    var $draggedShape = $(ui.draggable);

                    if (!canCreateMore.call(this, $draggedShape)) {
                        flow.UI.displayFlowchartErrorMessage("Você não pode criar mais elementos deste tipo !");
                        return;
                    }

                    var shadowShape = ui.helper[0];
                    shadowShape.parentNode.removeChild(shadowShape);

                    var posTop = event.clientY + $flowchart.scrollTop();

                    var postLeft = event.clientX + $flowchart.scrollLeft();

                    var $clone = $draggedShape.clone();

                    $clone.css({
                        top: posTop - 70,
                        left: postLeft - 285
                    });

                    var $shape = new flow.Shape($clone);

                    $flowchart.append($shape);

                    flow.ShapeHandler.ajaxSave($shape[0], true);
                }
            });

        });

        var setupElementSelection = function() {
            var Selection = flow.ElementSelection;
            Selection.cleanAllSelections();
            Selection.idFlowchart = $(this).attr("data-flow-id");
        };

        var canCreateMore = function($shape) {
            var name = $shape.attr("data-flow-name");
            var maxAppearences = $shape.attr("data-max-appearences");
            var $existants = $(this).find("div.shape[data-flow-name='" + name + "']");
            return (maxAppearences === "-1" || $existants.length < maxAppearences) ? true : false;
        };
    },

    _flowchartUpdatedOrDeleted: function() {
        var $flowchartContainer = flowCache.$flowchartContainer,
            fHandler = flow.FlowchartHandler,
            $ownSearchInput = flowCache.$ownFlowchartSearch;

        $flowchartContainer.on(fHandler.FLOWCHART_DELETED, function() {
            flow.State.cleanState();
            $ownSearchInput.trigger("keyup", true);

            history.pushState(null, null, "/flowchart/");
        });

        $flowchartContainer.on(fHandler.FLOWCHART_UPDATED, function() {
            $ownSearchInput.trigger("keyup", true);
        });
    },

	_flowchartClosed: function() {
		flowCache.$flowchartContainer.on(flow.FlowchartHandler.FLOWCHART_CLOSED, function() {
            history.pushState(null, null, "/flowchart/");
		});
	}
};