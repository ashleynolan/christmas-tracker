
/**
 * Declare our Module dependencies at the top
 */

var express = require('express'),
	toobusy = require('toobusy'),
	compress = require('compression'),
	logger  = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	timeout = require('connect-timeout'),
	pkg = require('package.json');


var server = {

	init : function (app, config) {
		app.set('showStackError', true);

		// should be placed before express.static - compressed with gzip
		app.use(compress({
			filter: function (req, res) {
				return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
			},
			level: 9
		}));

		toobusy.maxLag(5000);

		// middleware which blocks requests when we're too busy
		app.use(function(req, res, next) {
			if (toobusy()) {
				res.status(503).send("We’re experiencing a higher number of visitors than we can handle at the moment. Please try reloading the page.")
			} else {
				next();
			}
		});

		// don't use logger for test env
		if (process.env.NODE_ENV !== 'test') {
			app.use(logger('dev'));
		}


		var oneDay = 86400000;
		//app.use(express.favicon(__dirname + '../public/favicon.ico'));
		app.use(express.static('public', { maxAge: oneDay }));
		// app.use(express.static('public'));

		// set views path, template engine and default layout
		app.set('views', 'core/client/views');
		app.set('view engine', 'jade');

		app.set('port', process.env.PORT || 5000);

		// expose package.json to views
		app.use(function (req, res, next) {
			res.locals.pkg = pkg;
			next();
		});

		app.use(timeout('20s'));

		// bodyParser should be above methodOverride
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		app.use(methodOverride());


		// development env config
		if (config.mode === 'local') {
			app.locals.pretty = true;
		}
	}

};

module.exports = server.init;
