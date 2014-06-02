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

	function wednesday_gallery_template($template, $data) {

		if (!empty($template)) {
			foreach($data as $key => $value) {
				$template = str_replace('%' . strtoupper($key) . '%', $value, $template);
			}
		}

		return $template;

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
			'layout' => '',
			'link' => 'file',
			'name' => 'gallery',
			'size' => 'medium',
			'sizes' => '',
			'template' => '',
			'thumbtemplate' => '',
			'toggletext' => 'thumbnails',
			'usedivs' => false,
			'withlinks' => false,
		), $atts));

		// set the ID and classes
		$gallery_id = $name != 'gallery' ? "id=\"$name\"" : '';

		// load the template sizes
		$sizelist = array();
		if (!empty($sizes)) {
			$sizelist = explode(',', $sizes);
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

		// set the default arguments
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

		// start the counters
		$imagecount = 0;
		$sizecount = 0;
		$output_thumbs = '';

		// get the images
		$images = get_posts($args);

		foreach ($images as $image) {
			$imagecount++;

			// use the template size if available, otherwise the specified size
			if (count($sizelist) > 0) {
				if ($sizecount < count($sizelist)) {
					$size = $sizelist[$sizecount];
				} else {
					$sizecount = 0;
					$size = $sizelist[$sizecount];
				}
			}

			$sizecount++;

			$data = array(
				'IMAGE_COUNT' => $imagecount,
				'IMAGE_ID' => $image->ID,
				'IMAGE' => wp_get_attachment_image($image->ID, $size),
				'IMAGE_URL' => wednesday_gallery_getAttachmentURL($image->ID, $size),
				'TITLE' => $image->post_title,
				'EXCERPT' => $image->post_excerpt,
				'DESCRIPTION' => empty($image->post_content) ? $image->post_title : $image->post_content,
				'ALT_TEXT' => get_post_meta($image->ID, '_wp_attachment_image_alt', true),
				'LINK_URL' => wp_get_attachment_url($image->ID),
				'DATE_DAY' => get_the_time('j', $image->ID),
				'DATE_MONTH' => get_the_time('F', $image->ID),
				'DATE_YEAR' => get_the_time('Y', $image->ID)
			);

			$template_slides = $template; // reset the template
			$template_thumbs = $thumbtemplate;

			if ($template_slides == '') { // if the template is empty, use the default template for the layout
				switch($layout) {
					case 'carousel':
					case 'carousel-with-thumbs':
						$template_slides .= '<li data-image="%IMAGE_COUNT%">';
						$template_slides .= $withlinks ? ' <a href="%LINK_URL%">' : ''; // apply links if "withlinks" has been specified
						$template_slides .= '		<div class="slide-content">';
						$template_slides .= $usedivs ? "			<div style=\"background-image: url('%IMAGE_URL%');\"></div>" : '			%IMAGE%';
						$template_slides .= '		</div>';
						$template_slides .= '		<div class="slide-info">';
						$template_slides .= '			<span class="date">%DATE_DAY% %DATE_MONTH% %DATE_YEAR%</span>';
						$template_slides .= '			<span class="title">%TITLE%</span>';
						$template_slides .= '		</div>';
						$template_slides .= $withlinks ? ' </a>' : '';
						$template_slides .= '</li>';
						break;
					case 'tiles':
						$template_slides .= '<div data-image="%IMAGE_COUNT%" class="tile ' . $size . '">';
						$template_slides .= $withlinks ? ' <a href="%LINK_URL%">' : ''; // apply links if "withlinks" has been specified
						$template_slides .= $usedivs ? "			<div style=\"background-image: url('%IMAGE_URL%');\"></div>" : '			%IMAGE%';
						$template_slides .= '		<div class="slide-info">';
						$template_slides .= '			<span class="date">%DATE_DAY% %DATE_MONTH% %DATE_YEAR%</span>';
						$template_slides .= '			<span class="title">%TITLE%</span>';
						$template_slides .= '		</div>';
						$template_slides .= $withlinks ? ' </a>' : '';
						$template_slides .= '</div>';
						break;
					default:
						$template_slides .= $withlinks ? '<a href="%LINK_URL%">' : '';
						$template_slides .= $usedivs ? "	<div style=\"background-image: url('%IMAGE_URL%');\"></div>" : '	%IMAGE%';
						$template_slides .= $withlinks ? '</a>' : '';
						break;
				}
			}

			if ($template_thumbs == '') { // if the template is empty, use the default template for the layout
				switch($layout) {
					case 'carousel-with-thumbs':
						$template_thumbs .= '<li data-thumbnail="%IMAGE_COUNT%">';
						$template_thumbs .= $usedivs ? "	<div style=\"background-image: url('%IMAGE_URL%');\"></div>" : '	%IMAGE%';
						$template_thumbs .= '</li>';
						break;
					default:
						$template_thumbs .= '';
						break;
				}
			}
			// $caption = $withcaptions ? : '';
			// $share = $withshare ? '<span class="share">share</span>' : '';

			// switch($layout) {
			// 	case 'carousel':
			// 	case 'carousel-with-thumbs':
			// 		$before_image = '<li data-image="' . $imagecount .'"><div class="slide-content">';
			// 		$after_image = $caption . $share . '</div></li>';
			// 		break;
			// 	case 'tiles':
			// 		$before_image = '<div data-image="' . $imagecount . '" class="tile ' . $size . '">';
			// 		$after_image = $caption . $share . '</div>';
			// 		break;
			// 	default:
			// 		$before_image = '';
			// 		$after_image = $caption . $share . '';
			// 		break;
			// }

			// $before_image = $withlinks ? $before_image . '<a href="' . wp_get_attachment_url($image->ID) . '">' : $before_image;
			// $after_image = $withlinks ? $after_image . '</a>' : $after_image;

			// $caption = $image->post_excerpt;

			// $description = $image->post_content;
			// if($description == '') $description = $image->post_title;

			// $image_alt = get_post_meta($image->ID,'_wp_attachment_image_alt', true);

			// // render your gallery here
			// if ($usedivs) {
			// 	echo "\t\t$before_image",
			// 		"<div style=\"background-image: url('",
			// 		wednesday_gallery_getAttachmentURL($image->ID, $size),
			// 		"');\"></div>",
			// 		"$after_image\n";
			// } else {
			// 	echo "\t\t$before_image",
			// 			preg_replace(
			// 				'/(width|height)=\"\d*\"\s/',
			// 				"",
			// 				wp_get_attachment_image($image->ID, $size)
			// 			),
			// 		"$after_image\n";
			// }

			echo wednesday_gallery_template($template_slides, $data);
			$output_thumbs .= wednesday_gallery_template($template_thumbs, $data); // save the thumbnail output for later

		}

		// add closing markup for layout (carousel, tiles, etc.)
		switch($layout) {
			case 'carousel':
				echo "\t</ul>\n";
				break;
			case 'carousel-with-thumbs':
				echo "\t</ul>\n";
				echo "\t<a href=\"#\" class=\"gallery-thumbnails-toggle\">$toggletext</a>\n";
				echo "\t<ul class=\"gallery-thumbnails\">\n";

				echo $output_thumbs;

				// $imagecount = 0;
				// foreach ( $images as $image ) {
				// 	$imagecount++;

				// 	$before_image = '<li data-thumbnail="' . $imagecount .'">';
				// 	$after_image = '</li>';

				// 	$caption = $image->post_excerpt;

				// 	$description = $image->post_content;
				// 	if($description == '') $description = $image->post_title;

				// 	$image_alt = get_post_meta($image->ID,'_wp_attachment_image_alt', true);

				// 	if ($usedivs) {
				// 		echo "\t\t$before_image",
				// 			"<div style=\"background-image: url('",
				// 			wednesday_gallery_getAttachmentURL($image->ID, $size),
				// 			"');\"></div>",
				// 			"$after_image\n";
				// 	} else {
				// 		// render your gallery here
				// 		echo "\t\t$before_image",
				// 			preg_replace( '/(width|height)=\"\d*\"\s/', "", wp_get_attachment_image($image->ID, 'thumbnail')),
				// 			// echo "$imagecount<br/>"; // debugging
				// 			"$after_image\n";
				// 	}
				// }
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


	function wednesday_attachment_field_link($form_fields, $post) {

		$form_fields['wednesday-link-url'] = array(
			'label' => 'Link URL',
			'input' => 'text',
			'value' => get_post_meta( $post->ID, 'wednesday_link_url', true ),
			'helps' => 'Add Link URL'
		);

		return $form_fields;

	}

	function wednesday_attachment_field_link_save( $post, $attachment ) {
	    if( isset( $attachment['wednesday-link-url'] ) )
			update_post_meta( $post['ID'], 'wednesday_link_url', esc_url( $attachment['wednesday-link-url'] ) );
		return $post;
	}

	// add link fields to media
	add_filter( 'attachment_fields_to_edit', 'wednesday_attachment_field_link', 10, 2 );
	add_filter( 'attachment_fields_to_save', 'wednesday_attachment_field_link_save', 10, 2 );


	remove_shortcode('gallery');
	add_shortcode('gallery', 'wednesday_gallery_shortcode');

?>