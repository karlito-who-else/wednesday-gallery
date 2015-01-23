=== Plugin Name ===
Contributors: jamesg@wednesdayagency.com
Donate link: http://wednesdayagency.com/
Tags: gallery, carousel
Requires at least: 3.6
Tested up to: 3.9.1
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Overrides the default Wordpress gallery widget to provide additional capabilities, such as carousels.

== Description ==


== Installation ==

To install the plugin:

1. Unzip `wednesday-gallery` into the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Add a `[gallery]` short tag to your page, our insert a media gallery.

== Usage ==

* **breakpoints** - specifies the breakpoints at which the corresponding numbers of slides and thumbnails,
defined by `showslides` and `showthumbs` respectively, will be shown. Specified as a list of pixel widths, e.g.
`breakpoints="320,768,1024"`.
* **class** - add the supplied class declaration to the outer container of the gallery, e.g. `class="mystyle"`.
* **columns** - erm.
* **id** - the ID of the outer container of the gallery.
* **ids** - a list of image post IDs to be displayed.
* **layout** - controls the underlying structure of the output gallery, e.g. `layout="carousel"`.
	* **[not specified]** - outputs a simple list of image tags or, if `usedivs` has been specified, DIVs with background images.
	This is the default.
	* **carousel** - outputs the necessary markup and includes JavaScript for a working carousel.
	* **carousel-with-thumbs** - outputs the necessary markup and includes JavaScript for a working carousel with thumbnail strip.
	* **json** - outputs the slide information as a block of JSON data.
	* **tiles** - outputs the slides as DIVs, with nested DIVs for slide information.
* **link** - erm.
* **name** - the name of the gallery.
* **options** - additional options for controlling the output of the gallery. Specified as a comma-separated list, e.g. `options="centered,withlinks"`.
	* **centered** - centers the current image within the carousel.
	* **circular** - creates a circular, never-ending carousel.
	* **fixed** - can't remember this one right now, I suspect it's awesome!
	* **loader** - display the loading graphic while the images are loading.
	* **nodimensions** - output images without dimensions, for styling by CSS.
	* **usedivs** - out the images as the backgrounds of DIVs, not IMG tags.
	* **withlinks** - wrap each image in its link.
	* **wrapimages** - add a DIV around each IMG tag.
* **orderby** - control the order of the images, as per a standard WPQuery.
* **showslides** - specify the number of slides to display per breakpoint, e.g. `showslides="1,3,5"`.
* **showthumbs** - specify the number of thumbnails to display per breakpoint, e.g. `showslides="3,6,9"`.
* **size** - specify the default size of the images ("thumbnail,"medium","large","original").
* **sizes** - a comma-separated list of slide sizes to be output in order and then repeated, e.g. `size="medium,medium,large"`.
* **template** - encoded HTML for the slide layout. See the placeholders below.
* **textnext** - the text for the next slide control.
* **textprevious** - the text for the previous slide control.
* **texttoggle** - the text for the thumbnail toggle control.
* **thumbtemplate** - encoded HTML for the thumbnail layout. See the placeholders below.

When specifying template HTML, you can use the following placeholders for slide data. Surround them with percentage symbols, e.g. `%TITLE%`.

* **ALT_TEXT** - alternative text for the image.
* **DATE_DAY** - day part of the image upload date.
* **DATE_MONTH** - month part of the image upload date.
* **DATE_YEAR** - year part of the image upload date.
* **DESCRIPTION** - description of the image.
* **EXCERPT** - excerpt of the image description.
* **IMAGE_COUNT** - the image's position in the gallery.
* **IMAGE_ID** - post ID of the image.
* **IMAGE** - a fully formed IMG element for the image.
* **IMAGE_URL** - URL of the image.
* **LINK_URL** - URL of the link associated with the image.
* **NEXT** - next slide control.
* **POST_URL** - URL of the image post.
* **PREVIOUS** - previous slide control.
* **SIZE** - size of the image ("thumbnail","medium","large","original").
* **THUMB** - a fully formed IMG element for the thumbnail.
* **THUMB_URL** - URL of the thumbnail image.
* **TITLE** - title of the image.
* **UPLOAD_URL** - the original (non-CDN) URL of the image.
