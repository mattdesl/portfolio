// TODO: merge with
// https://github.com/mattdesl/minimath/

// we are using objects here for compatibility with PIXI.Point
var distanceSq = function(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	
	if ( (p1.z===0 || p1.z) && (p2.z===0 || p2.z) ) {
		var dz = p2.z - p1.z;
		return dx * dx + dy * dy + dz * dz;		
	} else {
		return dx * dx + dy * dy;
	}
};

var lengthSq = function(vec) {
	if (vec.z===0||vec.z) {
		return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
	} else
		return vec.x * vec.x + vec.y * vec.y;
};

var length = function(vec) {
	return lengthSq(vec);
};

var MKS_TO_PIXELS = 50.0;
var PIXELS_TO_MKS = 1/MKS_TO_PIXELS;

module.exports = {
	
	/**
	 * Random number between two values.  
	 */
	random: function(start, end) {
		return start + Math.random() * (end - start);   
	},
	
	/** Utility function for linear interpolation. */
	lerp: function(v0, v1, t) {
		return v0*(1-t)+v1*t;
	},
	
	/** Utility function for Hermite interpolation. */
	smoothstep: function(v0, v1, t) {
		// Scale, bias and saturate x to 0..1 range
		t = Math.max(0.0, Math.min(1.0, (t - v0)/(v1 - v0) ));
		// Evaluate polynomial
		return t*t*(3 - 2*t);
	},
	
	/** pythagorean 3D, squared */
	distanceSq: distanceSq,

	/** pythagorean 3D */
	distance: function(p1, p2) {
		return Math.sqrt( distanceSq(p1, p2) );
	},

	/** Utility function to shuffle an array in place 
	(Fisher-Yates). */
	shuffle: function(array) {
		var counter = array.length, temp, index;
	
		// While there are elements in the array
		while (counter--) {
			// Pick a random index
			index = (Math.random() * counter) | 0;
	
			// And swap the last element with it
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}
	
		return array;
	},

	/** Returns a light-weight object with X and Y. params are optional. */
	vec2: function(x, y) {
		return { x: x||0, y: y||0 };
	},

	vec3: function(x, y, z) {
		return { x: x||0, y: y||0, z: z||0 };
	},

	rotateX: function (vec3, angleX) {
		var cosX = Math.cos(angleX),
			sinX = Math.sin(angleX),
			y1 = vec3.y * cosX - vec3.z * sinX,
			z1 = vec3.z * cosX + vec3.y * sinX;
		vec3.y = y1;
		vec3.z = z1;
	},
	   
	rotateY: function (vec3, angleY) {
		var cosY = Math.cos(angleY),
			sinY = Math.sin(angleY),
			x1 = vec3.x * cosY - vec3.z * sinY,
			z1 = vec3.z * cosY + vec3.x * sinY;
		vec3.x = x1;
		vec3.z = z1;
	},

	rotateZ: function (vec3, angleZ) {
		var cosZ = Math.cos(angleZ),
			sinZ = Math.sin(angleZ),
			x1 = vec3.x * cosZ - vec3.y * sinZ,
			y1 = vec3.y * cosZ + vec3.x * sinZ;
		vec3.x = x1;
		vec3.y = y1;
	},

	//normalizes a vec2 or vec3 into unit vector
	normalize: function(vec) {
		var len = length(vec);
		if (len !== 0) {
			vec.x /= len;
			vec.y /= len;
			if (vec.z===0 || vec.z)
				vec.z /= len;
		}
	},

	/**
	 * Copies vector from a to b. Assumes both
	 * types are the same (vec3 or vec2).
	 *
	 * Returns vecout.
	 */
	copy: function(vecin, vecout) {
		vecout.x = vecin.x;
		vecout.y = vecin.y;
		if ( (vecout.z===0 || vecout.z) && (vecin.z===0 || vecin.z) ) {
			vecout.z = vecin.z;
		}
		return vecout;
	},
	
	lengthSq: lengthSq,
	length: length,

	//Converting MKS units to pixels, for physics calculations...
	MKStoPixels: MKS_TO_PIXELS,
	pixelsToMKS: PIXELS_TO_MKS,

	radDeg: (180.0 / Math.PI),
	degRad: (Math.PI / 180.0)
};