var Class = require('klasse');
var CanvasView = require('../framework/View');
var Widget = require('../ui/Widget');

var assets = require('./assets');
var settings = require('../core/settings');

var AssetManager = require('assetloader');
var Signal = require('signals');

var Preloader = new Class({

    Extends: CanvasView,
    
    setup: function(onPreloadFinished) {
        console.log(assets)
        assets.loadAll( assets );
        // for (var i=0; i< 100; i++) {
        //     assets.load("test"+i+".png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpERjQ5QUU2RjNEMjA2ODExODhDNkNCNjMxRDc2RjgxMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBMTY1ODYxQzJGRUExMUUyOEMwOTk5MjNGNzE3MTFBNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBMTY1ODYxQjJGRUExMUUyOEMwOTk5MjNGNzE3MTFBNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NENFQjdDNDYyMjIwNjgxMThGNjJCODhCQkREMUY0RkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REY0OUFFNkYzRDIwNjgxMTg4QzZDQjYzMUQ3NkY4MTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7HOEyKAAAC2ElEQVR42ryXS2gTURSGZyZJJ22DKQrV+iyKYkGw+NgILnysFERc6FrduBIFwY1L1y5cunRRUJRuFAQVBNGFIOpCQfGFohat75omTWP8T/ivHA+TdJLMeOBrOsl9/HPOuefe63vxLQN2gJ1gC+gB60HI3wPV9reXoC0EZ8EEmAYVMku0wAyFCTngdzNxHpwCH8AP8IvEFdBHwlaTZJt8PwjGwEYO2o31cIxyVGiiBKwD58EKdvBVjN+DK+AamASPTNx9g+sXUMhPUGuldpCDfgSfyTfwFBxqwxsZur8fFMl8MGCS9Z8kkaQZBxuMd26Bg4x/OyZj9zKXPCW+zher26VzHIyaQc6B/R1M7iYqMfaeedGC9cAicJMuc0rl+fBcMYtpRYbEeaLOZV1zHjjCyZ3Jj0cTmtzjMq6Z8BRdCETZPrWuq+AMOyVlLhw5RSMhA5bXvGosS+2il7xNmcIlXujLsthUVUKOJ+h6axWVgDJfQf6sNo3ueOnZtHkOxQOL6QG3Il6mKKCq9gbf5UDBNPqaooBZWzGzVPU/Te+O9YDZqW0gxclz5rlRiF7TCzNkeYoC3Pkg5O7YEPDCNNqcogDr3ZIIuK/eXthqt8yETLJ+qfHAVMB1X1ENZWPalYKAJdye9QFmMmBxuKo8IGIOmPLcrclqW6vePuSh5+9uOGaq1AJwIkEBm8wLSal/pQ8kcr67bFbDKE9C3ZqcsIZN7N+6sOtkuwDemM676Yl8h27fDtaY7+Vg+izqTCg2BE6DeapszrA8XwJ3Y9x6ZMwR3pr62d9T+XVdF7+om8tKcJIiPDOAnJDvgcfgO3inhIuXVoFlnLhs+kv72+BLs1OxLRjHKKZqBnJLtmy22LL5rKh+n8CNiO245d1NkmUv2Mb/OxEgYXwIHjQ75MS5PEoo9jCmvS2EVNSn8IThKs2VMO1cz0eY1cN8uyEKmOCkkhPPuZpiHev+CDAAZiC5xaezp1gAAAAASUVORK5CYII=")
        // }
        
        assets.loadFinished.add(onPreloadFinished);

        this.spinner = null;
        this.spinnerRotation = 0;

        //Don't show it unless we have a slow connection
        this.SPINNER_SHOW = 750;  
        this.time = 0;


        var spinner = new Image();
        spinner.onload = function() {
            this.spinner = spinner;
        }.bind(this);
        spinner.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALjSURBVHjavNfPa1xVFAfwz3uZdNI0NAWhNtYfRVEsCJaqG6GL/lgpiLiwa3EjCKIguHDrxo1/QHd1UVCUbhSEKgiii0Jpu7ALsVWUlqipWtvGTJLJuDkPL4fJOJPOeODy5r25P77ne7733HOrXq9nSJvCURzD09iGx9GO/+ui78awk7aG6HM33saLmC8Wmkr9qvS9h/V4bgnADN7Eq9gRE28kTwfZdLQuOqMC2I1TeKKPp6PatphjpV9o+gF4DO/jgRhQFTG+hk/wGZZwMcW9Sq0ZVweQm8HIv3FLItyNM1goPJ/CL3gXJ/MEAwTbDhCt4tsG/iqZKAFM4zQOJna+xEu4PSL1FbaHlrI4rzfiLAX1Bg6kSU6E+m9vIfY9LEfsszjnMgN78EWhdvH+8pCU/5fNY7ZgoodFdBsGXonFG1vEa2NaXMS9m8Iz34RgFi9E0ljHGt6LQeOyJhzTRduFuo70OlN0voYPjd9uhYMlC7OtSDZrhSBPj5H6bJ1CgDXmajycOn1tcvZ3em+3cE8w0GSuKxMEsFacnlWjgbnU6Y8JAljPGbMVqP5Pa5e7ow51lrZrgotPp/dujR+DhdVo908QwGww0I7TsVvjcur01AQBZHaXa5wrvF/FoRGqnlFPx3sTA7fq2PdlybQHz0wAwN44nssCZqmO5PBpwUAHx1N6vlNr4dHC+zZ+LU/DUylL3RUF6bjsyeRQFz+UBckSPk674UBUQndqB7Evxf7nJuyl2D7AT2nws8HEzBZpP4JH0veb+G6zonQB72BnkTZXIz1/hG+GuPVU2B+3ph0xXqGvM2Xyq/pczR7EWwFCmuBPnMW3uIGrBfAZPIT7YuGVNP4GvsLvg8ryMmG8HmDW0kTNll1JR+xKenaKcb/h8z7H8aYAmhvN8zgcv7cCYB0XcH6zIqca4na8E89FTLcPANIpnh1cinAtDxTMiNfz/aHqfeHdQgBYjEWv4vvYTUOVdf8MACJ+0YQTtVtgAAAAAElFTkSuQmCC";
    },

    // destroy: function() {
    //     this.vignette = null;
    //     this.destroyed.dispatch();
    // },

    // resize: function(width, height) {
    //     this.width = width;
    //     this.height = height;
    // },

    render: function(context, dt) {
        this.time += dt;
        //If we have a spinner:
        if (assets.update()) {

        } else if (this.spinner && this.time > this.SPINNER_SHOW) {
            this.spinnerRotation += 0.009 * dt;

            context.save();
            context.translate(Math.round(this.width/2), 
                              Math.round(this.height/2))
            context.rotate(this.spinnerRotation);
            // context.scale(0.5, 0.5);
            context.drawImage(this.spinner, -Math.round(this.spinner.width/2), -Math.round(this.spinner.height/2));
            context.restore();
        }
    }

});

module.exports = Preloader;