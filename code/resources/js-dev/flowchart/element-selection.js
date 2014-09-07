"use strict";

Flow.ElementSelection = {

    _lastSelectedElement: [], // [{connection|shape: data}]

    cleanAllSelections: function() {
        this._lastSelectedElement = [];
    },

    hasSelectedElement: function() {
        return (this._lastSelectedElement.length > 0) ? true : false;
    },

    pushSelectedShape: function(shape) {
        this._lastSelectedElement.push({shape: shape});
    },

    pushSelectedConnection: function(connection) {
        this._lastSelectedElement.push({connection: connection});
    },

    popLastSelectedElement: function() {
        return this._lastSelectedElement.pop();
    },

    getLastSelectedElement: function() {
        var last = this._lastSelectedElement.pop();
        this._lastSelectedElement.push(last);
        return last;
    }

};