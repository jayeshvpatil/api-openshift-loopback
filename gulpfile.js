'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

gulp.task('nodemon', function () {
	plugins.nodemon({
		verbose: true,
		script: __dirname + '/server/server.js',
		ext: 'js json',
		watch: ['server'],
		ignore: ['server/.DS_Store'],
		env: {
			'NODE_ENV': 'development'
		}
	});
});

gulp.task('default', function () {
	plugins.util.log(plugins.util.colors.green('Default'), plugins.util.env);
	runSequence(['nodemon']);
});