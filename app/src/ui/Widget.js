var Class = require('klasse');

var Widget = new Class({

	Extends: $.fn.init,
	
	cachedWidth: 0,
	cachedHeight: 0,
	cachedX: 0,
	cachedY: 0,

	initialize: 
	function Widget(element, context) {
		if (!element)
			element = "<div>";
		// Not needed as long as we patch up the parent() method
		$.fn.init.call(this, element, context);
	},
	
	/**
		Convenience method to set css position to absolute.

		Returns this for chaining.
	*/
	absolute: function() {
		return this.css("position", "absolute");
	},

	/**
		Convenience method to set css position to relative.

		Returns this for chaining.
	*/
	relative: function() {
		return this.css("position", "relative");
	},

	/** 
		Convenience method to set the top and left CSS position. The optional 'positionProp' 
		parameter can set the CSS position property, such as "relative" or "absolute".

		If no arguments are given, this method acts like jQuery's position() method.

		The position will be cached if it is given, and stored in cachedX / cachedY.

		Returns this for chaining.
	 */
	position: function(x, y, positionProp) {	
		if (typeof x === "undefined" && typeof y === "undefined" && !positionProp) {
			return this.parent();
		}

		if (x || x===0) {
			this.css("left", x);
			this.cachedX = x;
		}
		if (y || y===0) {
			this.css("top", y);
			this.cachedY = y;
		}
		if (positionProp)
			this.css("position", positionProp);
		return this;
	},

	/**
		Convenience method to set the width and height CSS.

		If no width and height is specified, this method returns an object with width and height values,
		each attained via jQuery's width() and height() methods. Note that this may cause a page refresh,
		and should be used sparingly. Widget includes cached values for top, left, width, and height which
		are more optimal.

		Like Widget.position(), the size will be cached if it is specified, in cachedWidth and cachedHeight.

		Returns this for chaining.

		NOTE: This completely replaces the original jQuery size() method, which is deprecated as of jQuery 1.8.

		NOTE 2: jQuery's width() and height() methods are not the same as outerWidth() and outerHeight().
		 		Often you will want to use the latter instead. In that case, look at Widget.cacheSize() utility.
	*/
	size: function(width, height) {
		if (typeof width === "undefined" && typeof height === "undefined") {
			return { width: this.width(), height: this.height() };
		}

		if (width || width===0) {
			this.css("width", width);
			this.cachedWidth = width;
		}
		if (height || height===0) {
			this.css("height", height);
			this.cachedHeight = height;
		}
		return this;
	},

	/** 
		Utility function to center this div by making
		top, left, bottom and right all zero,
		and setting the margin to auto + absolute positioning.
	*/
	//TODO: may be better suited in a Utils class...
	center: function() {
		return this.absolute().css({
            top: 0, 
            left: 0,
            bottom: 0,
            right: 0,
            margin: "auto"
        });
	},

	/** Utility function to set the "background-color" CSS. Returns this for chaining. */
	bg: function(backgroundCSS) {
		return this.css("background-color", backgroundCSS);
	},

	/** Utility function to set the "color" CSS. Returns this for chaining. */
	fg: function(foregroundCSS) {
		return this.css("color", foregroundCSS);
	}

});

module.exports = Widget;