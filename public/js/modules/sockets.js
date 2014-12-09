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

		},

		onTweetReceived : function (symbolObj) {

			UI.updateSymbol(symbolObj.key, symbolObj.symbol);

		}

	}


};

module.exports = Sockets;