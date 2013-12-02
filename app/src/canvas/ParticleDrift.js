var Class = require('klasse');

var CanvasView = require('../framework/View');
var settings = require('../core/settings');

var assets = require('./assets');
var Background = require('./Background');
var ParticleField = require('../particles/ParticleField');

var vecmath = require('../particles/math');
var Camera3D = require('../particles/Camera3D');


var particle = assets.load("images/particle1.png");

var ParticleDrift = new Class({

    Extends: CanvasView,
	
    setup: function() {
        this.background = new Background(this.manager, this.parentContainer, this.data);
        this.background.setup();

        this.field = new ParticleField();
        this.field.populate();

        this.camera = new Camera3D(0, 0, this.width, this.height, 500);

        //temporary 3D vector
        this.tmpVec = vecmath.vec3();
        this.tmpVec2 = vecmath.vec3();
        this.deviceRotation = vecmath.vec3();
        this.emptyVec = vecmath.vec3();

        this.created.dispatch();

        if (settings.isMobile && window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function(ev) {
                var a = ev.alpha;
                var b = ev.beta;
                var g = ev.gamma;

                this.deviceRotation.x = b * vecmath.degRad;
                this.deviceRotation.y = -g * vecmath.degRad;
            }.bind(this));
        } 

        this.lastMouse = null;
        this.mouse = vecmath.vec2();

        $(window).on("mousemove touchmove", function(ev) {
            this.mouse.x = ev.clientX;
            this.mouse.y = ev.clientY;

            if (this.lastMouse) {
                var dx = this.lastMouse.x - this.mouse.x;
                var dy = this.lastMouse.y - this.mouse.y;

                var out = this.tmpVec,
                    tmp = this.tmpVec2;
                tmp.x = this.mouse.x - this.width;
                tmp.y = this.mouse.y - this.height;
                tmp.z = 0;
                this.camera.project(tmp, out, this.emptyVec);

                this.field.applyMotion(out, vecmath.vec3(-dx*0.005, -dy*0.005, 0));

            } else 
                this.lastMouse = vecmath.vec2();
            
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
        }.bind(this));
    },

    destroy: function() {
        this.background.destroy();        
        this.destroyed.dispatch();
    },

    resize: function(width, height) {
        this.width = width;
        this.height = height;
        this.background.resize(width, height);

        this.field.radius = 100;//Math.min(width, height)*.2;
        this.field.populate();
        this.camera.resize(width, height);
    },

    render: function(context, dt) {

        if (settings.isMobile) {
            this.camera.rotation.x = this.deviceRotation.x;
            this.camera.rotation.y = this.deviceRotation.y;
        } else {
            this.camera.rotation.y += (dt * 0.005) * vecmath.degRad;
            // this.camera.rotation.x += (dt * 0.005) * vecmath.degRad;
        }

        this.background.render(context, dt);

        this.field.update(dt);
        var points = this.field.points;
        var out = this.tmpVec;

        context.fillStyle = context.strokeStyle = "white";
        context.globalAlpha = 0.05;
        context.beginPath();
        for (var i=0; i<points.length; i++) {
            var p = points[i];

            // if (p.z < -this.camera.focalLength) {
                var scale = this.camera.scaleFromZ(p.z);
                this.camera.project(p, out);

                // console.log(out.x);
                var size = 2 * scale;
                context.drawImage(particle, out.x-size/2, out.y-size/2, size, size);
            // }

            for (var n=0; n<p.constraints.length; n++) {
                var c = p.constraints[n];

                var maxDist = 250;
                var dstSq = vecmath.distanceSq( p, c );
                if (dstSq > maxDist*maxDist)
                    continue;

                
                context.moveTo(out.x, out.y);
                
                this.camera.project(c, out);

                context.lineTo(out.x, out.y);
                
            }
            // context.fillRect(out.x-size/2, out.y-size/2, size, size);
        }
        context.stroke();


        var size = 4;
        // out.x = this.field.mouse.x;
        // out.y = this.field.mouse.y;
            
        // var tmp = vecmath.vec3();
        // tmp.x = this.field.mouse.x - this.width/2;
        // tmp.y = this.field.mouse.y - this.height/2;
        // tmp.z = 0;
        // this.camera.project(tmp, out, vecmath.vec3());

        // context.globalAlpha = 1.0;
        // context.fillRect(out.x-size/2, out.y-size/2, size, size);
    },

    animateIn: function() {
        TweenLite.to(this.background, 1.0, {
            alpha: 1.0,
            onComplete: this.animatedIn.dispatch
        });
    }

});

module.exports = ParticleDrift;