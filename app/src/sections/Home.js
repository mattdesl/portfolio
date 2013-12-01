var Class = require('klasse');
var View = require('../framework/View');
var Widget = require('../ui/Widget');
var settings = require('../core/settings');
var Button = require('../ui/Button');


var Home = new Class({

    Extends: View,
	
    setup: function() {
        this.header = new Widget().addClass("header");
        
        var headerData = this.data.header;

        this.header.size("100%");
        this.header.absolute();
        this.header.css({
            overflow: "hidden",
            fontSize: settings.HEADER_SIZE
        });

        //setup text
        this.header0 = new Widget("<span>").text( headerData[0] ).relative();
        this.header1 = new Widget("<span>").text( headerData[1] ).relative();

        this.header.append(this.header0, this.header1);


        this.parentContainer.append(this.header);


        this.setupButtons();

        this.created.dispatch();
    },

    destroy: function() {

        this.header.detach();
        this.buttonContainer.detach();
        this.destroyed.dispatch();
    },

    resize: function(width, height) {
        this.width = width;
        this.height = height;

        var scale = Math.min(1.0, Math.min(width / settings.TARGET_WIDTH, height / settings.TARGET_HEIGHT));



        this.headerSize = Math.max(32, Math.round(settings.HEADER_SIZE * scale));
        
        var btnMidY = (height - this.buttonContainerHeight)/2; 

        var pad = 40;
        var min = 30;
        var btnY = Math.max(pad*2, btnMidY);
        var headerY = Math.max(min, btnMidY - this.headerSize - pad);



        // if (height < 640) {
        //     // this.headerSize = 25;
        //     var off = 20;
        //     btnY = btnMidY + off;
        //     headerY = btnMidY - off;
        // }

        this.header.css("font-size", this.headerSize + "px");

        this.buttonContainer.position(undefined, btnY);
        this.header.position(undefined, headerY);

    },

    animateIn: function() {
        var startDelay = 0.2;
        
        ////// Animate in the header content
        TweenLite.fromTo(this.header0, 0.65, {
            top: -this.headerSize,
        }, {
            top: 0,
            delay: startDelay,
            ease: Expo.easeOut
        });        

        TweenLite.fromTo(this.header1, 0.65, {
            top: -this.headerSize,
        }, {
            top: 0,
            delay: 0.1 + startDelay,
            ease: Expo.easeOut,
        });

        startDelay += 0.5;
        for (var i=0; i<this.buttons.length; i++) {
            var btn = this.buttons[i];

            
            var to = {
                delay: startDelay += 0.2,
                opacity: 1.0,
                // ease: Expo.easeOut
            };
            if (i===this.buttons.length-1) {
                to['onComplete'] = this.animatedIn.dispatch;
            }

            if (settings.isMobile) {
                to['onStart'] = btn.animateInButton.bind(btn);
            } else {
                btn.ignoreTextEffect = true;
                TweenLite.delayedCall(1.75 + startDelay, function(selfBtn) {
                    selfBtn.ignoreTextEffect = false;
                }.bind(this, btn));
                to['onStart'] = btn.animateIn.bind(btn, 0.0, 1.75);
            }

            TweenLite.fromTo(btn, 1, {
                opacity: 0.0
            }, to);
        }
    },

    animateOut: function() {
        TweenLite.to(this.buttonContainer, 0.5, {
            opacity: 0.0,
            ease: Expo.easeOut
        });

        ////// Animate out the header content
        TweenLite.fromTo(this.header0, 0.5, {
            top: 0,
        }, {
            top: -this.headerSize,
            delay: 0.1,
            ease: Expo.easeOut,
            onComplete: this.animatedOut.dispatch
        });        

        TweenLite.fromTo(this.header1, 0.5, {
            top: 0,
        }, {
            top: -this.headerSize,
            ease: Expo.easeOut
        });
    },

    setupButtons: function() {
        this.buttons = [];
        this.buttonContainer = new Widget();
        this.buttonContainer.css({
            display: "inline-block",
            width: "100%",
            textAlign: "center"
        });
        this.buttonContainer.absolute();

        var height = 0;
        var buttonData = this.data.buttons;
        for (var i=0; i<buttonData.length; i++) {
            var data = buttonData[i];

            var btn = new Button(data.icon, data.text);

            height += btn.buttonSize;
            if (i !== buttonData.length-1)
                height += btn.padding;

            this.buttons.push(btn);
            this.buttonContainer.append(btn);
        }
        this.buttonContainerHeight = height;

        this.parentContainer.append(this.buttonContainer);
    }

});

module.exports = Home;