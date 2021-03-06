

var io = require('socket.io'), //socket.io - used for our websocket connection;

	clientio  = require('socket.io-client'),
	twitter = require('core/server/controllers/twitterController');

var SocketServer = {
	client : null,

	init : function (app, server, config) {

		//Start a Socket.IO listen
		var socketServer = io(server);
		_self.client = clientio.connect(config.clientURL, {transports: ["websocket"]});

		//  ==================
		//  === ON CONNECT ===
		//  ==================
		//If a client connects, give them the current data that the server has tracked
		//so here that would be how many tweets of each type we have stored
		socketServer.sockets.on('connection', function (socket) {
			console.log('socketServer: New connection logged');
			// console.log(socket.handshake.headers);

			// emit state immediately so it’s more up to date
			socket.emit('state', twitter.state.symbols);

			//test to see if our new connection is from our backend server or a front-end connection
			//if it’s the backend server, set up these events
			if (socket.handshake.headers.upgrade === 'websocket') {
				console.log('Backend connection made – setup event listeners');
				console.log(socket.handshake.headers);

				//recieved symbolState data from the daemon
				socket.on('symbolState', function (data) {
					twitter.storeReceivedState(data);
				});

				//received an updated state of our tweets
				socket.on('tweet', function (data) {
					// console.log('Received new tweet', data);
					socketServer.sockets.emit('tweet', data);
				});

				socket.on('state', function (data) {
					// console.log('Received new state');
					socketServer.sockets.emit('state', data);
				});
			}

			//log disconnects so we can check they get handled properly
			socket.on('disconnect', function (reason) {
				console.log('user disconnected – ' + reason);
			});
		});

		//  ============================
		//  === SERVER ERROR LOGGING ===
		//  ============================

		socketServer.sockets.on('close', function(socket) {
			console.log('twitter.js: socketServer has closed');
		});


		//setup a keepalive from the client to the server
		setInterval(function() {
			_self.client.emit('keepalive');
		}, 20000);

		return socketServer;
	}
};

var _self = SocketServer;

module.exports = SocketServer.init;