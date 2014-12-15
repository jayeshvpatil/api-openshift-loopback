'use strict';

var loopback = require('loopback');
var resources = require('./resources');
var app = module.exports = loopback();
var devEnvironment = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local');

//Bootstrap the rest api
require('loopback-boot')(app, __dirname);

// Passport configurators..
var passportConfigurator = new require('loopback-component-passport').PassportConfigurator(app);
passportConfigurator.init();
passportConfigurator.setupModels({
	userModel: app.models.user,
	userIdentityModel: app.models.userIdentity,
	userCredentialModel: app.models.userCredential
});

try {
	var providers = require('./providers.json');
	for (var p in providers) {
		if (providers.hasOwnProperty(p)) {
			providers[p].session = providers[p].session !== false;
			passportConfigurator.configureProvider(p, providers[p]);
		}
	}
} catch (err) {
	console.trace(err);
	process.exit(1); // fatal
}

if (devEnvironment) {
	// -- Mount static files here only for local development --
	var path = require('path');
	app.use(loopback.static(path.resolve(__dirname, '../mobile/www')));
}

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('X-Powered-By', '3zixty');
	res.removeHeader('Vary');
	next();
});

app.use(loopback.compress());

app.get('/auth/current', function (req, res, next) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		return res.status(200).json({});
	}
	var ret = JSON.parse(JSON.stringify(req.user));
	delete ret.password;
	res.status(200).json(ret);
});

app.get('/auth/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

app.get('/auth/external', resources.externalAuth);

app.use(loopback.urlNotFound());

app.use(loopback.errorHandler());

// start the server if `$ node server.js`
if (require.main === module) {
	app.listen(function () {
		app.emit('started');
		if (devEnvironment) {
			console.log('Web server listening at: %s', app.get('url'));
		}
	});
}