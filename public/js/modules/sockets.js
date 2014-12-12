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

		// this.socket = io.connect(connectionURL, {transports: ['websocket']});
		this.socket = io.connect(connectionURL, {transports: ['websocket']});

	},

	Listeners : {

		setup : function () {

			Sockets.socket.on('tweet', this.onTweetReceived);
			Sockets.socket.on('state', this.onStateReceived);

		},

		onTweetReceived : function (symbolObj) {

			// log('on tweet received');
			UI.updateSymbol(symbolObj.key, symbolObj.symbol);

		},

		onStateReceived : function (stateObj) {

			for (var key in stateObj) {
				UI.updateSymbol(key, stateObj[key]);
			}

			UI.updateRankings(stateObj);

		}

	}


};

module.exports = Sockets;