var CanvasView = require('./CanvasView');
var ViewManager = require('../framework/ViewManager');
var Widget = require('../ui/Widget');
var Class = require('klasse');

var CanvasManager = new Class({

	Extends: ViewManager,

    initialize: function(parentContainer, model, screens) {
        ViewManager.call(this, parentContainer, model, screens);

        this.canvas = new Widget("<canvas>").absolute().position(0, 0);
        parentContainer.append(this.canvas);

        this.context = this.canvas[0].getContext("2d");

        this._render = this.render.bind(this);

        this.frameID = null;
    },

    start: function() {
        this.frameID = requestAnimationFrame(this._render);
    },

    stop: function() {
        if (this.frameID) {
            cancelAnimationFrame(this.frameID);
            this.frameID = null;
        }
    },

    destroy: function() {
        if (this.canvas) {
            this.canvas.detach();
            this.canvas = null;    
        }
    },

    resize: function(width, height) {
        ViewManager.prototype.resize.call(this, width, height);
        this.canvas[0].width = width;
        this.canvas[0].height = height;
    },

    render: function() {
        this.frameID = requestAnimationFrame(this._render);
        
        var context = this.context;
                
        context.clearRect(0, 0, this.width, this.height);
        if (this.view && this.view.render) {
            this.view.render( context, 1/60  );
        }
    }
})

module.exports = CanvasManager;