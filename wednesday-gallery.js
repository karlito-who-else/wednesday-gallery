/**
 * Wednesday Gallery carousel actions v4
 */

 (function($, window) {
	'use strict';

	/**
	 * Wednesday Namespace
	 * @type { Object }
	 */
	var Wednesday = window.Wednesday = window.Wednesday || {};
	Wednesday.Gallery = {};
	Wednesday.Gallery.instance = {};

	// Logging function - with identifier
	Wednesday.Gallery.log = function (message, context) {
		console.log($(context).attr('id'), ': ', message);
	}

	Wednesday.Gallery.circularUpdate = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		// reposition the carousel ----------------------------------

		var position_current = 0; // $('.gallery-images li.current-slide', context).offset().left;
		var position_updated = $('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).position().left;
		var offset = position_current - position_updated;
		var centering = 0;

		console.log('current slide position   = ', position_current);
		console.log('updated slide position   = ', position_updated);
		console.log('difference (to slide) = ', offset);

		if ($(context).hasClass('centered')) {
			centering = parseInt((instance.carousel_width - instance.slide_width) / 2);
			console.log('centering amount = ', centering);
		}

		console.log('difference (to move) = ', offset + centering);

		// move the slide container by the offset
		$('.gallery-images', context).animate({'left' : offset + centering}, 500, function(){

			// if the current element is the first slide element
			if (instance.current_slide + 1 == $('.gallery-images li:first', context).data('image')) {

				console.log('current slide is first slide, move last to first')

				// remove the last item and put it as the first item
				$('.gallery-images li:first', context).before($('.gallery-images li:last', context));

				// reposition the container ready for the move
				console.log($('.gallery-images', context).css('left'), ' to ', 0 - instance.slide_width + centering);
				$('.gallery-images', context).css({'left' : 0 - instance.slide_width + centering});

			}

			// if the current element is the last slide element
			if (instance.current_slide + 1 == $('.gallery-images li:last', context).data('image')) {

				console.log('current slide is last slide, move first after last')

				// remove the first item and put it as the last item
				$('.gallery-images li:last', context).after($('.gallery-images li:first', context));

				// reposition the container ready for the move
				console.log($('.gallery-images', context).css('left'), ' to ', parseInt($('.gallery-images', context).css('left')) + instance.slide_width + centering);
				$('.gallery-images', context).css({'left' : parseInt($('.gallery-images', context).css('left')) + instance.slide_width + centering});

			}

		});

		// update the button visibility -----------------------------
		// buttons are always visible

		// no changes: 0Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

	}

	Wednesday.Gallery.fixedUpdate = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		// reposition the carousel ----------------------------------

		var position_current = $('.gallery-images li.current-slide', context).offset().left;
		var position_updated = $('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).offset().left;
		var offset = position_current - position_updated;

		console.log('current slide position   = ', position_current);
		console.log('updated slide position   = ', position_updated);
		console.log('difference (to be moved) = ', offset);

		// update the button visibility -----------------------------

		// are all slides already within the viewport?
		if (instance.slides > instance.shown_slides) {

			// are we at the beginning
			if (instance.current_slide <= 0) {
				$('a.prev', context).hide();
			} else {
				$('a.prev', context).show();
			}

			// are we at the end?
			if (instance.current_slide >= instance.slides - instance.shown_slides) {
				$('a.next', context).hide();
			} else {
				$('a.next', context).show();
			}

		} else {
			// all slides are on screen
			$('a.prev', context).hide();
			$('a.next', context).hide();
		}

		// no changes: 0Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

	}

	Wednesday.Gallery.defaultUpdate = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		// reposition the carousel ----------------------------------

		var position_current = $('.gallery-images li.current-slide', context).offset().left;
		var position_updated = $('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).offset().left;
		var offset = position_current - position_updated;

		console.log('current slide position   = ', position_current);
		console.log('updated slide position   = ', position_updated);
		console.log('difference (to be moved) = ', offset);

		// update the button visibility -----------------------------

		// are all slides already within the viewport?
		if (instance.slides > instance.shown_slides) {

			// are we at the beginning?
			if (instance.current_slide <= 0) {
				$('a.prev', context).hide();
			} else {
				$('a.prev', context).show();
			}

			// are we at the end?
			if (instance.current_slide + 1 >= instance.slides) {
				$('a.next', context).hide();
			} else {
				$('a.next', context).show();
			}

		} else {
			// all slides are on screen
			$('a.prev', context).hide();
			$('a.next', context).hide();
		}

		// no changes: 0Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

	}

	Wednesday.Gallery.genericUpdate = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		if ($(context).hasClass('circular')) {
			Wednesday.Gallery.circularUpdate(context);
		} else if ($(context).hasClass('fixed')) {
			Wednesday.Gallery.fixedUpdate(context);
		} else {
			Wednesday.Gallery.defaultUpdate(context);
		}

		// move the current slide class -----------------------------

		console.log('current slide = ', (instance.current_slide + 1), '/', instance.slides);

		// remove the currentSlide class from the old current slide
		$('.gallery-images li.current-slide', context).removeClass('current-slide', context);

		// add the currentSlide class to the new current slide
		$('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).addClass('current-slide', context);

		// no changes: 0Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

	}

	// Calls the appropriate drawing methods for the carousel type
	Wednesday.Gallery.genericDraw = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		console.log('/ GALLERY : DRAW -------------------------------------------');

		// grab the width of the carousel
		instance.carousel_width = $(context).innerWidth();

		// work out the breakpoint, if specified
		if (instance.breakpoints) {
			for(var i=0; i<instance.breakpoints.length; i++) {
				if ($('body').hasClass('breakpoint-' + instance.breakpoints[i])) {
					instance.shown_slides = instance.show_slides[i];
					// the width of the slide is the carousel width divided by the number of slides to show
					instance.slide_width = instance.carousel_width / instance.shown_slides;
				}
			}
		} else {
			// the width of the slide is the carousel width divided by the number of slides to show
			instance.slide_width = instance.carousel_width / instance.shown_slides;
		}

		console.log('shown slides = ', instance.shown_slides);
		console.log('gallery width = ', instance.carousel_width);
		console.log('list width = ', instance.slides * instance.slide_width);
		console.log('slide width = ', Wednesday.Gallery.instance[$(context).attr('id')].slide_width);

		console.log('carousel resizing');

		// set the slide list width to the slide width multiplied by the number of slides
		$('.gallery-images', context).width(instance.slides * instance.slide_width);

		// fix the slide image and text widths
		$('.gallery-images li', context).width(instance.slide_width);

		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		console.log('------------------------------------------- GALLERY : DRAW /');

		Wednesday.Gallery.genericUpdate(context);

	}

	// Previous event for default carousel
	Wednesday.Gallery.defaultPrevious = function (context) {
		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		instance.current_slide = instance.current_slide - 1;
		if (instance.current_slide < 0) {
			instance.current_slide = 0;
		}
		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		Wednesday.Gallery.genericUpdate(context);
	}

	// Next event for default carousel
	Wednesday.Gallery.defaultNext = function (context) {
		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		instance.current_slide = instance.current_slide + 1;
		if (instance.current_slide >= instance.slides) {
			instance.current_slide = (instance.slides - 1);
		}
		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		Wednesday.Gallery.genericUpdate(context);
	}

	// Previous event for fixed carousel
	Wednesday.Gallery.fixedPrevious = function (context) {
		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		instance.current_slide = instance.current_slide - 1;
		if (instance.current_slide < 0) {
			instance.current_slide = 0;
		}
		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		Wednesday.Gallery.genericUpdate(context);
	}

	// Next event for fixed carousel
	Wednesday.Gallery.fixedNext = function (context) {
		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		instance.current_slide = instance.current_slide + 1;
		if (instance.current_slide + instance.shown_slides >= instance.slides) {
			instance.current_slide = instance.slides - instance.shown_slides;
		}
		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		Wednesday.Gallery.genericUpdate(context);
	}

	// Previous event for circular carousel
	Wednesday.Gallery.circularPrevious = function (context) {
		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		instance.current_slide = instance.current_slide - 1;
		if (instance.current_slide < 0) {
			instance.current_slide = instance.slides - 1;
		}
		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		Wednesday.Gallery.genericUpdate(context);
	}

	// Next event for circular carousel
	Wednesday.Gallery.circularNext = function (context) {
		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		instance.current_slide = instance.current_slide + 1;
		if (instance.current_slide >= instance.slides) {
			instance.current_slide = 0;
		}
		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		Wednesday.Gallery.genericUpdate(context);
	}

	// Binds the appropriate events for the carousel type
	Wednesday.Gallery.genericBindEvents = function (context) {

		// redraw the carousel on resize
		$(window).resize($.debounce(function() { Wednesday.Gallery.genericDraw(context); }, 500));
		// $(window).resize(function() {
		// 	Wednesday.Gallery.genericDraw(context);
		// });

		//if user clicked on prev button
		$('a.prev', context).click(function(e) {

			if ($(context).hasClass('circular')) {
				Wednesday.Gallery.circularPrevious(context);
			} else if ($(context).hasClass('fixed')) {
				Wednesday.Gallery.fixedPrevious(context);
			} else {
				Wednesday.Gallery.defaultPrevious(context);
			}

			//cancel the default behavior
			e.preventDefault();

		});

		//if user clicked on next button
		$('a.next', context).click(function(e) {

			if ($(context).hasClass('circular')) {
				Wednesday.Gallery.circularNext(context);
			} else if ($(context).hasClass('fixed')) {
				Wednesday.Gallery.fixedNext(context);
			} else {
				Wednesday.Gallery.defaultNext(context);
			}

			//cancel the default behavior
			e.preventDefault();

		});

	}

	// Does the inital setup - the same for all carousel types
	Wednesday.Gallery.genericBuild = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		var doDraw = false;

		console.log('/ GALLERY : BUILD ------------------------------------------');

		Wednesday.Gallery.instance[$(context).attr('id')].slides = $('.gallery-images li', context).length;
		console.log('slides = ', Wednesday.Gallery.instance[$(context).attr('id')].slides);

		// establish numbers of slides shown, depending on breakpoints
		if ($(context).data('breakpoints')) {

			instance.breakpoints = $(context).data('breakpoints').split(',');
			instance.show_slides = $(context).data('showslides').split(',');

			console.log('breakpoints = ', instance.breakpoints,'shown slides = ', instance.show_slides);

			for(var i=0; i<instance.breakpoints.length; i++) {

				console.log('binding to breakpoint', instance.breakpoints[i]);
			 	$(window).on('enterBreakpoint' + instance.breakpoints[i], function () { Wednesday.Gallery.carouselDraw(context); });

			}

		} else {

			instance.shown_slides = $(context).data('showslides');

			if (isNaN(Wednesday.Gallery.instance[$(context).attr('id')].shown_slides)) { instance.shown_slides = 1; }

			console.log('no breakpoints, shown slides = ', instance.shown_slides);

			doDraw = true;
		}

		// add the currentSlide class to the current slide (should be the first slide at this point)
		$('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).addClass('current-slide', context);

		// move the last item before the first item incase the users decides to click previous as the first action
		if ($(context).hasClass('circular') && ($('.gallery-images li').length > instance.shown_slides)) {
			$('.gallery-images li:first', context).before($('.gallery-images li:last', context));
			//set the default item to correct position
			$('.gallery-images', context).css({'left' : 0 - instance.slide_width});
		}

		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		console.log('------------------------------------------ GALLERY : BUILD /');

		// calls that requre the updated instance
		if (doDraw) { Wednesday.Gallery.genericDraw(context); }

		// bind the controls
		Wednesday.Gallery.genericBindEvents(context);

	}

	window.Wednesday.Gallery = Wednesday.Gallery;

})(this.jQuery, this);

// Bind Events

$(document).ready(function() {
	if ($('.carousel').length) {
		$('.carousel').each(function() {
			var that = this;
			var id = $(this).attr('id');
			// $('.gallery-images', this).hide();

			Wednesday.Gallery.instance[id] = {};
			Wednesday.Gallery.instance[id].slides= 0;
			Wednesday.Gallery.instance[id].carousel_width = 0;
			Wednesday.Gallery.instance[id].slide_width = 0;
			Wednesday.Gallery.instance[id].current_slide = 0; // zero indexed, to make life fun
			Wednesday.Gallery.instance[id].shown_slides = 1;
			Wednesday.Gallery.instance[id].slides_offset = 0;

			$(that).imagesLoaded().done(function(instance) {
				// console.log('all images successfully loaded');
				Wednesday.Gallery.genericBuild(that);
			});
		});
	};
});
