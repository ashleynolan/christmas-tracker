
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

		console.log('received something');

		if (state !== null) {
			console.log('Storing state from server');
			_self.state = state;
		}

	},

	/**
	 * Display
	 */

	display : function(req, res) {

		res.render('index', {
			symbols: _self.state.symbols
		});

	}
};

var _self = TwitterController;

module.exports = TwitterController;