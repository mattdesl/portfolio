var Class = require('klasse');
var Signal = require('signals');

var View = new Class({
    
    initialize: 
    function View(parentContainer, data) {
        this.parentContainer = parentContainer;
        this.data = data;
        this.width = 0;
        this.height = 0;

        this.animatedIn = new Signal();
        this.animatedOut = new Signal();
        this.created = new Signal();
        this.destroyed = new Signal();
    },

    setup: function() {

    },

    destroy: function() {

    },

    resize: function(width, height) {
        this.width = width;
        this.height = height;
    },

    animateIn: function() {
        this.animatedIn.dispatch();
    },

    animateOut: function() {
        this.animatedOut.dispatch();
    },
});

module.exports = View;