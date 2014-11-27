

var io = require('socket.io'), //socket.io - used for our websocket connection;
	twitter = require('core/server/controllers/twitterController');

var SocketServer = {

	init : function (app, server, config) {

		console.log('LISTENING');

		//Start a Socket.IO listen
		var socketServer = io.listen(server);

		//  ==================
		//  === ON CONNECT ===
		//  ==================

		//If a client connects, give them the current data that the server has tracked
		//so here that would be how many tweets of each type we have stored
		socketServer.sockets.on('connection', function(socket) {
			console.log('twitter.js: New connection logged');

			//recieved symbolState data from the daemon
			socket.on('symbolState', function (data) {
				// console.log('Received new twitter state');
				twitter.storeReceivedState(data);
			});

			//received an updated state of our tweets
			socket.on('tweet', function (data) {
				// console.log('Received new tweet');
				socketServer.sockets.emit('tweet', data);
			});
		});

		//  ============================
		//  === SERVER ERROR LOGGING ===
		//  ============================

		socketServer.sockets.on('close', function(socket) {
			console.log('twitter.js: socketServer has closed');
		});

		return socketServer;
	}
};

var _self = SocketServer;

module.exports = SocketServer.init;