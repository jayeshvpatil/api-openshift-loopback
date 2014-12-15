var _ = require('lodash'),
	request = require('request');

module.exports = function (options, cb) {
	request(_.extend({
		method: 'GET',
		json: true
	}, options), function (err, response, body) {
		if (err) {
			return cb(err);
		}
		if (response) {
			if (response.statusCode !== 200) {
				var errObj = new Error();
				errObj.message = 'HTTP code: ' + response.statusCode;
				errObj.statusCode = response.statusCode;
				if (body) {
					errObj.body = body;
				}
				if (response.headers) {
					errObj.headers = response.headers;
				}
				return cb(errObj);
			}
			return cb(null, body);
		}
		cb(new Error('No response'));
	});
};