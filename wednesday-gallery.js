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

	Wednesday.Gallery.item_width = 0;
	Wednesday.Gallery.left_value = 0;
	Wednesday.Gallery.current_slide = 0;

	Wednesday.Gallery.updateThumbnails = function() {
		var currentThumbnail = $('.carousel .gallery-thumbnails').children("li[data-thumbnail='" + Wednesday.Gallery.current_slide.data("image") + "']");
		// remove currentSlide class from the previous thumbnail
		$('.carousel .gallery-thumbnails li.currentSlide').removeClass('currentSlide');
		// add currentSlide class to the new thumbnail
		currentThumbnail.addClass('currentSlide');

		var container_width = $('.carousel').innerWidth();
		var container_left = $('.carousel').offset().left;
		var container_right = container_left + container_width;
		var thumbnail_width = currentThumbnail.outerWidth();
		var thumbnail_left = currentThumbnail.offset().left;
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
		if (shift != 0) $('.carousel .gallery-thumbnails').animate({left : $('.carousel .gallery-thumbnails').position().left + shift});
	}

	Wednesday.Gallery.carouselUpdateCurrentSlide = function() {

		// remove the currentSlide class from the old current slide
		$('.carousel .gallery-images li.currentSlide').removeClass('currentSlide');
		// find the new current slide
		Wednesday.Gallery.current_slide = $('.gallery-images li:nth-child(2)');
		// add the currentSlide class to the second item
		Wednesday.Gallery.current_slide.addClass('currentSlide');

		// update the thumbnails to indicate the new current slide
		Wednesday.Gallery.updateThumbnails();
	}

	Wednesday.Gallery.carouselReposition = function() {
		console.log('carouselResize');
		//grab the width of the image
		Wednesday.Gallery.item_width = $('.carousel .gallery-images li').outerWidth(true);
		console.log('Wednesday.Gallery.item_width = ', Wednesday.Gallery.item_width);
		//and calculate left value
		Wednesday.Gallery.left_value = (Wednesday.Gallery.item_width / 2) * (-1);
		//set the default item to the correct position
		$('.carousel .gallery-images').css({'left' : Wednesday.Gallery.left_value});

		// fix the slide text widths
		$('.carousel .gallery-images li .slide-content').width($('.carousel .gallery-images li .slide-content img').width());

	}

	Wednesday.Gallery.carouselBindButtons = function() {

		//if user clicked on prev button
		$('a.prev').click(function(e) {

			//get the right position
			var left_indent = parseInt($('.carousel .gallery-images').css('left')) + Wednesday.Gallery.item_width;

			//slide the item
			$('.carousel .gallery-images').animate({'left' : left_indent}, 200, function(){

				//move the last item and put it as first item
				$('.carousel .gallery-images li:first').before($('.carousel .gallery-images li:last'));

				Wednesday.Gallery.carouselUpdateCurrentSlide();

				//set the default item to correct position
				$('.carousel .gallery-images').css({'left' : Wednesday.Gallery.left_value});

			});

			//cancel the link behavior
			e.preventDefault();

		});

		//if user clicked on next button
		$('a.next').click(function(e) {

			//get the right position
			var left_indent = parseInt($('.carousel .gallery-images').css('left')) - Wednesday.Gallery.item_width;

			//slide the item
			$('.carousel .gallery-images').animate({'left' : left_indent}, 200, function () {

				//move the first item and put it as last item
				$('.carousel .gallery-images li:last').after($('.carousel .gallery-images li:first'));

				Wednesday.Gallery.carouselUpdateCurrentSlide();

				//set the default item to correct position
				$('.carousel .gallery-images').css({'left' : Wednesday.Gallery.left_value});

			});

			//cancel the link behavior
			e.preventDefault();

		});

	}

	Wednesday.Gallery.carouselSetup = function() {
		console.log('carouselSetup');

		// move the last item before the first item incase the users decides to click previous as the first action
		$('.carousel .gallery-images li:first').before($('.carousel .gallery-images li:last'));

		// reposition the carousel as necessary (for centering, etc.)
		Wednesday.Gallery.carouselReposition();

		// bind the controls
		Wednesday.Gallery.carouselBindButtons();

		// set the current slide
		Wednesday.Gallery.carouselUpdateCurrentSlide();

	}

	// Wednesday.Gallery.carouselSetup = function() {

	// 	//rotation speed and timer
	// 	var speed = 5000;
	// 	// var run = setInterval('rotate()', speed);

	// 	// Wednesday.Gallery.carouselResize();


	// 	// add the currentSlide to the first slide (which is second in position due to the previous command)
	// 	$('.carousel .gallery-images li:nth-child(2)').addClass('currentSlide');
	// 	$('.carousel .gallery-thumbnails li:first').addClass('currentSlide');

	// 	//if user clicked on prev button
	// 	$('a.prev').click(function(e) {

	// 		//get the right position
	// 		var left_indent = parseInt($('.carousel .gallery-images').css('left')) + Wednesday.Gallery.item_width;

	// 		//slide the item
	// 		$('.carousel .gallery-images').animate({'left' : left_indent}, 200, function(){

	// 			//move the last item and put it as first item
	// 			$('.carousel .gallery-images li:first').before($('.carousel .gallery-images li:last'));

	// 			Wednesday.Gallery.carouselUpdateCurrentSlide();

	// 			//set the default item to correct position
	// 			$('.carousel .gallery-images').css({'left' : Wednesday.Gallery.left_value});

	// 		});

	// 		//cancel the link behavior
	// 		e.preventDefault();

	// 	});

	// 	//if user clicked on next button
	// 	$('a.next').click(function(e) {

	// 		//get the right position
	// 		var left_indent = parseInt($('.carousel .gallery-images').css('left')) - Wednesday.Gallery.item_width;

	// 		//slide the item
	// 		$('.carousel .gallery-images').animate({'left' : left_indent}, 200, function () {

	// 			//move the first item and put it as last item
	// 			$('.carousel .gallery-images li:last').after($('.carousel .gallery-images li:first'));

	// 			Wednesday.Gallery.carouselUpdateCurrentSlide();

	// 			//set the default item to correct position
	// 			$('.carousel .gallery-images').css({'left' : Wednesday.Gallery.left_value});

	// 		});

	// 		//cancel the link behavior
	// 		e.preventDefault();

	// 	});

	// 	//if mouse hover, pause the auto rotation, otherwise rotate it
	// 	$('.carousel .gallery-images').hover(
	// 		function() {
	// 			// clearInterval(run);
	// 		},
	// 		function() {
	// 			// run = setInterval('Wednesday.Gallery.carouselRotate()', speed);
	// 		}
	// 	);
	// }

	//a simple function to click next link
	//a timer will call this function, and the rotation will begin :)
	Wednesday.Gallery.carouselRotate = function() {
		// $('.next').click();
	}

	window.Wednesday.Gallery = Wednesday.Gallery;

})(this.jQuery, this);

// Bind Events

$(document).ready(function() {
	$('.carousel').imagesLoaded(Wednesday.Gallery.carouselSetup);
});

$(window).resize(function() {
	Wednesday.Gallery.carouselReposition();
});
