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

	Wednesday.Gallery.updateThumbnails = function(context) {
    // console.log('curr', Wednesday.Gallery.instance[$(context).attr('id')].current_slide);
		var currentThumbnail = $('.gallery-thumbnails', context).children('li[data-thumbnail="' + Wednesday.Gallery.instance[$(context).attr('id')].current_slide.attr('data-image') + '"]');
    // var currentThumbnail = Wednesday.Gallery.instance[$(context).attr('id')].current_slide;
    // console.log('currentThumbnail', currentThumbnail);
		// remove currentSlide class from the previous thumbnail
		$('.gallery-thumbnails li.currentSlide', context).removeClass('currentSlide');
		// add currentSlide class to the new thumbnail
		currentThumbnail.addClass('currentSlide');

		var container_width = $(context).innerWidth();
		var container_offset = $(context).offset();
    // console.log('container_offset', container_offset);
    var container_left = container_offset.left;
		var container_right = container_left + container_width;
		var thumbnail_width = currentThumbnail.outerWidth();
		var thumbnail_offset = currentThumbnail.offset();
    // console.log('thumbnail_offset', thumbnail_offset);
    var thumbnail_left = thumbnail_offset.left;
		var thumbnail_right = thumbnail_left + thumbnail_width;

		// do the shuffle
		var shift = 0;
		var limiter = 0;
		while((thumbnail_right + shift) > container_right && limiter < 10) {
			// if the right (left+width) of the thumbnail is greater than the right of the carousel, move the thumbnails to the left
			shift = shift - thumbnail_width;
			limiter++;
		}
		limiter = 0;
		while((thumbnail_left + shift) < container_left && limiter < 10) {
			// if the left of thumbnail is less than the left of the carouse, move the thumbnails to the right
			shift = shift + thumbnail_width;
			limiter++;
		}
		if (shift != 0) $('.gallery-thumbnails', context).animate({left : $('.gallery-thumbnails', context).position().left + shift});
	}

	Wednesday.Gallery.carouselUpdateCurrentSlide = function(context) {

		// remove the currentSlide class from the old current slide
		$('.gallery-images li.currentSlide', context).removeClass('currentSlide');
		// find the new current slide
		Wednesday.Gallery.instance[$(context).attr('id')].current_slide = $('.gallery-images li:nth-child(2)', context);
		// add the currentSlide class to the second item
		Wednesday.Gallery.instance[$(context).attr('id')].current_slide.addClass('currentSlide', context);

		// update the thumbnails to indicate the new current slide
		Wednesday.Gallery.updateThumbnails(context);
	}

	Wednesday.Gallery.carouselReposition = function(context) {
		//grab the width of the image
		Wednesday.Gallery.instance[$(context).attr('id')].item_width = $('.gallery-images li', context).outerWidth(true);
		//and calculate left value
		Wednesday.Gallery.instance[$(context).attr('id')].left_value = (Wednesday.Gallery.instance[$(context).attr('id')].item_width / 2) * (-1);
		//set the default item to the correct position
		$('.gallery-images', context).css({'left' : Wednesday.Gallery.instance[$(context).attr('id')].left_value});
		// fix the slide text widths
		$('.gallery-images li .slide-content', context).width($('.gallery-images li .slide-content img', context).width());
	}

	Wednesday.Gallery.carouselBindButtons = function(context) {

		//if user clicked on prev button
		$('a.prev', context).click(function(e) {

			//get the right position
			var left_indent = parseInt($('.gallery-images', context).css('left')) + Wednesday.Gallery.instance[$(context).attr('id')].item_width;

			//slide the item
			$('.gallery-images', context).animate({'left' : left_indent}, 200, function(){

				//move the last item and put it as first item
				$('.gallery-images li:first', context).before($('.gallery-images li:last', context));

				Wednesday.Gallery.carouselUpdateCurrentSlide(context);

				//set the default item to correct position
				$('.gallery-images', context).css({'left' : Wednesday.Gallery.instance[$(context).attr('id')].left_value});

			});

			//cancel the link behavior
			e.preventDefault();

		});

		//if user clicked on next button
		$('a.next', context).click(function(e) {

			//get the right position
			var left_indent = parseInt($('.gallery-images', context).css('left')) - Wednesday.Gallery.instance[$(context).attr('id')].item_width;

			//slide the item
			$('.gallery-images', context).animate({'left' : left_indent}, 200, function () {

				//move the first item and put it as last item
				$('.gallery-images li:last', context).after($('.gallery-images li:first', context));

				Wednesday.Gallery.carouselUpdateCurrentSlide(context);

				//set the default item to correct position
				$('.gallery-images', context).css({'left' : Wednesday.Gallery.instance[$(context).attr('id')].left_value});

			});

			//cancel the link behavior
			e.preventDefault();

		});

	}

	Wednesday.Gallery.carouselSetup = function(context) {
		// console.log('carouselSetup');

		// move the last item before the first item incase the users decides to click previous as the first action
		$('.gallery-images li:first', context).before($('.gallery-images li:last', context));

		// reposition the carousel as necessary (for centering, etc.)
		Wednesday.Gallery.carouselReposition(context);

		// bind the controls
		Wednesday.Gallery.carouselBindButtons(context);

		// set the current slide
		Wednesday.Gallery.carouselUpdateCurrentSlide(context);

    $(window).resize(function() {
      Wednesday.Gallery.carouselReposition(context);
    });
	}

	//a simple function to click next link
	//a timer will call this function, and the rotation will begin :)
	Wednesday.Gallery.carouselRotate = function() {
		// $('.next').click();
	}

	window.Wednesday.Gallery = Wednesday.Gallery;

})(this.jQuery, this);

// Bind Events

$(document).ready(function() {
	if ($('.carousel').length) {
		$('.carousel').each(function() {
      var that = this;
      var id = $(this).attr('id');

      // console.log(Wednesday.Gallery);
      Wednesday.Gallery.instance[id] = {};
      Wednesday.Gallery.instance[id].item_width = 0;
      Wednesday.Gallery.instance[id].left_value = 0;
      Wednesday.Gallery.instance[id].current_slide = 0;
      // Wednesday.Gallery.instance[id].current_slide = $(this).find('.gallery-images li').first();
      // console.log(Wednesday.Gallery.instance[id].current_slide);

      $(that).imagesLoaded()
      .done(function(instance) {
        // console.log('all images successfully loaded');
        Wednesday.Gallery.carouselSetup(that);
      });

    });
	};
});
