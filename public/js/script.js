/*	Author:
		TMW - (Author Name Here)
*/

// --------------------------------------------- //
// DEFINE GLOBAL LIBS                            //
// --------------------------------------------- //
// Uncomment the line below to expose jQuery as a global object to the usual places
// window.jQuery = window.$ = require('./libs/jquery/jquery-1.10.2.js');

// force compilation of global libs that don't return a value.
require("./helpers/log");
require("./helpers/shims");
window.io = require('./libs/socket.io-1.1.0');


//initialise KO object
var KO = window.KO = {};

KO.Sockets = require('./modules/sockets');
KO.UI = require('./modules/ui');

KO.Config = {

	init : function () {
		KO.UI.init();
		KO.Sockets.init();
	}
};


KO.Config.init();