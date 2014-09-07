"use strict";

Flow.Templates = {

    flowchartSuccessOnSaveMessage: "Fluxograma salvo",
    flowchartErrorOnSaveMessage: "Ocorreu durante a tentativa de salvar o fluxograma",
    flowchartInfoOnSaveMessage: "Salvando fluxograma...",

    getFlowchartTemplate: function(name, idFromDatabase) {
        return "<div id='" + name + idFromDatabase + "' data-flow-name='" + name + "' tabindex='-1' " +
            "class='flowchart ui active' data-flow-id='" + idFromDatabase + "' data-is-own='false'>" +
            "<span class='hidden-anchor'>Anchor</span>" +
            "<button id='toggle-settings' class='ui button black medium' title='Configuraćões do fluxograma'>" +
                "<i class='icon settings'></i>" +
            "</button>" +
        "</div>";
    },

    getTabTemplate: function(flowchartName, flowchartDatabaseId) {
        return "<a id='" + flowchartName + flowchartDatabaseId + "-tab-link' class='item active flowchart-tab'" +
            "data-flow-id='" + flowchartDatabaseId + "' title='" + flowchartName + "'>" + flowchartName +
            "<i class='remove icon red right'></i></a>";
    },

    getShapeConnector: function(posTop, posRight, posBottom, posLeft) {
        return "<img class='connector' style='right:" + posRight + "px; left: " +
            posLeft + "px; top:" + posTop + "px; bottom: " + posBottom + "px;'>";
    },

    getShapeInput: function(text) {
        return "<input type='text' value='" + text + "' maxlength='" + flow.Constants.INPUT_MAX_LENGTH + "'>";
    },

    getShapeCode: function(text) {
        return "<code>" + text + "</code>";
    },

    getConnectionEmptyInput: function(id) {
        return "<input id='" + id + "' type='text' class='connector-text' " +
            " maxlength='" + flow.Constants.INPUT_MAX_LENGTH + "' />";
    },

    getConnectionFilledInput: function(id, text, top, left) {
        return "<input id='" + id + "' type='text' value='" + text + "' class='connector-text' " +
            "style='top:" + top + "; left:" + left + ";' maxlength='" + flow.Constants.INPUT_MAX_LENGTH + "' />";
    },

    getConnectionPlainText: function(id, text, top, left) {
        return "<p id='" + id + "' class='connector-text' style='top:" + top + "; left:" + left + ";' >" +
            text +
        "</p>";
    },

    getConnectionSelect: function(id, top, left) {
        return "<select id='" + id + "' class='connector-text' style='top:" + top + "; left:" + left + ";'>" +
            "<option value='' selected='true'></option>" +
            "<option value='verdadeiro'>verdadeiro</option>" +
            "<option value='falso'>falso</option>" +
        "</select>";
    },

    getConnectionSelectWithTrueSelected: function(id, top, left) {
        return "<select id='" + id + "' class='connector-text' style='top:" + top + "; left:" + left + ";'>" +
            "<option value=''></option>" +
            "<option value='verdadeiro' selected='true'>verdadeiro</option>" +
            "<option value='falso'>falso</option>" +
        "</select>";
    },

    getConnectionSelectWithFalseSelected: function(id, top, left) {
        return "<select id='" + id + "' class='connector-text' style='top:" + top + "; left:" + left + ";'>" +
            "<option value=''></option>" +
            "<option value='verdadeiro'>verdadeiro</option>" +
            "<option value='falso' selected='true'>falso</option>" +
        "</select>";
    }
};