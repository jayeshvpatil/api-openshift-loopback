var util = require('util'),
	server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000,
	server_ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || 'localhost';

module.exports = {
	port: server_port,
	url: util.format('http://%s:%s/', server_ip, server_port),
	host: server_ip
};