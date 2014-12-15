'use strict';
var services = require('../services');

module.exports = function (Places) {

	Places.search = function (request, cb) {
		new services.places(this.app).search(request, cb);
	};

	Places.explore = function (request, cb) {
		new services.places(this.app).explore(request, cb);
	};

	Places.categories = function (categoryId, parentCategoryIds, cb) {
		new services.places(this.app).categories(categoryId, parentCategoryIds, cb);
	};

	Places.remoteMethod(
		'search', {
			accepts: [{
				arg: 'request',
				type: 'object',
				required: true,
				http: {
					source: 'body'
				}
			}],
			http: {
				verb: 'post'
			},
			returns: {
				arg: 'places',
				type: 'object'
			},
			description: 'This method is used to search the places and their related information using various criterias (ll, near, radius, query etc.)'
		}
	);

	Places.remoteMethod(
		'explore', {
			accepts: [{
				arg: 'request',
				type: 'object',
				required: true,
				http: {
					source: 'body'
				}
			}],
			http: {
				verb: 'post'
			},
			returns: {
				arg: 'places',
				type: 'object'
			},
			description: 'This method is used to explore the places and their related information using various criterias (ll, near, radius, query etc.)'
		}
	);

	Places.remoteMethod(
		'categories', {
			http: {
				verb: 'get'
			},
			returns: {
				arg: 'categories',
				type: 'object'
			},
			description: 'This method is used to get the place categories'
		}
	);
};