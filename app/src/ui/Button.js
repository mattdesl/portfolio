var Widget = require('./Widget');
var Class = require('klasse');
var settings = require('../core/settings');

var SIZE_DESKTOP = 42;
var SIZE_MOBILE = SIZE_DESKTOP*1.25;

var ICON_SIZE = 16;
var BORDER_SIZE = 2;
var ICON_PADDING = 15;
var MOBILE_ICON_PADDING = 10;

var Button = new Class({
	   
    Extends: Widget,

    initialize: function(icon, text) {
        Widget.call(this);

        var iconName = icon;
        var scale = 1.0;
        this.buttonSize = SIZE_DESKTOP;
        this.padding = ICON_PADDING;
        this.idleAlpha = 0.2;
        if (settings.isMobile) {
            this.idleAlpha = 0.5;
            this.padding = MOBILE_ICON_PADDING;
            this.buttonSize = SIZE_MOBILE;
            iconName += (settings.isMobile ? "4x" : "");
            scale = 0.25;
        }

        this.ignoreTextEffect = false;
        this.ignoreHover = false;

        this.container = new Widget();
        this.container.size(this.buttonSize, this.buttonSize);
        this.container.css("display", "inline-block");

        this.relative();
        this.css("display", "block");
        this.css("margin", 10);
        this.css("overflow", "hidden");

        this.button = new Widget();
        this.button.size(this.buttonSize, this.buttonSize);
        this.button.center();

        this.borderIdle = BORDER_SIZE+"px rgba(255,255,255,0.1) solid";

        this.button.css({
            background: "rgba(0,0,0,0.20)",
            display: "inline-block",
            border: this.borderIdle,
            borderRadius: "3px",
            textAlign: "center",
            boxSizing: "border-box"
        });

        this.icon = new Widget().addClass("icons "+iconName);
        this.icon.css("pointer-events", "none");
        if (scale !== 1.0) {
            TweenLite.set(this.icon, {
                scale: scale,
                transformOrigin: "center center"
            });
        }
            
        var sz = (this.buttonSize-ICON_SIZE-BORDER_SIZE)/2;
        this.icon.center();

        this.label = new Widget();
        this.label.css({
            fontSize: "14px",
            opacity: this.idleAlpha,
            textTransform: "uppercase",
            verticalAlign: "middle",
            textAlign: "left",
            lineHeight: this.buttonSize+"px",
        }).addClass("bold noselect");

        this.label.text(text);
        this.label.position(this.buttonSize + this.padding, undefined).relative();

        this.container.append(this.button, this.icon, this.label);

        this.append(this.container);

        TweenLite.set(this.button, {
            opacity: 0
        });
        TweenLite.set(this.label, {
            y: -this.buttonSize
        });

        this.button.css("cursor", "pointer");

        //include the text on mobile..
        if (settings.isMobile) {
            var mobileWidth = 190;
            this.size(mobileWidth, undefined);
            this.container.size(mobileWidth, undefined);
            this.button.size("100%", undefined);
            this.icon.css("right", "auto");
            this.css("margin", "10px auto");
        }

        this.container.bind("click touchstart", function(ev) {
            TweenLite.fromTo(this.label, 2.0, {
                opacity: this.idleAlpha + 0.3
            }, {
                opacity: this.idleAlpha,
                ease: Expo.easeOut
            });

            if (!settings.isMobile)
                this.animateOutText(0.25);
        }.bind(this));

        this.button.mouseenter(function() {
            if (this.ignoreHover)
                return;
            this.animateInButton();
            if (!this.ignoreTextEffect) {
                this.animateInText();
            }
        }.bind(this));
        this.button.mouseleave(function() {
            if (this.ignoreHover)
                return;
            this.animateOutButton();
            if (!this.ignoreTextEffect) {
                this.animateOutText();
            }
        }.bind(this));

    },

    animateInButton: function(delay, killAfter, onKillComplete) {
        delay = delay || 0;

        if (settings.isMobile) {
            TweenLite.fromTo(this.button, 0.75, {
                scaleX: 0.0,
                opacity: 1.0,
                transformOrigin: "left center"
            }, {
                delay: delay,
                scaleX: 1.0,
                ease: Expo.easeOut,
                transformOrigin: "left center"
            });
        } else {
            TweenLite.to(this.button, 1., {
                opacity: 1.0,
                delay: delay,
                ease: Expo.easeOut,
                overwrite: 1
            });
        }

        if (killAfter) {
            this.animateOut(killAfter, onKillComplete);
        }
    },

    animateInText: function(delay, killAfter, onKillComplete) {
        delay = delay || 0;
        TweenLite.fromTo(this.label, 0.75, {
            y: -this.buttonSize
        }, {
            y: 0,
            delay: delay,
            ease: Expo.easeOut
        });

        if (settings.isMobile) {
            // TweenLite.fromTo(this.label, 0.5, {
            //     opacity: 0.0
            // }, {
            //     opacity: this.idleAlpha,
            //     delay: delay,
            //     ease: Expo.easeOut
            // });
        }

        if (killAfter) {
            this.animateOut(killAfter, onKillComplete);
        }
    },

    animateIn: function(delay, killAfter, onKillComplete) {
        this.animateInButton(delay, killAfter, onKillComplete);
        if (settings.isMobile) {
            delay = (delay||0) + 0.15;
        }
        this.animateInText(delay, killAfter);
    },

    animateOut: function(delay, onComplete) {
        this.animateOutButton(delay, onComplete);
        this.animateOutText(delay, onComplete);
    },

    animateOutButton: function(delay, onComplete) {
        delay = delay || 0;

        if (settings.isMobile) {
            TweenLite.to(this.button, 1, {
                delay: delay,
                scaleX: 0.0,
                ease: Expo.easeOut,
                transformOrigin: "left center"
            });
            TweenLite.to(this.icon, 0.5, {
                opacity: 0.0,
                ease: Expo.easeOut,
                delay: delay
            });
        } 

        TweenLite.to(this.button, 1.0, {
            opacity: 0.0,
            delay: delay,
            ease: Expo.easeOut,
            onComplete: onComplete
        });
    },

    animateOutText: function(delay, onComplete) {
        delay = delay || 0;
        TweenLite.to(this.label, 0.5, {
            y: -this.buttonSize,
            delay: delay,
            ease: Expo.easeOut,
            onComplete: onComplete
        });
    }

});

module.exports = Button;