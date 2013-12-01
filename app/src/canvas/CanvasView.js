var Class = require('klasse');
var Signal = require('signals');
var View = require('../framework/View');

var CanvasView = new Class({
    
    Extends: View,

    initialize: 
    function CanvasView(parentContainer, data) {
        View.call(this, parentContainer, data);
    },

    setup: function() {

    },

    destroy: function() {

    },

    render: function(context, dt) {
        //renders a frame !
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