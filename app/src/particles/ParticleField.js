var Class = require('klasse');
var vecmath = require('./math');

var ParticleField = new Class({
	   

    initialize: function() {
        this.points = [];
        this.radius = 100;
        this.friction = 0.99;

        
        this.gravity = vecmath.vec3();

        this.stiffness = 0.001;

        this.constraintSpring = 0.05;
        this.constraintFriction = 0.99;
        this.maxParticleSpeed = .5;
            
        this.constraintTimer = 0;
        this.constraintDelay = 1000;
        this.accuracy = 2;

        this.moveInfluence = 50;
        this._moveInfluenceSq = this.moveInfluence*this.moveInfluence;

        this.constraintTear = 0;
        this._constraintTearSq = this.constraintTear * this.constraintTear;
    },

    applyMotion: function(point, force) {
        for (var i=0; i<this.points.length; i++) {
            var p = this.points[i];

            point.z = p.z;
            // console.log(point, p);
            var moveDistSq = vecmath.distanceSq(p, point);

            // console.log(moveDistSq, this._moveInfluenceSq)
            if (moveDistSq < this._moveInfluenceSq) {
                p.vx += force.x;
                p.vy += force.y;
                p.vz += force.z;
            }
        }
    },

    applyForce: function(x, y, z) {
        for (var i=0; i<this.points.length; i++) {
            var p = this.points[i];
            p.vx += x;
            p.vy += y;
            p.vz += z;
        }
    },

    solveConstraints: function(p, constraints) {
        var spring = this.constraintSpring;
        var springFriction = this.constraintFriction;
        var i = constraints.length;
        while (i--) { //in reverse so we can pop safely
            var c = constraints[i];

            var dx = c.x - p.x;
            var dy = c.y - p.y;
            var dz = c.z - p.z;

            var distanceSq = dx * dx + dy * dy + dz * dz;

            if (this._constraintTearSq !== 0
                    && distanceSq > this._constraintTearSq) {
                constraints.pop();
                continue;
            }
            
            var d = Math.sqrt(distanceSq);

            //ratio for resting distance
            var restingRatio = d===0 
                    ? p.restingDistance : (p.restingDistance - d) / d;

            //invert mass quantities
            var im1 = 1.0 / p.mass;
            var im2 = 1.0 / c.mass;
            var scalarP1 = (im1 / (im1 + im2)) * this.stiffness;
            var scalarP2 = this.stiffness - scalarP1;

            c.vx *= springFriction;
            c.vy *= springFriction;
            c.vz *= springFriction;

            //push/pull based on mass
            p.vx -= dx * scalarP1 * restingRatio * spring;
            p.vy -= dy * scalarP1 * restingRatio * spring;
            p.vz -= dz * scalarP1 * restingRatio * spring;

            c.vx += dx * scalarP2 * restingRatio * spring;
            c.vy += dy * scalarP2 * restingRatio * spring;
            c.vz += dz * scalarP2 * restingRatio * spring;
        }
    },

    update: function(dt) {
        this.time += dt;

        var points = this.points;

        //every delay, N particles will have their constraints mixed
        this.constraintTimer += dt;
        // console.log(this.constraintTimer,this.constraintDelay);
        if (this.constraintTimer > this.constraintDelay) {
            this.constraintTimer = 0;
            

            // var N = 50;
            // for (var i=0; i<N; i++) {
            //     var p = points[i];
                
            //     //get a random point
            //     var c = points[ ~~(Math.random()*points.length) ];
            //     //if we found a new point...
            //     if (c && c!==p) {
            //         // //delete both constraints
            //         p.constraints.length = 0;
            //         c.constraints.length = 0;

            //         p.constraints.push(c);
            //         c.constraints.push(p);
            //     }
                
            // }
        }

       
        var steps = this.accuracy;
        while (steps--) {
            for (var i=0; i<points.length; i++) {
                var p = points[i];
                var c = p.constraints;

                //Pull this particle close to its attached constraints
                this.solveConstraints(p, c);
            }
        }

        for (var i=0; i<points.length; i++) {
            var p = points[i];

            p.vx += this.gravity.x;
            p.vy += this.gravity.y;
            p.vz += this.gravity.z;


            p.vx *= this.friction;
            p.vy *= this.friction;
            p.vz *= this.friction

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.z += p.vz * dt;


        }
        // console.log(p.size, vel)

            // console.log(p.life, ((p.totalLife-p.life)/p.totalLife));

    },

    populate: function() {
        var points = this.points;
        points.length = 0;


        // this.restingDistance = this.radius;
        var N = 50;
        for (var i=0; i<N; i++) {
            // var phi = vecmath.random(0, Math.PI*2);
            // var costheta = vecmath.random(-1, 1);
            // var u = vecmath.random();
            
            var phi = i/N * Math.PI*2;
            // var costheta = vecmath.random(-.1, .1);
            var costheta = i/N;

            var theta = Math.acos(costheta);
            var r = this.radius;

            var x = r * Math.sin(theta) * Math.cos(phi);
            var y = r * Math.sin(theta) * Math.sin(phi);
            var z = r * Math.cos(theta);

            var constraints = [];
            var p = {
                mass: 1.0,
                x: x,
                y: y,
                z: z,
                vx: 0,
                vy: 0,
                vz: 0,
                speed: 1.0,
                constraints: constraints,
                restingDistance: 100
            };

            if (i>1) {
                var c = points[points.length-2];
                constraints.push( c );
            }
            // if (i>0) {
            //     var c = points[ ~~(Math.random()*points.length) ];
            //     if (c) {
            //         constraints.push(c);
            //     }
            // }
            // var p = points[ ~~(points.length-1) ];
            // if (p && p.constraints.length===0)
            //     constraints.push( p );

            
            points.push(p);

            if (c) {
                c.constraints.push(p)
            }
        }
    }
});

module.exports = ParticleField;