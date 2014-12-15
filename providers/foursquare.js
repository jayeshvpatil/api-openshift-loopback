'use strict';
var _ = require('lodash'),
	requestUtil = require('../utilities').requestUtil;

module.exports = Foursquare;

function Foursquare(app) {
	this._app = app;
	this._config = this._app.get('foursquare');
	this._credentials = {
		client_id: this._config.clientId,
		client_secret: this._config.clientSecret,
		v: this._config.version
	};
};

Foursquare.prototype.search = function (searchReq, cb) {
	var self = this;
	requestUtil({
		uri: this._config.venuesUrl + '/search',
		qs: _.assign(searchReq, this._credentials)
	}, function (err, body) {
		if (err) {
			return cb(err);
		}
		if (body && body.response && body.response.venues) {
			return cb(null, self._processSearchResponse(body.response.venues));
		}
		cb(new Error('No results'));
	});
};

Foursquare.prototype.explore = function (exploreReq, cb) {
	var self = this;

	requestUtil({
		uri: this._config.venuesUrl + '/explore',
		qs: _.assign(exploreReq, this._credentials)
	}, function (err, body) {
		if (err) {
			return cb(err);
		}
		if (body && body.response) {
			return cb(null, self._processExploreResponse(body.response));
		}
		cb(new Error('No results'));
	});
};

Foursquare.prototype.categories = function (cb) {
	var self = this;
	requestUtil({
		uri: this._config.venuesUrl + '/categories',
		qs: this._credentials
	}, function (err, body) {
		if (err) {
			return cb(err);
		}
		if (body.response && body.response.categories) {
			return cb(null, self._processCategories(body.response.categories));
		}
		cb(new Error('No results'));
	});
};

Foursquare.prototype._processSearchResponse = function (venues) {
	//Map the required values from the foursqure api response
	return _.map(venues, function (v) {
		return {
			id: v.id,
			name: v.name,
			contact: v.contact,
			location: v.location,
			categories: v.categories,
			verified: v.verified
		};
	});
};

Foursquare.prototype._processExploreResponse = function (exploreResponse) {
	//Todo - process the response
	return exploreResponse;
}

Foursquare.prototype._processCategories = function (categoriesResponse) {
	//Todo - process the response
	return categoriesResponse;
}