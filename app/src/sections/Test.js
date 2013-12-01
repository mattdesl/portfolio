var Class = require('klasse');
var View = require('../framework/View');
var Widget = require('../ui/Widget');
var settings = require('../core/settings');

var Test = new Class({

    Extends: View,
	
    setup: function() {
        
        this.created.dispatch();
    },

    destroy: function() {

        this.destroyed.dispatch();
    },

    // resize: function(width, height) {
    //     this.width = width;
    //     this.height = height;

    //     var TARGET_WIDTH = 800;
    //     var TARGET_HEIGHT = 500;

    //     var scale = Math.min(1.0, Math.min(width / settings.TARGET_WIDTH, height / settings.TARGET_HEIGHT));

    //     this.header.position(undefined, scale * 140 - HEADER_PADDING);
    //     this.header.css("font-size", Math.round(settings.HEADER_SIZE * scale) + "px");
    // },

    // animateIn: function() {
    //     var startDelay = 0.2;
        
    //     ////// Animate in the header content
    //     TweenLite.fromTo(this.header0, 0.5, {
    //         top: -50,
    //     }, {
    //         top: 0,
    //         delay: startDelay,
    //         ease: Expo.easeOut
    //     });        

    //     TweenLite.fromTo(this.header1, 0.5, {
    //         top: -50,
    //     }, {
    //         top: 0,
    //         delay: 0.1 + startDelay,
    //         ease: Expo.easeOut
    //     });

    //     this.animatedIn.dispatch();
    // },

    // animateOut: function() {
    //     ////// Animate in the header content
    //     TweenLite.fromTo(this.header0, 0.5, {
    //         top: 0,
    //     }, {
    //         top: -50,
    //         delay: 0.1 + startDelay,
    //         ease: Expo.easeOut
    //     });        

    //     TweenLite.fromTo(this.header1, 0.5, {
    //         top: 0,
    //     }, {
    //         top: -50,
    //         ease: Expo.easeOut
    //     });

    //     this.animatedOut.dispatch();
    // },

});

module.exports = Test;