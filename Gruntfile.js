module.exports = function(grunt) {

	var TEXTUREPACKER_PATH = '';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		browserify: {
			// dist: {
			// 	files: {
			// 		'release/build/bundle.js': ['app/src/main.js']
			// 	},

			// 	options: {
			// 		//alias: './lib/index.js:knit'
			// 	}
			// },

			// coach_debug: {
			// 	files: {
			// 		'release/build/cursorfx.debug.js': ['app/src/index.js']
			// 	},
			// 	options: {
			// 		standalone: 'cursorfx',
			// 		debug: true,
			// 		alias: ['./app/src/index.js:cursorfx']
			// 	}
			// },
			coach: {
				files: {
					'release/build/cursorfx.js': ['app/src/index.js']
				},
				options: {
					standalone: 'cursorfx'
					// alias: ['./app/src/index.js:cursorfx']
				}
			}
		},

		// Task configuration.
		less: {
			development: {
				options: {
					paths: ['app/less']
				},
				src: 'app/less/main.less',
				dest: 'app/css/main.css'
			}
		},

		watch: {
			less: {
				files: [ 'app/less/**/*.less', 'app/css/' ],
				tasks: [ 'less:development' ]
			}
		},

		uglify: {
			options: {
				mangle: false
			},
			main: {
				files: {
					'release/build/cursorfx.min.js': [
						//dependencies...
						'app/vendor/raf.min.js',
						'app/vendor/tweenlite.min.js',
						'app/vendor/easepack.min.js',
						'app/vendor/cssplugin.min.js',

						//core lib
						'release/build/cursorfx.js'
					]
				}
			}
		},

		shell: {
			TexturePacker: {
				options: {
				  stdout: true
				},
				command: function(path) {
					path = (typeof path !== "undefined") ? path : TEXTUREPACKER_PATH;

					if ( path.length>0 && !(/[\\\/]$/.test(path)) ) //doesn't end with line sep...
						path = path + "/";

					var cmd = path+"TexturePacker --data app/less/icons.less"
						+" --sheet app/css/icons.png"
						+" --texture-format png"
						+" --algorithm Basic"
						+" --trim-mode None"
						+" --force-publish"
						+" --format multi-css"
						+" --autosd-variant 0.5:@2x"
						// +" --shape-padding 2"
						// +" --border-padding 0"
						+" --padding 2"
						// +" --size-constraints POT"
						+" app/image_data";
					return cmd;
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);
	
	grunt.registerTask('TexturePacker', ['shell:TexturePacker', 'less:development'] );

	//build task
};
