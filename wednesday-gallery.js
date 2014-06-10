/**
 * Wednesday Gallery carousel actions
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

	Wednesday.Gallery.carouselCalculate = function(context) {
		// grab the width of the carousel
		Wednesday.Gallery.instance[$(context).attr('id')].carousel_width = $(context).innerWidth();
		console.log('gallery width = ', Wednesday.Gallery.instance[$(context).attr('id')].carousel_width);

		// work out the breakpoint, if specified
		if (Wednesday.Gallery.instance[$(context).attr('id')].breakpoints) {
			for(var i=0; i<Wednesday.Gallery.instance[$(context).attr('id')].breakpoints.length; i++) {
				// console.log('check breakpoint breakpoint-', Wednesday.Gallery.instance[$(context).attr('id')].breakpoints[i]);
				if ($('body').hasClass('breakpoint-' + Wednesday.Gallery.instance[$(context).attr('id')].breakpoints[i])) {
					Wednesday.Gallery.instance[$(context).attr('id')].shown_slides = Wednesday.Gallery.instance[$(context).attr('id')].show_slides[i];
					console.log('breakpoint = ', Wednesday.Gallery.instance[$(context).attr('id')].breakpoints[i], 'show slides = ', Wednesday.Gallery.instance[$(context).attr('id')].shown_slides);
					Wednesday.Gallery.instance[$(context).attr('id')].slide_width = Wednesday.Gallery.instance[$(context).attr('id')].carousel_width / Wednesday.Gallery.instance[$(context).attr('id')].shown_slides;
				}
			}
		} else {
			console.log('no breakpoints');
			// NEW = the width of the slide is the carousel width divided by the number of slides to show
			Wednesday.Gallery.instance[$(context).attr('id')].slide_width = Wednesday.Gallery.instance[$(context).attr('id')].carousel_width / Wednesday.Gallery.instance[$(context).attr('id')].shown_slides;
		}

		console.log('slide width = ', Wednesday.Gallery.instance[$(context).attr('id')].slide_width);
	}

	Wednesday.Gallery.carouselSize = function(context) {
		console.log('carousel resizing');
		// set the slide list width
		$('.gallery-images', context).width($('.gallery-images li', context).length * Wednesday.Gallery.instance[$(context).attr('id')].slide_width);
		// fix the slide image and text widths
		$('.gallery-images li', context).width(Wednesday.Gallery.instance[$(context).attr('id')].slide_width);
	}

	Wednesday.Gallery.carouselCurrentSlide = function(context) {
		console.log($(context).attr('id'), ': current slide = ', (Wednesday.Gallery.instance[$(context).attr('id')].current_slide + 1), '/', $('.gallery-images li', context).length);
		// remove the currentSlide class from the old current slide
		$('.gallery-images li.current-slide', context).removeClass('current-slide', context);
		// add the currentSlide class to the new current slide
		$('.gallery-images li[data-image="' + (Wednesday.Gallery.instance[$(context).attr('id')].current_slide + 1) + '"]', context).addClass('current-slide', context);
	}

	Wednesday.Gallery.carouselPosition = function(context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // to make the following a little more readable

		if (!$(context).hasClass('fixed') && ((instance.current_slide + 1) > instance.shown_slides)) {
			instance.slides_offset = (instance.current_slide + 1) - instance.shown_slides;
			var offset = 0 - (instance.slides_offset * instance.slide_width);
			$('.gallery-images', context).css({ 'margin-left' : offset });
		} else if ($(context).hasClass('fixed') || ((instance.current_slide + 1) < (instance.slides_offset + 1))) {
			instance.slides_offset = instance.current_slide;
			var offset = 0 - (instance.slides_offset * instance.slide_width);
			$('.gallery-images', context).css({ 'margin-left' : offset });
		}

		console.log('offset = ', offset);
	}

	Wednesday.Gallery.carouselCheckButtons = function(context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // to make the following a little more readable

		if (!$(context).hasClass('circular')) {
			// control button display for non-circular carousels
			if (instance.slides > instance.shown_slides) {
				if (instance.current_slide <= 0) {
					$('a.prev', context).hide();
				} else {
					$('a.prev', context).show();
				}
				if (
					(!$(context).hasClass('fixed') && ((instance.current_slide + 1) >= instance.slides)) ||
					($(context).hasClass('fixed') && (instance.current_slide >= instance.slides - instance.shown_slides))
				) {
					$('a.next', context).hide();
				} else {
					$('a.next', context).show();
				}
			} else {
				// all slides are on screen
				$('a.prev', context).hide();
				$('a.next', context).hide();
			}
		}
	}

	Wednesday.Gallery.carouselDraw = function(context) {
		Wednesday.Gallery.carouselCalculate(context);
		Wednesday.Gallery.carouselSize(context);
		Wednesday.Gallery.carouselCurrentSlide(context);
		Wednesday.Gallery.carouselPosition(context);
		Wednesday.Gallery.carouselCheckButtons(context);
		$('.gallery-images', context).fadeIn("slow", function() {
		    // Animation complete
		    console.log('faded in');
 		});
	}

	Wednesday.Gallery.carouselBindButtons = function(context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // to make the following a little more readable

		//if user clicked on prev button
		$('a.prev', context).click(function(e) {

			instance.current_slide -= 1;
			if (instance.current_slide < 0) { instance.current_slide = 0; }

			Wednesday.Gallery.carouselCurrentSlide(context);
			Wednesday.Gallery.carouselPosition(context);
			Wednesday.Gallery.carouselCheckButtons(context);

			//cancel the link behavior
			e.preventDefault();

		});

		//if user clicked on next button
		$('a.next', context).click(function(e) {

			instance.current_slide += 1;
			if (!$(context).hasClass('fixed') && ((instance.current_slide + 1) > instance.slides)) { instance.current_slide = (instance.slides - 1); }
			if ($(context).hasClass('fixed') && (instance.current_slide + 1 + instance.shown_slides > instance.slides)) { instance.current_slide = instance.slides - instance.shown_slides; }

			Wednesday.Gallery.carouselCurrentSlide(context);
			Wednesday.Gallery.carouselPosition(context);
			Wednesday.Gallery.carouselCheckButtons(context);

			//cancel the link behavior
			e.preventDefault();

		});

	}

	Wednesday.Gallery.carouselBuild = function(context) {

		Wednesday.Gallery.instance[$(context).attr('id')].slides = $('.gallery-images li', context).length;
		console.log('slides = ', Wednesday.Gallery.instance[$(context).attr('id')].slides);

		// establish numbers of slides shown, depending on breakpoints
		if ($(context).data('breakpoints')) {
			Wednesday.Gallery.instance[$(context).attr('id')].breakpoints = $(context).data('breakpoints').split(',');
			Wednesday.Gallery.instance[$(context).attr('id')].show_slides = $(context).data('showslides').split(',');
			console.log('breakpoints = ', Wednesday.Gallery.instance[$(context).attr('id')].breakpoints,'slides shown = ', Wednesday.Gallery.instance[$(context).attr('id')].show_slides);
			for(var i=0; i<Wednesday.Gallery.instance[$(context).attr('id')].breakpoints.length; i++) {
				console.log('binding to breakpoint', Wednesday.Gallery.instance[$(context).attr('id')].breakpoints[i]);
			 	$(window).on('enterBreakpoint' + Wednesday.Gallery.instance[$(context).attr('id')].breakpoints[i], function () { Wednesday.Gallery.carouselDraw(context); });
			}
		} else {
			Wednesday.Gallery.instance[$(context).attr('id')].shown_slides = $(context).data('showslides');
			if (isNaN(Wednesday.Gallery.instance[$(context).attr('id')].shown_slides)) { Wednesday.Gallery.instance[$(context).attr('id')].shown_slides = 1; }
			console.log('no breakpoints, slides shown = ', Wednesday.Gallery.instance[$(context).attr('id')].shown_slides);
			Wednesday.Gallery.carouselDraw(context);
		}

		// redraw the carousel on resize
		$(window).resize(function() {
			Wednesday.Gallery.carouselDraw(context);
		});

		// bind the controls
		Wednesday.Gallery.carouselBindButtons(context);

	}

	window.Wednesday.Gallery = Wednesday.Gallery;

})(this.jQuery, this);

// Bind Events

$(document).ready(function() {
	if ($('.carousel').length) {
		$('.carousel').each(function() {
			var that = this;
			var id = $(this).attr('id');
			$('.gallery-images', this).hide();

			Wednesday.Gallery.instance[id] = {};
			Wednesday.Gallery.instance[id].slides= 0;
			Wednesday.Gallery.instance[id].carousel_width = 0;
			Wednesday.Gallery.instance[id].slide_width = 0;
			Wednesday.Gallery.instance[id].current_slide = 0;
			Wednesday.Gallery.instance[id].shown_slides = 1;
			Wednesday.Gallery.instance[id].slides_offset = 0;

			$(that).imagesLoaded().done(function(instance) {
				// console.log('all images successfully loaded');
				Wednesday.Gallery.carouselBuild(that);
			});
		});
	};
});
