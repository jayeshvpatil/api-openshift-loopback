var util = require('util'),
	server_port = 5000,
	server_ip = 'localhost';

module.exports = {
	port: server_port,
	url: util.format('http://%s:%s/', server_ip, server_port),
	host: '0.0.0.0'
};