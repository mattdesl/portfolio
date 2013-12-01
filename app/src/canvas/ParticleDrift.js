var Class = require('klasse');
var CanvasView = require('../framework/View');
var Widget = require('../ui/Widget');
var settings = require('../core/settings');


var ParticleDrift = new Class({

    Extends: CanvasView,
	
    setup: function() {
        
        this.created.dispatch();
    },

    destroy: function() {

        this.destroyed.dispatch();
    },

    render: function(context, dt) {
        context.fillStyle = "red";
        context.fillRect(50, 50, 25, 10);
        // console.log("RE");
    }

});

module.exports = ParticleDrift;