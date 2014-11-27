/*
	UI.js
	Example module to show how to include other JS files into you browserify build
*/

// dependencies for this module go here
var $ = require('traversty'),
	qwery = require('qwery'),

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

		ZUI = new Zoomer(zoomContent);

	}
};

// the constructor that will do all the work
function Zoomer( content ) {

	// keep track of DOM
	this.content = content;

	this.town = $('.illustItem--town')[0];

	// position of vertical scroll
	this.scrolled = 0;
	// zero-based number of sections
	this.levels = 5.5;

	var body = document.body,
		html = document.documentElement;

	// height of document
	this.docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

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

	//LETS HAVE SOME DEFAULTS HERE
	var INITIAL_TOWN_WIDTH = 350,
		INITIAL_TOWN_HEIGHT = 358,
		TARGET_TOWN_WIDTH = 2800,
		TARGET_TOWN_HEIGHT = 2864,

		OFFSET_MARGIN = 60,

		TARGET_VERTICAL_TRANSLATE = 1700;


	var supportPageOffset = window.pageXOffset !== undefined;
	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

	var yOffset = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

	// normalize scroll value from 0 to 1
	this.scrolled = yOffset / ( this.docHeight - window.innerHeight );

	var transformValue,
		width;

	//first half of app is the scale – this zooms into the house
	if (this.scrolled < 0.5) {
		var scale = Math.pow( 3, this.scrolled * this.levels );
		transformValue = 'scale(' + scale + ')';

		townHeight = Math.round(scale * INITIAL_TOWN_HEIGHT);
		townWidth = Math.round(scale * INITIAL_TOWN_WIDTH);
		townOffset = Math.round(scale * OFFSET_MARGIN) - OFFSET_MARGIN;

		this.town.style.width = townWidth + 'px';
		this.town.style.marginLeft = -(townWidth / 2) + 'px';
		this.town.style.height = townHeight + 'px';
		this.town.style.marginTop = -((townHeight / 2) + townOffset) + 'px';

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

		this.town.style.WebkitTransform = townTransforn;
		this.town.style.MozTransform = townTransforn;
		this.town.style.OTransform = townTransforn;
		this.town.style.transform = townTransforn;

	}

};




module.exports = UI;