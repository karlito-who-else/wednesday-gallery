<?php
	/*
	Plugin Name: Wednesday - Gallery
	Plugin URI: http://www.wednesdayagency.com/
	Description: The Wednesday Wordpress gallery plugin.
	Version: 1.0
	Author: James Gardiner (jamesg@wednesdayagency.com)
	Author URI: http://www.wednesdayagency.com/
	*/

	function wednesday_gallery_jquery_enqueue() {
	   wp_deregister_script('jquery');
	   wp_register_script('jquery', "http" . ($_SERVER['SERVER_PORT'] == 443 ? "s" : "") . "://code.jquery.com/jquery-2.1.1.min.js", false, null);
	   wp_enqueue_script('jquery');
	}

	function wednesday_gallery_scripts() {
		// wp_enqueue_style( 'style-name', get_stylesheet_uri() );
		wp_enqueue_script('gallery-script', plugins_url() . '/wednesday-gallery/wednesday-gallery.js', array(), '1.0.0', true);
	}

	function wednesday_gallery_getAttachmentURL($id, $image_size) {

		$image_array = wp_get_attachment_image_src($id, $image_size);

		if ($image_array) {
			return $image_array[0];
		}

		return '';
	}

	function wednesday_gallery_shortcode($atts) {

		/* based upon a concept by ShibaShake (http://shibashake.com/wordpress-theme/how-to-render-your-own-wordpress-photo-gallery) */

		global $post;

		if (!empty($atts['ids'])) {
			// 'ids' is explicitly ordered, unless you specify otherwise.
			if (empty( $atts['orderby'])) $atts['orderby'] = 'post__in';
			$atts['include'] = $atts['ids'];
		}

		extract(shortcode_atts(array(
			'orderby' => 'menu_order ASC, ID ASC',
			'include' => '',
			'id' => $post->ID,
			'itemtag' => 'dl',
			'icontag' => 'dt',
			'captiontag' => 'dd',
			'columns' => 3,
			'size' => 'medium',
			'link' => 'file',
			'name' => 'gallery',
			'layout' => '',
			'template' => '',
			'toggletext' => 'thumbnails',
			'usedivs' => false,
			'withlinks' => false,
			'withcaptions' => true,
			'withshare' => true
		), $atts));

		// set the ID and classes
		$gallery_id = $name != 'gallery' ? "id=\"$name\"" : '';

		// load the template sizes
		$sizes = array();
		if (!empty($template)) {
			$sizes = explode(',', $template);
		}

		switch($layout) {
			case 'carousel':
			case 'carousel-with-thumbs':
				echo "\n<div $gallery_id class=\"gallery carousel\">\n";
				echo "\t<div class=\"controls\">\n";
				echo "\t\t<a href=\"#\" class=\"prev\">previous</a>\n";
				echo "\t\t<a href=\"#\" class=\"next\">next</a>\n";
				echo "\t</div>\n";
				echo "\t<ul class=\"gallery-images\">\n";
				break;
			case 'tiles':
				echo "\n<div $gallery_id class=\"gallery tiles\">\n";
				break;
			default:
				echo "\n<div $gallery_id class=\"gallery\">\n";
				break;
		}

		// get the images

		$imagecount = 0;
		$templatecount = 0;

		$args = array(
			'post_type' => 'attachment',
			'post_status' => 'inherit',
			'post_mime_type' => 'image',
			'orderby' => $orderby
		);

		if (!empty($include))
			$args['include'] = $include;
		else {
			$args['post_parent'] = $id;
			$args['numberposts'] = -1;
		}

		$images = get_posts($args);

		foreach ( $images as $image ) {
			$imagecount++;

			// use the template size if available, otherwise the specified size
			if (count($sizes) > 0) {
				if ($templatecount < count($sizes)) {
					$size = $sizes[$templatecount];
				} else {
					$templatecount = 0;
					$size = $size[$templatecount];
				}
			}

			$caption = $withcaptions ? '<span class="caption">' . $image->post_title . '</span>' : '';
			$share = $withshare ? '<span class="share">share</span>' : '';

			switch($layout) {
				case 'carousel':
				case 'carousel-with-thumbs':
					$before_image = '<li data-image="' . $imagecount .'"><div class="slide-content">';
					$after_image = $caption . $share . '</div></li>';
					break;
				case 'tiles':
					$before_image = '<div data-image="' . $imagecount . '" class="tile ' . $size . '">';
					$after_image = $caption . $share . '</div>';
					break;
				default:
					$before_image = '';
					$after_image = $caption . $share . '';
					break;
			}

			// apply links if "withlinks" has been specified
			$before_image = $withlinks ? $before_image . '<a href="' . wp_get_attachment_url($image->ID) . '">' : $before_image;
			$after_image = $withlinks ? $after_image . '</a>' : $after_image;

			$caption = $image->post_excerpt;

			$description = $image->post_content;
			if($description == '') $description = $image->post_title;

			$image_alt = get_post_meta($image->ID,'_wp_attachment_image_alt', true);

			// render your gallery here
			if ($usedivs) {
				echo "\t\t$before_image",
					"<div style=\"background-image: url('",
					wednesday_gallery_getAttachmentURL($image->ID, $size),
					"');\"></div>",
					"$after_image\n";
			} else {
				echo "\t\t$before_image",
					// str_replace(
					// 	'img ',
					// 	'img data-fullsize="' . wp_get_attachment_url($image->ID) . '" ',
						preg_replace(
							'/(width|height)=\"\d*\"\s/',
							"",
							wp_get_attachment_image($image->ID, $size)
						)
					// )
					,
					"$after_image\n";
			}

			$templatecount++;
		}

		// add extra markup for other layouts
		switch($layout) {
			case 'carousel':
				echo "\t</ul>\n";
				break;
			case 'carousel-with-thumbs':
				echo "\t</ul>\n";
				echo "\t<a href=\"#\" class=\"gallery-thumbnails-toggle\">$toggletext</a>\n";
				echo "\t<ul class=\"gallery-thumbnails\">\n";
				$imagecount = 0;
				foreach ( $images as $image ) {
					$imagecount++;

					$before_image = '<li data-thumbnail="' . $imagecount .'">';
					$after_image = '</li>';

					$caption = $image->post_excerpt;

					$description = $image->post_content;
					if($description == '') $description = $image->post_title;

					$image_alt = get_post_meta($image->ID,'_wp_attachment_image_alt', true);

					if ($usedivs) {
						echo "\t\t$before_image",
							"<div style=\"background-image: url('",
							wednesday_gallery_getAttachmentURL($image->ID, $size),
							"');\"></div>",
							"$after_image\n";
					} else {
						// render your gallery here
						echo "\t\t$before_image",
							preg_replace( '/(width|height)=\"\d*\"\s/', "", wp_get_attachment_image($image->ID, 'thumbnail')),
							// echo "$imagecount<br/>"; // debugging
							"$after_image\n";
					}
				}
				echo "\t</ul>\n";
				break;
			case 'tiles':
			default:
				break;
		}

		echo "</div>\n";

		if (!is_admin()) add_action("wp_enqueue_scripts", "wednesday_gallery_jquery_enqueue", 11);
		add_action('wp_enqueue_scripts', 'wednesday_gallery_scripts');

	}

	remove_shortcode('gallery');
	add_shortcode('gallery', 'wednesday_gallery_shortcode');

?>