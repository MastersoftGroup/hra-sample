module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	//grunt.loadNpmTasks('grunt-bower');
	grunt.initConfig({
		clean: {
			dist: {
				files: [
					{src: ['build']}
				]
			}
		},

		copy: {
			dist: {
				files: [
					{expand: true, cwd: 'src/', src: ['*'], dest: 'build/'},
					{expand: true, cwd: 'scripts/', src: ['*'], dest: 'build/static'}
				]
			}
		},

		bower: {
			dist: {
				dest: 'build/static',
				options: {
      		keepExpandedHierarchy: false,
					packageSpecific: {
						'jquery-ui': {
							stripGlobBase: true,
          		files: [
            		'jquery-ui.js',
            		'themes/smoothness/jquery-ui.css'
          		]
        		}
    			}
				}
			}
		}
	});

	grunt.registerTask('default', [
		'clean:dist',
		'copy:dist',
		'bower'
	]);
}
