var Class = require('klasse');
var CanvasView = require('../framework/View');
var Widget = require('../ui/Widget');
var settings = require('../core/settings');

var assets = require('./assets');

///////////
//Here we add any assets that our view needs.
var vignette = assets.load("images/vignette.png");


var NOISE_FRAMES = 4;
var noiseImages = new Array(NOISE_FRAMES);
for (var i=0; i<NOISE_FRAMES; i++) {
    noiseImages[i] = assets.load("images/noise"+i+".png");
}
//////////

var Background = new Class({

    Extends: CanvasView,
	
    setup: function() {
        this.vignette = vignette;
        this.time = 0;

        this.noiseImages = noiseImages;
        this.noisePatterns = new Array(NOISE_FRAMES);
        
        this.noiseFrame = 0;
        this.noiseDuration = 40; 
        this.noiseTimer = 0;

        this.alpha = 0.0;

        this.created.dispatch();
    },

    destroy: function() {
        this.vignette = null;
        this.noiseImages.length = 0;
        this.noisePatterns.length = 0;
        this.destroyed.dispatch();
    },

    resize: function(width, height) {
        this.width = width;
        this.height = height;
    },

    drawNoise: function(context, i) {
        // console.log(this.noiseImages[i]);
        if (!this.noiseImages[i])
            return;

        var img = this.noiseImages[i];

        if (!this.noisePatterns[i]) {
            this.noisePatterns[i] = context.createPattern(img, "repeat");
        }
        
        // context.globalAlpha = Math.max(0.5, Math.sin(this.time * Math.random()));
        context.globalAlpha = 0.6 * this.alpha;
        context.fillStyle = this.noisePatterns[i];
        context.fillRect(0, 0, this.width, this.height);
    },

    render: function(context, dt) {
        this.time += dt;

        this.noiseTimer += dt;
        if (this.noiseTimer > this.noiseDuration) {
            this.noiseTimer = 0;
            this.noiseFrame = (this.noiseFrame + 1) % this.noiseImages.length;
        }  
        this.drawNoise(context, this.noiseFrame);

        // context.fillStyle = "red";
        // context.fillRect(0,0,this.width,this.height);
        if (this.vignette) {
            context.save();
            var anim = Math.sin(this.time / 1000);

            var sc = 2.0 + anim*0.25;
            // context.globalAlpha = 1.0 - (anim / 2 + 0.5)*0.25;
            context.globalAlpha = this.alpha;

            //TODO: This could be optimized with a sprite sheet of pre-flipped vignettes
            context.drawImage(this.vignette, 0, 0, this.vignette.width*sc, this.vignette.height*sc);

            context.translate(this.width, 0);
            context.rotate(90*Math.PI/180);
            context.drawImage(this.vignette, 0, 0, this.vignette.width*sc, this.vignette.height*sc);            
            
            context.translate(this.height, 0);
            context.rotate(90*Math.PI/180);
            context.drawImage(this.vignette, 0, 0, this.vignette.width*sc, this.vignette.height*sc);            
            
            context.translate(this.width, 0);
            context.rotate(90*Math.PI/180);
            context.drawImage(this.vignette, 0, 0, this.vignette.width*sc, this.vignette.height*sc);            
            
            context.restore();
        }
    }

});

module.exports = Background;