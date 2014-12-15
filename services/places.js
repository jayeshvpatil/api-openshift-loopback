'use strict';
var providers = require('../providers/index.js');

module.exports = Places;

function Places(app) {
	this._app = app;
	this._placesProvider = new providers.foursquare(app);
};

Places.prototype.search = function (searchReq, cb) {
	this._placesProvider.search(searchReq, cb);
};

Places.prototype.explore = function (exploreReq, cb) {
	this._placesProvider.explore(exploreReq, cb);
};

Places.prototype.categories = function (cb) {
	var self = this;
	//ToDo:
	//First check if the cache is present. 
	//If it is present and expired then bring the fresh categories from provider
	//If it is present and not expired then get the categories from mongo
	//If it is not present then bring the categories from the provider

	this._app.models.placeCategories.find(function (err, categories) {
		if (categories && categories.length) {
			return cb(null, self._processCategories(categories));
		}
		self._placesProvider.categories(function (err, categories) {
			if (err) {
				return cb(err);
			}
			self._app.models.placeCategories.destroyAll(function () {
				self._app.models.placeCategories.dataSource.connector.db.collection('placeCategories')
					.insert(categories, function () {});
			});
			cb(null, self._processCategories(categories));
		});
	});
};

Places.prototype._processCategories = function (categories) {
	//ToDo - process categories
	return categories
}