module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		watch: {
			grunt: {
				files: ['grunt.js']
			}
		},

		browserify: {
			options: {
				transform: [ [require('grunt-react').browserify , { compact: false }] ]

			},
			app: {
				src: ['react_components/app.jsx'],
				dest: 'public/javascripts/app.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', ['browserify']);
};
