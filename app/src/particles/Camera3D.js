var vecmath = require('./math');
var Class = require('klasse');


var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var Camera3D = new Class({

	//TODO: if we decide to use this for all the 3D stuff we may 
	//want to use gl-matrix and true 3D transforms.

	initialize: function(x, y, w, h, focalLength){
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;

		//projection vector
		this.vpx = x + w / 2; 
		this.vpy = y + h / 2;
		
		this.focalLength = focalLength || 250;

		this.z = 0;

		this.rotation = {
			x: 0,
			y: 0,
			z: 0				
		};

		this.tmpVec = vec3.create();
		this.tmpVec2 = vec3.create();

		this.viewMatrix = mat4.create();
		this.tmpVec[2] = -10.;

		mat4.lookAt(this.viewMatrix, this.tmpVec,
					this.tmpVec2, vec3.fromValues(0, 1, 0)); 

		this.projectionMatrix = mat4.create();

		this.transformMatrix = mat4.create();
	},

	project2: function(position, out) {
		// var near = 0;
		// var far = 100;

		var halfWidth = this.width/2;
		var halfHeight = this.height/2;
		// var aspect = this.width/this.height;

		this.tmpVec[0] = position.x;
		this.tmpVec[1] = position.y;
		this.tmpVec[2] = position.z;


		mat4.multiply(this.transformMatrix, this.viewMatrix, this.projectionMatrix);

		vec3.transformMat4( this.tmpVec2, this.tmpVec, this.transformMatrix );

		out.x = this.tmpVec2[0] * this.width + this.width/2;
		out.y = -this.tmpVec2[1] * this.height + this.height/2;
		out.z = this.tmpVec2[2];
	},

	//Resizes the projection vector to the mid-point of the given stage size
	resize: function(w, h) {
		this.width = w;
		this.height = h;
		this.vpx = this.x + w / 2;
		this.vpy = this.y + h / 2;

		var aspect = this.width/this.height;
		mat4.perspective(this.projectionMatrix, 
						78 * vecmath.degRad,
						aspect, 0.01, 1);
	},

	scaleFromZ: function(z) {
		return this.focalLength / (this.focalLength + z);
	},

	//takes a vec3 world position (3D) and returns the 
	//2D screen-space position.
	//You can specify an `out` vec3 to avoid creating new objects. 
	//The returned vec3 also has the Z depth of the point, which you
	//should use for scaleFromZ to determine an element's new scale.
	project: function(position, out, rotation) {
		////// TODO move this method to math/util

		out = out || vecmath.vec3();

		//copy the vertex position to temp...
		out.x = position.x;
		out.y = position.y;
		out.z = position.z;

		//euler rotation in XYZ order
		var rot = rotation || this.rotation;
		if (rot.x)
			vecmath.rotateX(out, rot.x);
		if (rot.y)
			vecmath.rotateY(out, rot.y);
		if (rot.z)
			vecmath.rotateZ(out, rot.z);

		//apply translation
		out.z += this.z;

		//apply 3D perspective scaling
		var scale = this.scaleFromZ(out.z);

		out.x = this.vpx + out.x * scale;
		out.y = this.vpy + out.y * scale;

		return out;
	},

	//Takes a vec2 screen position and projects
	//it into 3D space, using the given z depth.
	unproject: function(x, y, z) {
		
	}
});

module.exports = Camera3D;