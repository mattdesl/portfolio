var Class = require('klasse');

var model = require('./model');

var Signal = require('signals');

/// DOM views
var ViewManager = require('./framework/ViewManager');
var Home = require('./sections/Home');
var Test = require('./sections/Test');

/// CANVAS views
var CanvasManager = require('./canvas/CanvasManager');
var ParticleDrift = require('./canvas/ParticleDrift');
var Preloader = require('./canvas/Preloader');

$(function() {
    FastClick.attach(document.body);

    //we have a canvas for effects underneath our DOM content..
    var canvasManager = new CanvasManager($("body"), model, {
        'preloader': Preloader,
        'particleDrift': ParticleDrift
    });
    
    //another manager handles DOM views
	var overlayManager = new ViewManager($("body"), model, {
        'home': Home,
        'test': Test
    });

    
    $(window).on("touchmove", function(ev) {
        ev.preventDefault();
    });


    function onResize(ev) {
        //should use a Display util if we have many ViewManagers... 
        overlayManager.resize(window.innerWidth, window.innerHeight);        
        canvasManager.resize(window.innerWidth, window.innerHeight);
    }
    
    //listen for browser resizes
    $(window).resize(onResize);


    // Listen for orientation changes
    $(window).on("orientationchange", onResize);

    //trigger a resize initially
    onResize();

    
    //We call this when preloading is done, to set the landing views
    function onPreloadFinished() {
        canvasManager.setView('particleDrift');
        overlayManager.setView('home');
    };

    //start the canvas with preloader
    canvasManager.setView('preloader', onPreloadFinished);

    //start the render loop
    canvasManager.start();

    ////TESTER !!
    $("body").bind("click", function() {
        // console.log("TEST", overlayManager.viewName)
        // manager.setView(manager.viewName === 'home' ? 'test' : 'home');
        
    })
});