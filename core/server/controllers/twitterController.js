
/**
 * Module dependencies.
 */

var	_this = this;



var TwitterController = {

	state : {
		totalTweets : 0,
		symbols : null
	},

	storeReceivedState : function (state) {

		console.log('Storing state from server');
		if (state !== null) {
			_self.state = state;
		}

	},

	/**
	 * Display
	 */

	display : function(req, res) {

		if (_self.state.symbols !== null) {
			res.render('index', {
				symbols: _self.state.symbols
			});
		}

	}
};


var _self = TwitterController;

module.exports = TwitterController;