/*
	sockets.js
*/

// dependencies for this module go here
var UI = require('./ui');

var Sockets = {
	socket : null,

	init : function () {
		this.makeSocketConnection();

		this.Listeners.setup();
	},

	makeSocketConnection : function () {

		var connectionURL = window.location.hostname;

		this.socket = io.connect(connectionURL);

	},

	Listeners : {

		setup : function () {

			Sockets.socket.on('tweet', this.onTweetReceived);
			Sockets.socket.on('state', this.onStateReceived);

		},

		onTweetReceived : function (symbolObj) {

			UI.updateSymbol(symbolObj.key, symbolObj.symbol);

		},

		onStateReceived : function (stateObj) {

			for (var key in stateObj) {
				UI.updateSymbol(key, stateObj[key]);
			}

		}

	}


};

module.exports = Sockets;