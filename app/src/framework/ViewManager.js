var Class = require('klasse');

var ViewManager = new Class({

    initialize: 
    function ViewManager(parent, model, screens) {
        screens = screens || {};

        this.screens = screens;
        this.landing = null;
        this.model = model;
        this.parent = parent;

        this.width = 0;
        this.height = 0;

        //get first screen
        for (var k in screens) {
            if (screens.hasOwnProperty(k)) {
                this.landing = screens[k];
                break;
            }
        }

        this.view = null;
        this.viewName = null;
    },

    setLanding: function(name) {
        this.screens[name]
    },

    _destroyView: function(view) {
        view.destroy();
    },

    resize: function(width, height) {
        this.width = width;
        this.height = height;
        if (this.view)
            this.view.resize(width, height);
    },

    /**
     * Any optional arguments are passed along to the view's constructor, following
     * the parent and data parameters.
     * @param {[type]} name [description]
     */
    setView: function(name) {
        //if we have a view screen...
        if (this.view) {
            //Listen for when the view animates out, and destroy it.
            this.view.animatedOut.addOnce( this._destroyView.bind(this, this.view) );
            //animate out the view immediately
            this.view.animateOut();
            this.viewName = null;
            this.view = null;
        }

        if (name === null) {
            return;
        }

        if (!(name in this.screens))
            throw "Could not find view '"+name+"' in screens object";

        //get args after name
        var args = Array.prototype.slice.call(arguments, 2);

        //Maybe we have some data for this view?
        var data = null;
        if (this.model && this.model.hasOwnProperty(name)) {
            data = this.model[name];
        }

        //create the new class..
        var newClass = this.screens[name];
        this.view = new newClass(this.parent, data);
        this.viewName = name;

        //called to setup the HTML
        this.view.setup.apply(this.view, args);

        //called to resize the view
        this.view.resize(this.width, this.height);

        //animate in this new section
        this.view.animateIn();
    }
});

module.exports = ViewManager;