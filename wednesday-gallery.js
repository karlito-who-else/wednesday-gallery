/**
 * Wednesday Gallery carousel actions v4.5
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

	Wednesday.Gallery.genericThumbnails = function (context, force_animate) {

		if ($('.gallery-thumbnails', context).length > 0) {

			var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

			console.log('------------------------------------------------------------');

			var offset = 0;
			var animate = typeof force_animate !== 'undefined' ? force_animate : false; // don't animate if we don't need to, unless we're told to

			if (instance.current_slide + 1 > instance.thumbs_upper) {
				console.log('thumb ', instance.current_slide + 1, ' > ', instance.thumbs_upper);
				offset = (instance.current_slide + 1) - instance.thumbs_upper;
				console.log
				instance.thumbs_upper += offset;
				instance.thumbs_lower += offset;
				animate = true;
			}

			if (instance.current_slide + 1 < instance.thumbs_lower) {
				console.log('thumb ', instance.current_slide + 1, ' < ', instance.thumbs_lower);
				offset = (instance.current_slide + 1 - instance.thumbs_lower);
				instance.thumbs_upper += offset;
				instance.thumbs_lower += offset;
				animate = true;
			}

			console.log('thumb boundaries: lower = ', instance.thumbs_lower, ', upper = ', instance.thumbs_upper);
			console.log('moving thumbnails by ', offset, ' x ', instance.thumb_width, ' = ', (0 - offset) * instance.thumb_width, 'px')

			if (animate) {
				$('.gallery-thumbnails', context).animate({'left' : parseInt($('.gallery-thumbnails', context).css('left')) + (0 - offset) * instance.thumb_width}, 500, function () {
					// thumbnails moved
				});
			}

			// remove the currentSlide class from the old current slide
			$('.gallery-thumbnails li.current-thumbnail', context).removeClass('current-thumbnail', context);
			// add the currentSlide class to the new current slide
			$('.gallery-thumbnails li[data-thumbnail="' + (instance.current_slide + 1) + '"]', context).addClass('current-thumbnail', context);

		}

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
				console.log($('.gallery-images', context).css('left'), ' to ', parseInt($('.gallery-images', context).css('left')) + instance.slide_width);
				$('.gallery-images', context).css({'left' : parseInt($('.gallery-images', context).css('left')) + instance.slide_width});

			}

		});

		// update the button visibility -----------------------------
		// buttons are always visible

		// update the thumbnails ------------------------------------
		Wednesday.Gallery.genericThumbnails(context);

		// no changes: 0Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

	}

	Wednesday.Gallery.fixedUpdate = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		// reposition the carousel ----------------------------------

		var offset = instance.current_slide * instance.slide_width;
		offset = 0 - offset; // flip, reverse it

		console.log('difference (to be moved) = ', offset);

		// move the slide container by the offset
		$('.gallery-images', context).animate({ 'left' : offset }, 500, function (e) {
			// slides moved
		});

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

		var offset_slides = (instance.current_slide + 1) - instance.shown_slides > 0 ? (instance.current_slide + 1) - instance.shown_slides : 0;
		offset_slides = 0 - offset_slides; // flip, reverse it
		var offset = offset_slides * instance.slide_width;

		console.log('difference (to be moved) = ', offset);

		// move the slide container by the offset
		$('.gallery-images', context).animate({ 'left' : offset }, 500, function (e) {
			// slides moved
		});

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

		console.group('/ GALLERY : UPDATE -----------------------------------------');
		console.log('gallery = ', $(context).attr('id'));

		if ($(context).hasClass('circular')) {
			console.log('movement = circular');
			Wednesday.Gallery.circularUpdate(context);
		} else if ($(context).hasClass('fixed')) {
			console.log('movement = fixed');
			Wednesday.Gallery.fixedUpdate(context);
		} else {
			console.log('movement = default');
			Wednesday.Gallery.defaultUpdate(context);
		}

		// move the current slide class -----------------------------

		console.log('current slide (updated) = ', (instance.current_slide + 1), '/', instance.slides);

		// remove the currentSlide class from the old current slide
		$('.gallery-images li.current-slide', context).removeClass('current-slide', context);

		// add the currentSlide class to the new current slide
		$('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).addClass('current-slide', context);

		console.groupEnd('/ ----------------------------------------- GALLERY : UPDATE');

		// no changes: 0Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

	}

	// Calls the appropriate drawing methods for the carousel type
	Wednesday.Gallery.genericDraw = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance

		console.group('/ GALLERY : DRAW -------------------------------------------');
		console.log('gallery = ', $(context).attr('id'));

		// grab the width of the carousel
		instance.carousel_width = $(context).innerWidth();

		// work out the breakpoint, if specified
		if (instance.breakpoints) {
			for(var i=0; i<instance.breakpoints.length; i++) {
				if ($('body').hasClass('breakpoint-' + instance.breakpoints[i])) {

					instance.shown_slides = instance.show_slides[i];
					// the width of the slide is the carousel width divided by the number of slides to show
					instance.slide_width = instance.carousel_width / instance.shown_slides;

					if ($('.gallery-thumbnails', context).length > 0) {
						instance.shown_thumbs = instance.show_thumbs[i];
						// the width of the thumbnail is the carousel width divided by the number of thumbnails to show
						instance.thumb_width = instance.carousel_width / instance.shown_thumbs;
					}

				}
			}
		} else {
			// the width of the slide is the carousel width divided by the number of slides to show
			instance.slide_width = instance.carousel_width / instance.shown_slides;
			if ($('.gallery-thumbnails', context).length > 0) {	instance.thumb_width = instance.carousel_width / instance.shown_thumbs; }
		}

		console.log('shown slides = ', instance.shown_slides);
		console.log('shown thumbs = ', instance.shown_thumbs);
		console.log('gallery width = ', instance.carousel_width);
		console.log('slide width = ', instance.slide_width);
		console.log('list width = ', instance.slides * instance.slide_width);
		console.log('thumb width = ', instance.thumb_width);
		console.log('list width = ', instance.slides * instance.thumb_width);


		console.log('carousel resizing');

		// set the slide list width to the slide width multiplied by the number of slides
		$('.gallery-images', context).width(instance.slides * instance.slide_width);

		// set the thumbnail list width to thumbnail width multiplied by the number of slides
		if ($('.gallery-thumbnails', context).length > 0) {
			$('.gallery-thumbnails', context).width(instance.slides * instance.thumb_width);
		}

		// fix the slide image and text widths
		$('.gallery-images li', context).width(instance.slide_width);

		// fix the thumbnail widths
		if ($('.gallery-thumbnails', context).length > 0) {
			$('.gallery-thumbnails li', context).width(instance.thumb_width);
		}

		// update the carousel height
		if ($('.slide-content .background', context).length > 0) {
			var imgheight = $('.slide-content .background', context).height();
			console.log('image height', imgheight);
		}

		console.log('set carousel height to ', $('.slide-content img', context).height());
		$(context).height($('.slide-content img', context).height());

		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		console.groupEnd('------------------------------------------- GALLERY : DRAW /');

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

		// clicked on prev button
		$('a.prev', context).on('click', function(e) {

			// don't do it if the carousel is already moving

			if ($('.gallery-images:animated', context).length) {

				return false;

			} else {

				if ($(context).hasClass('circular')) {
					Wednesday.Gallery.circularPrevious(context);
				} else if ($(context).hasClass('fixed')) {
					Wednesday.Gallery.fixedPrevious(context);
				} else {
					Wednesday.Gallery.defaultPrevious(context);
				}

				//cancel the default behavior
				e.preventDefault();

			}

		});

		// clicked on next button
		$('a.next', context).on('click', function(e) {

			if ($('.gallery-images:animated', context).length) {

				return false;

			} else {

				if ($(context).hasClass('circular')) {
					Wednesday.Gallery.circularNext(context);
				} else if ($(context).hasClass('fixed')) {
					Wednesday.Gallery.fixedNext(context);
				} else {
					Wednesday.Gallery.defaultNext(context);
				}

				//cancel the default behavior
				e.preventDefault();

			}

		});

		// clicked on a thumbnail
		$('.gallery-thumbnails li', context).on('click', function(e) {
			Wednesday.Gallery.instance[$(context).attr('id')].current_slide = $(this).data('thumbnail') - 1;
			Wednesday.Gallery.genericUpdate(context);
		});

	}

	// Does the inital setup - the same for all carousel types
	Wednesday.Gallery.genericBuild = function (context) {

		var instance = Wednesday.Gallery.instance[$(context).attr('id')]; // get the relevant gallery instance
		var doDraw = false;

		console.group('/ GALLERY : BUILD ------------------------------------------');
		console.log('gallery = ', $(context).attr('id'));
		console.log('options = ', $(context).attr('class'));

		instance.slides = $('.gallery-images li', context).length;
		console.log('slides = ', instance.slides);

		// establish numbers of slides shown, depending on breakpoints
		if ($(context).data('breakpoints')) {

			instance.breakpoints = $(context).data('breakpoints').split(',');
			instance.show_slides = $(context).data('showslides').split(',');

			if ($('.gallery-thumbnails', context).length > 0) {
				instance.show_thumbs = $(context).data('showthumbs').split(',');
			}

			console.log('breakpoints = ', instance.breakpoints,'shown slides = ', instance.show_slides, ', shown thumbs = ', instance.shown_thumbs);

			for(var i=0; i<instance.breakpoints.length; i++) {

				console.log('binding to breakpoint', instance.breakpoints[i]);
			 	$(window).on('enterBreakpoint' + instance.breakpoints[i], function () { Wednesday.Gallery.genericDraw(context); });

			}

			doDraw = true; // this may cause a double draw on desktop

		} else {

			instance.shown_slides = $(context).data('showslides');
			instance.shown_thumbs = $(context).data('showthumbs');

			if (isNaN(instance.shown_slides)) { instance.shown_slides = 1; }
			if (isNaN(instance.shown_thumbs)) { instance.shown_thumbs = 1; }

			console.log('no breakpoints, shown slides = ', instance.shown_slides, ', shown thumbs = ', instance.shown_thumbs);

			doDraw = true;
		}

		// set the thumb window
		instance.thumbs_lower = 1;
		instance.thumbs_upper = instance.shown_thumbs;

		// add the currentSlide class to the current slide and thumbnail (should be the first slide at this point)
		$('.gallery-images li[data-image="' + (instance.current_slide + 1) + '"]', context).addClass('current-slide', context);

		if ($('.gallery-thumbnails', context).length > 0) {
			$('.gallery-thumbnails li[data-thumbnail="' + (instance.current_slide + 1) + '"]', context).addClass('current-thumbnail', context);
		}

		// move the last item before the first item incase the users decides to click previous as the first action
		if ($(context).hasClass('circular') && ($('.gallery-images li').length > instance.shown_slides)) {
			$('.gallery-images li:first', context).before($('.gallery-images li:last', context));
			//set the default item to correct position
			$('.gallery-images', context).css({'left' : 0 - instance.slide_width});
		}

		Wednesday.Gallery.instance[$(context).attr('id')] = instance; // write back any changes

		console.groupEnd('------------------------------------------ GALLERY : BUILD /');

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
			Wednesday.Gallery.instance[id].shown_thumbs = 1;
			Wednesday.Gallery.instance[id].slides_offset = 0;
			Wednesday.Gallery.instance[id].thumbs_lower = 0;
			Wednesday.Gallery.instance[id].thumbs_upper = 0;

			$(that).imagesLoaded().done(function(instance) {
				// console.log('all images successfully loaded');
				Wednesday.Gallery.genericBuild(that);
			});
		});
	};
});
