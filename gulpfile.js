'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

gulp.task('nodemon', function () {
	plugins.nodemon({
		verbose: true,
		script: './server.js',
		ext: 'js json',
		ignore: ['./node_modules'],
		env: {
			'NODE_ENV': 'development'
		}
	});
});

gulp.task('default', function () {
	plugins.util.log(plugins.util.colors.green('Default'), plugins.util.env);
	runSequence(['nodemon']);
});