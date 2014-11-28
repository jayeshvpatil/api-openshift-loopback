'use strict';
var passport = require('passport');

module.exports = function (req, res, next) {
	var li = req.authCode;
	passport.authenticate(req.query.provider, {
		autoLogin: true,
		callbackURL: 'http://www.' + req.query.provider + '.com'
	})(req, res, function (err) {
		if (err) {
			return res.status(400).json({
				error: 'Linking your ' + req.query.provider + ' account failed. Please try again!'
			});
		}

		var loginResponse = {
				userId: req.authInfo.accessToken.userId,
				id: req.authInfo.accessToken.id,
				user: {
					userId: req.authInfo.accessToken.userId,
					email: req.user.email,
					displayName: req.user.email
				}
			},
			profile = req.authInfo.identity.profile;

		if (profile && profile.displayName) {
			loginResponse.user.displayName = profile.displayName
		}

		res.status(200).json(loginResponse);
	});
};