var Class = require('klasse');

var model = require('./model');

/// DOM views
var ViewManager = require('./framework/ViewManager');
var Home = require('./sections/Home');
var Test = require('./sections/Test');

/// CANVAS views
var CanvasManager = require('./canvas/CanvasManager');
var ParticleDrift = require('./canvas/ParticleDrift');

$(function() {
    FastClick.attach(document.body);

    //we have a canvas for effects underneath our DOM content..
    var canvasManager = new CanvasManager($("body"), model, {
        'particleDrift': ParticleDrift
    });
    
    //another manager handles DOM views
	var overlayManager = new ViewManager($("body"), model, {
        'home': Home,
        'test': Test
    });

    function onResize(ev) {
        //should use a Display util if we have many ViewManagers... 
        overlayManager.resize(window.innerWidth, window.innerHeight);        
        canvasManager.resize(window.innerWidth, window.innerHeight);
    }

    //listen for browser resizes
    $(window).resize(onResize);

    //trigger a resize initially
    onResize();

    //Start the overlay on home view, and canvas on particle view
    overlayManager.setView('home');
    canvasManager.setView('particleDrift');

    //start the render loop
    canvasManager.start();

    ////TESTER !!
    $("body").bind("click", function() {
        // console.log("TEST", overlayManager.viewName)
        // manager.setView(manager.viewName === 'home' ? 'test' : 'home');
        
    })
});