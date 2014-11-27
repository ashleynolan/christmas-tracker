
var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	config,
	sharedConfig;

var sharedConfig = {
	root: rootPath
};

module.exports = {
	local: {
		mode: 'local',
		clientURL: 'http://localhost:6000',
		port: 3002,
		app: {
			name: 'Twitter vote counter - local'
		},
		global: sharedConfig
	},

	dev: {
		mode: 'development',
		clientURL: 'http://localhost:3001',
		port: 3002,
		app: {
			name: 'Twitter vote counter - Dev'
		},
		global: sharedConfig
	},

	prod: {
		mode: 'production',
		clientURL: 'http://christmas-tracker-daemon.herokuapp.com',
		port: 3002,
		app: {
			name: 'Twitter vote counter - Prod'
		},
		global: sharedConfig

	},

	hosts: [
		{
			domain: 'christmastracker.local',
			target: ['localhost:3001']
		}
	]
};
