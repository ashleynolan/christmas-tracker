

var http = require('http'),		//http - give me server
	path = require('path');		//http://nodejs.org/docs/v0.4.9/api/path.html



function init (app, config) {

	require('./server')(app, config);


	//Create the HTTP server with the express app as an argument
	var server = http.createServer(app);

	//Create the server
	server.listen(app.get('port'), function(){
		console.log('app.js: Express server listening on port ' + app.get('port'));
	});
	server.on('close', function(socket) {
		console.log('app.js: Server has closed');
	});


	//  ===============================
	//  === SOCKET CONNECTION SETUP ===
	//  ===============================
	var socketServer = require('./server/socketServer')(app, server, config);


	//  ================================
	//  === APPLICATION ROUTES SETUP ===
	//  ================================
	require('core/server/routes')(app);

}


module.exports = init;
