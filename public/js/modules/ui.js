/*
	UI.js
	Example module to show how to include other JS files into you browserify build
*/

// dependencies for this module go here
var $ = require('traversty'),
	qwery = require('qwery');

	trak = require('trak.js');

	// d3 = require('d3');


//give us old IE selector support (<8)
$.setSelectorEngine(qwery);

var UI = {
	html: $('html')[0],
	body: $('body')[0],

	overlay: $('.overlay'),
	overlayBtn: $('.overlay .btn'),

	symbolList: $('.symbol-list-wrapper')[0],
	symbolListBtn: $('.btn-list')[0],

	scrollActive: false,

	supports : {
		transform3d: false
	},

	scrollFired : false,

	init : function () {
		// d3.selectAll(".symbol").style("color", function() {
  // 			return "hsl(" + Math.random() * 360 + ",100%,50%)";
		// });
		//

		this.browserSupportChecks();

		this.handleZooming();

		this.initOverlays();
		this.initInfoOverlay();
		this.symbolOverlay();

	},

	browserSupportChecks : function  () {

		if (this.html.classList.contains('csstransforms3d')) {
			this.supports.transform3d = true;
		}

		window.onload = function () {
			UI.body.classList.remove('preload');

		};

		document.addEventListener('DOMContentLoaded', function(e) {
			trak.start();
		});


	},

	initOverlays : function () {

		var index = 0,
			overlayNum = this.overlay.length;

		//loop through each overlay and attach listeners
		for (index; index < overlayNum; index++) {
			this.overlayBtn[index].addEventListener('click', function (e) {
				e.preventDefault();

				var context = this.getAttribute('data-close');
				$('.' + context)[0].classList.add('inactive');
				UI.scrollActive = true;

				//if the intro modal is closed, scroll to the top of the window
				if (context === 'overlay--intro') {
					window.scrollTo(0, 0);
				}
			});
		}

	},

	initInfoOverlay : function () {

		var footerLink = $('.page-footer-info')[0];

		footerLink.addEventListener('click', function (e) {
			e.preventDefault();

			UI.hideAllOverlays();
			$('.overlay--info')[0].classList.remove('inactive');

			trak.event({category: 'engagement', action: 'overlay', label: 'info'});

		});

	},

	hideAllOverlays : function () {

		var index = 0,
			overlayNum = this.overlay.length;

		//loop through each overlay and attach listeners
		for (index; index < overlayNum; index++) {
			this.overlay[index].classList.add('inactive');
		}

	},

	symbolOverlay : function () {

		this.symbolListBtn.addEventListener('click', function (e) {
			e.preventDefault();

			//only open if we are in 'open scrolling mode'
			UI.hideAllOverlays();
			UI.symbolList.classList.remove('inactive', 'hide');
			$('#scroll-proxy')[0].classList.add('inactive');
			window.scrollTo(0, 0);
			UI.scrollActive = false;

			trak.event({category: 'engagement', action: 'overlay', label: 'symbol list'});
		});

		//close button for the symbol overlay
		$('.btn--close')[0].addEventListener('click', function (e) {
			e.preventDefault();

			UI.symbolList.classList.add('inactive');
			$('#scroll-proxy')[0].classList.remove('inactive');
			UI.scrollActive = true;
		});

	},


	updateSymbol : function (name, data) {

		// log(name, data);
		var symbolTotal = $('.symbol--' + name + ' .symbol-total');

		if (symbolTotal.length > 0) {
			var index = 0,
				symLength = symbolTotal.length;

			for (index; index < symLength; index++) {
				symbolTotal[index].innerHTML = this.numberWithCommas(data.total);
			}
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

		//make sure page is at the top when reloaded
		window.scrollTo(0, 0);

	//on page load calculate current position and scale to it
		// ZUI.recalculatePositions();

	}
};

// the constructor that will do all the work
function Zoomer( content ) {

	this.setLevels = function() {

		if (this.docWidth > 1500) {
			this.levels = 6.2;
			this.verticalTranslate = 3000;
		} else if (this.docWidth > 1350) {
			this.levels = 6;
			this.verticalTranslate = 2750;
		} else if (this.docWidth > 1250) {
			this.levels = 5.8;
			this.verticalTranslate = 2450;
		} else if (this.docWidth > 1150) {
			this.levels = 5.7;
			this.verticalTranslate = 2350;
		} else if (this.docWidth > 1050) {
			this.levels = 5.5;
			this.verticalTranslate = 2100;
		} else if (this.docWidth > 950) {
			this.levels = 5.35;
			this.verticalTranslate = 1900;
		} else if (this.docWidth > 850) {
			this.levels = 5.15;
			this.verticalTranslate = 1700;
		} else {
			this.levels = 4.9;
			this.verticalTranslate = 1520;
		}

	};

	// keep track of DOM
	this.content = content;

	this.header = $('.page-header')[0];
	this.body = $('body')[0];
	this.town = $('.illust-level--town')[0];
	this.townSymbols = $('.illust-level--symbolsTown')[0];
	this.house = $('.svg-house')[0];
	this.carollers = $('.svg-carollers')[0];
	this.star = $('.svg-star')[0];

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

	if (UI.scrollActive) {
		this.recalculatePositions();
	}

};

Zoomer.prototype.recalculatePositions = function () {

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

	var transformValue,
		width,
		transformPrefix,
		townTransform,
		symboltransformValue;

	this.checkStates();

	var scrollFactor = (this.scrolled < 0.5 ? this.scrolled : 0.5);
	var scale = Math.pow( 3, scrollFactor * this.levels );
	var townHeight = Math.round(scale * INITIAL_TOWN_HEIGHT);
	var townWidth = Math.round(scale * INITIAL_TOWN_WIDTH);
	var townOffset = Math.round(scale * OFFSET_MARGIN) - OFFSET_MARGIN;

	//first half of app is the scale – this zooms into the house
	if (scrollFactor < 0.5) {

		var zScale = Math.round((scale * TARGET_BG_ZSCALE) - TARGET_BG_ZSCALE);

		var townYPos = Math.round(((townHeight / 2) + townOffset));

		//if we support translate3d
		if (UI.supports.transform3d) {
			transformValue = 'translate3d(0, 0, 0) scale(' + scale + ')';

			townTransform = 'translate3d(-50%, -' + townYPos + 'px, 0)';
			symboltransformValue = 'translate3d(-' + (townWidth / 2) + 'px, -' + townYPos + 'px, 0)' + ' scale(' + scale + ')';
		} else {
			transformValue = 'translate(0, 0) scale(' + scale + ')';

			townTransform = 'translate(-50%, -' + townYPos + 'px)';
			symboltransformValue = 'translate(-' + (townWidth / 2) + 'px, -' + townYPos + 'px)' + ' scale(' + scale + ')';
		}

	//the second half is the translate vertically
	} else {

		var percentageThroughSection = ((this.scrolled - 0.5) / 0.5); //get the percentage of the amount through the section (on a scale 0-1)
		var verticalTranslate = percentageThroughSection * this.verticalTranslate; //gets a scaled amount dependent on the percentage of the section scrolled through

		var townYPos = Math.round((townHeight / 2) + townOffset - verticalTranslate);

		//if we support translate3d
		if (UI.supports.transform3d) {
			transformValue = 'translate3d(0, 0, 0) scale(' + scale + ')';
			townTransform = 'translate3d(-50%, -' + townYPos + 'px, 0)';
		} else {
			transformValue = 'translate(0, 0) scale(' + scale + ')';
			townTransform = 'translate(-50%, -' + townYPos + 'px)';
		}

	}

	// SETTING OF OUR NEW VALUES

	//update width and height of town
	this.town.style.width = townWidth + 'px';
	this.town.style.height = townHeight + 'px';

	// //update the transformed value for the town
	this.town.style.WebkitTransform = townTransform;
	this.town.style.MozTransform = townTransform;
	this.town.style.msTransform = townTransform;
	this.town.style.transform = townTransform;

	// //update scale factor of the outside illustrations and text
	// if(navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
		this.content.style.WebkitTransform = transformValue;
		this.content.style.MozTransform = transformValue;
		this.content.style.msTransform = transformValue;
		this.content.style.transform = transformValue;
	// }

	// //town symbols scaling
	this.townSymbols.style.WebkitTransform = 'scale(' + scale + ')';
	this.townSymbols.style.MozTransform = 'scale(' + scale + ')';
	this.townSymbols.style.msTransform = 'scale(' + scale + ')';
	this.townSymbols.style.transform = 'scale(' + scale + ')';

};


Zoomer.prototype.checkStates = function () {

	if (this.scrolled > 0) {
		this.header.classList.add('scaled');
	} else {
		this.header.classList.remove('scaled');
	}

	//do a test whether to switch to night or not (after 0.25 scrolled)
	if (this.scrolled > 0.15) {
		this.body.classList.add('night');
	} else {
		this.body.classList.remove('night');
	}

	//test between state of movement
	if (this.scrolled < 0.5) {

		this.house.classList.remove('inactive'); //make house visible
		this.carollers.classList.remove('inactive'); //make carollers invisible
		this.star.classList.add('inactive'); //make carollers invisible
		this.townSymbols.querySelector('.symbols--inside').classList.add('inactive'); //make nativity symbols not visible
		this.townSymbols.querySelector('.symbols--outside').classList.remove('inactive'); //make nativity symbols not visible

	} else {

		this.house.classList.add('inactive'); //make house not visible
		this.carollers.classList.add('inactive'); //make carollers invisible
		this.star.classList.remove('inactive'); //make carollers invisible
		this.townSymbols.querySelector('.symbols--inside').classList.remove('inactive'); //make nativity symbols visible
		this.townSymbols.querySelector('.symbols--outside').classList.add('inactive'); //make nativity symbols not visible

		if (UI.scrollFired === false) {
			UI.scrollFired = true;
			trak.event({category: 'engagement', action: 'scroll', label: 'halfway'});
		}

	}

};




module.exports = UI;