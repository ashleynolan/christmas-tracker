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
			// symbolTotal[0].innerHTML = this.numberWithCommas(data.total);
		}

	},

	numberWithCommas : function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

	this.setLevels = function() {

		if (this.docWidth > 1100) {
			this.levels = 5.9;
			this.verticalTranslate = 2600;
		} else if (this.docWidth > 1000) {
			this.levels = 5.5;
			this.verticalTranslate = 2600;
		} else if (this.docWidth > 700) {
			this.levels = 5.4;
			this.verticalTranslate = 2600;
		} else {
			this.levels = 5.4;
			this.verticalTranslate = 2600;
		}

	};

	// keep track of DOM
	this.content = content;

	this.body = $('body')[0];
	this.town = $('.illust-level--town')[0];
	this.townSymbols = $('.illust-level--symbolsTown')[0];
	this.house = $('.svg-house')[0];

	// position of vertical scroll
	this.scrolled = 0;

	var body = document.body,
		html = document.documentElement;

	// height of document
	this.docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	this.docWidth = html.clientWidth;

	// zero-based number of sections
	this.setLevels();

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
		INITIAL_TOWN_HEIGHT = 320,
		TARGET_TOWN_WIDTH = 2800,
		TARGET_TOWN_HEIGHT = 2560,

		TARGET_BG_ZSCALE = 200,

		OFFSET_MARGIN = 80,

		TARGET_VERTICAL_TRANSLATE = 2600;


	var supportPageOffset = window.pageXOffset !== undefined;
	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

	var yOffset = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

	// normalize scroll value from 0 to 1
	this.scrolled = yOffset / ( this.docHeight - window.innerHeight );

	var scale,
		transformValue,
		width,
		townWidth,
		townHeight,
		townOffset;

	//first half of app is the scale – this zooms into the house
	if (this.scrolled < 0.5) {

		//do a test whether to switch to night or not
		if (this.scrolled > 0.25) {
			this.body.classList.add('night');
		} else {
			this.body.classList.remove('night');
		}

		this.house.classList.remove('inactive');

		scale = Math.pow( 3, this.scrolled * this.levels );

		var zScale = Math.round((scale * TARGET_BG_ZSCALE) - TARGET_BG_ZSCALE);
		transformValue = 'translate3d(0, 0, 0) scale(' + scale + ')';

		// symboltransformValue = 'translateZ(' + zScale + 'px)';

		townHeight = Math.round(scale * INITIAL_TOWN_HEIGHT);
		townWidth = Math.round(scale * INITIAL_TOWN_WIDTH);
		townOffset = Math.round(scale * OFFSET_MARGIN) - OFFSET_MARGIN;

		townTransform = 'translate3d(-' + (townWidth / 2) + 'px, -' + ((townHeight / 2) + townOffset) + 'px, 0)';
		symboltransformValue = 'translate3d(-' + (townWidth / 2) + 'px, -' + ((townHeight / 2) + townOffset) + 'px, 0)' + ' scale(' + scale + ')';


	//the second half is the translate
	} else {

		this.house.classList.add('inactive')

		scale = Math.pow( 3, 0.5 * this.levels ); //work out the fixed scale factor for halfway

		transformValue = 'translate3d(0, 0, 0) scale(' + scale + ')';

		townHeight = Math.round(scale * INITIAL_TOWN_HEIGHT);
		townWidth = Math.round(scale * INITIAL_TOWN_WIDTH);
		townOffset = Math.round(scale * OFFSET_MARGIN) - OFFSET_MARGIN;

		var percentageThroughSection = ((this.scrolled - 0.5) / 0.5); //get the percentage of the amount through the section (on a scale 0-1)
		var verticalTranslate = percentageThroughSection * this.verticalTranslate; //gets a scaled amount dependent on the percentage of the section scrolled through

		townTransform = 'translate3d(-' + (townWidth / 2) + 'px, -' + ((townHeight / 2) + townOffset - verticalTranslate) + 'px, 0)';

	}

	//update width and height of town
	this.town.style.width = townWidth + 'px';
	this.town.style.height = townHeight + 'px';

	//update the transformed value for the town
	this.town.style.WebkitTransform = townTransform;
	this.town.style.MozTransform = townTransform;
	this.town.style.transform = townTransform;

	//update scale factor of the outside illustrations and text
	this.content.style.WebkitTransform = transformValue;
	this.content.style.MozTransform = transformValue;
	this.content.style.transform = transformValue;

	//town symbols scaling
	this.townSymbols.style.WebkitTransform = 'scale(' + scale + ')';
	this.townSymbols.style.MozTransform = 'scale(' + scale + ')';
	this.townSymbols.style.transform = 'scale(' + scale + ')';

};




module.exports = UI;