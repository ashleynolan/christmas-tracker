
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
		port: 3002,
		app: {
			name: 'Twitter vote counter - local'
		},
		global: sharedConfig
	},

	dev: {
		mode: 'development',
		port: 3002,
		app: {
			name: 'Twitter vote counter - Dev'
		},
		global: sharedConfig
	},

	prod: {
		mode: 'production',
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
