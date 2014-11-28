'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var externalAuth = require('./services/external-auth');

app.use(function (req, res, next) {
	res.setHeader('X-Powered-By', '3zixty');
	res.removeHeader('Vary');
	next();
});

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
});

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

// attempt to build the providers/passport config
var config = {};
try {
	config = require('../providers.json');
} catch (err) {
	console.trace(err);
	process.exit(1); // fatal
}

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// boot scripts mount components like REST API
boot(app, __dirname);

app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(loopback.session({
	secret: app.get('cookieSecret'),
	saveUninitialized: true,
	resave: true
}));
passportConfigurator.init();

passportConfigurator.setupModels({
	userModel: app.models.user,
	userIdentityModel: app.models.userIdentity,
	userCredentialModel: app.models.userCredential
});
for (var s in config) {
	if (config.hasOwnProperty(s)) {
		var c = config[s];
		c.session = c.session !== false;
		passportConfigurator.configureProvider(s, c);
	}
}

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.get('/auth/account', ensureLoggedIn('/'), function (req, res, next) {
	console.log('Logged in', req.user)
	res.redirect('/');
});

app.get('/auth/current', function (req, res, next) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		return res.status(200).json({});
	}
	//poor man's copy
	var ret = JSON.parse(JSON.stringify(req.user));
	delete ret.password;
	res.status(200).json(ret);
});

app.get('/auth/external', externalAuth);

/*

 app.get('/link/account', ensureLoggedIn('/auth/google'), function(req, res, next) {
 res.render('linkedAccounts', {user: req.user});
 });
 */

app.get('/auth/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
	console.log('Logged out', req.user)
});

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
var path = require('path');
app.use(loopback.static(path.resolve(__dirname, '../../mobile/www')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		console.log('Web server listening at: %s', app.get('url'));
	});
};

// start the server if `$ node server.js`
if (require.main === module) {
	app.start();
}