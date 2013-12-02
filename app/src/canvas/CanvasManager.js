var CanvasView = require('./CanvasView');
var ViewManager = require('../framework/ViewManager');
var Widget = require('../ui/Widget');
var Class = require('klasse');
var settings = require('../core/settings');

var CanvasManager = new Class({

	Extends: ViewManager,

    initialize: function(parentContainer, model, screens) {
        ViewManager.call(this, parentContainer, model, screens);

        this.canvas = new Widget("<canvas>").absolute().position(0, 0);
        parentContainer.append(this.canvas);

        // if (settings.isMobile)
        //     this.canvas.css("transform", "scaleX(0.5) scaleY(0.5)");

        this.context = this.canvas[0].getContext("2d");

        this._render = this.render.bind(this);
        this.frames = 0;
        this.msSum = 0;
        this.then = Date.now();
        this.prevTime = Date.now();

        this.frameID = null;

        this.framerate = 30;
        this.minFramerate = 1000 / this.framerate;
        this.targetFramerate = 1000 / this.framerate;

        this.logFPS = false;

        this.setupRetina();
        
        $(document).keydown(function(ev) {
            if (ev.which === 70 || ev.which === 102)
                this.logFPS = !this.logFPS;
        }.bind(this));
    },

    setupRetina: function(width, height) {
        var context = this.context;
        var canvas = this.canvas[0];
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio ||
                                context.mozBackingStorePixelRatio ||
                                context.msBackingStorePixelRatio ||
                                context.oBackingStorePixelRatio ||
                                context.backingStorePixelRatio || 1,
            ratio = devicePixelRatio / backingStoreRatio;

        canvas.width = width;
        canvas.height = height;
        if (devicePixelRatio !== backingStoreRatio) {
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            context.scale(ratio, ratio);
        }
        this.scaleRatio = ratio;
    },

    start: function() {
        this.then = Date.now();
        this.frames = 0;
        this.msSum = 0;
        this.prevTime = Date.now();
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
        // this.canvas[0].width = width;
        // this.canvas[0].height = height;

        this.setupRetina(width, height);
    },

    render: function() {
        var startTime = Date.now();

        this.frameID = requestAnimationFrame(this._render);
        
        var delta = startTime - this.then;
        if (delta > this.minFramerate)
            delta = this.minFramerate;

        this.then = startTime;

        var context = this.context;
                
        context.clearRect(0, 0, this.width, this.height);
        if (this.view && this.view.render) {
            this.view.render( context, delta );
        }
        
        var endTime = Date.now();
        var ms = Math.max(0, endTime - startTime);
        this.msSum += ms;

        this.frames++;
        // console.log(startTime, this.prevTime);
        if (startTime > this.prevTime + 1000) {
            var fps = Math.round((this.frames * 1000) / (startTime - this.prevTime));
            var avgMS = (this.msSum / this.frames)

            if (this.logFPS)
                console.log("fps: "+fps + ", avg MS: "+avgMS);

            this.msSum = 0;
            this.prevTime = startTime;
            this.frames = 0;
        }
    }
})

module.exports = CanvasManager;