/*
	UI.js
	Example module to show how to include other JS files into you browserify build
*/

// dependencies for this module go here
var $ = require('traversty'),
	qwery = require('qwery'),

	IScroll = require("../libs/iscroll-probe.js");

	d3 = require('d3');



//give us old IE selector support (<8)
$.setSelectorEngine(qwery);

var UI = {
	init : function () {
		console.debug('KO.UI module is being initialised');

		// d3.selectAll(".symbol").style("color", function() {
  // 			return "hsl(" + Math.random() * 360 + ",100%,50%)";
		// });
		//
		this.handleZooming();

	},


	updateSymbol : function (name, data) {

		// log(name, data);
		var symbolTotal = $('.symbol--' + name + ' .symbol-total');

		if (symbolTotal.length > 0) {
			symbolTotal[0].innerHTML = data.total;
		}

	},


	handleZooming : function () {

		// only proceed if CSS transforms are supported
		// NEED TO FIX
		//if ( !Modernizr.csstransforms ) { return; }

		var zoomContent = $('.illust-container')[0];

		log('ABOUT TO SET ZOOMER');

		ZUI = new Zoomer(zoomContent);

	}
};

// the constructor that will do all the work
function Zoomer( content ) {

	// keep track of DOM
	this.content = content;

	// position of vertical scroll
	this.scrolled = 0;
	// zero-based number of sections
	this.levels = 5.5;

	var body = document.body,
		html = document.documentElement;

	// height of document
	this.docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

	log('ADDING LISTENER');

	// bind Zoomer to scroll event
	window.addEventListener( 'scroll', this, false);
}

// enables constructor to be used within event listener
// like obj.addEventListener( eventName, this, false )
Zoomer.prototype.handleEvent = function( event ) {
	if ( this[event.type] ) {
		this[event.type](event);
	}
};

// triggered every time window scrolls
Zoomer.prototype.scroll = function( event ) {

	log('SCROLLING');

	//LETS HAVE SOME DEFAULTS HERE
	var INITIAL_TOWN_WIDTH = 350,
		INITIAL_TOWN_HEIGHT = 358,
		TARGET_TOWN_WIDTH = 2800,
		TARGET_TOWN_HEIGHT = 2864,

		OFFSET_MARGIN = 60,

		TARGET_VERTICAL_TRANSLATE = 1700;


	// normalize scroll value from 0 to 1
	this.scrolled = window.scrollY / ( this.docHeight - window.innerHeight );

	var transformValue,
		width;

	//first half of app is the scale – this zooms into the house
	if (this.scrolled < 0.5) {
		var scale = Math.pow( 3, this.scrolled * this.levels );
		transformValue = 'scale(' + scale + ')';

		townHeight = Math.round(scale * INITIAL_TOWN_HEIGHT);
		townWidth = Math.round(scale * INITIAL_TOWN_WIDTH);
		townOffset = Math.round(scale * OFFSET_MARGIN) - OFFSET_MARGIN;

		// log($('.illustItem--town'));
		$('.illustItem--town')[0].style.width = townWidth + 'px';
		$('.illustItem--town')[0].style.marginLeft = -(townWidth / 2) + 'px';
		$('.illustItem--town')[0].style.height = townHeight + 'px';
		$('.illustItem--town')[0].style.marginTop = -((townHeight / 2) + townOffset) + 'px';

		//update scale factor of the outside illustrations and text
		this.content.style.WebkitTransform = transformValue;
		this.content.style.MozTransform = transformValue;
		this.content.style.OTransform = transformValue;
		this.content.style.transform = transformValue;

	//the second half is the translate
	} else {

		var scale = Math.pow( 3, 0.5 * this.levels );
		var percentageSection = ((this.scrolled - 0.5) / 0.5);

		var translate = percentageSection * TARGET_VERTICAL_TRANSLATE; //gets a scaled amount dependent on the percentage of the section scrolled through

		townTransforn = 'translate(0, ' + translate + 'px)';
		//transformValue = 'scale(' + scale + ') translate(0, ' + translate + 'px)';

		$('.illustItem--town')[0].style.WebkitTransform = townTransforn;
		$('.illustItem--town')[0].style.MozTransform = townTransforn;
		$('.illustItem--town')[0].style.OTransform = townTransforn;
		$('.illustItem--town')[0].style.transform = townTransforn;

	}

};




module.exports = UI;