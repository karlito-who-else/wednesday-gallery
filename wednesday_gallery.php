<?php
	/*
	Plugin Name: Wednesday - Gallery
	Plugin URI: http://www.wednesdayagency.com/
	Description: The Wednesday Wordpress gallery plugin.
	Version: 1.0
	Author: James Gardiner (jamesg@wednesdayagency.com)
	Author URI: http://www.wednesdayagency.com/
	*/

	function wednesday_gallery_enqueue_scripts() {
		if (!is_admin()) {
			wp_deregister_script('jquery');
			wp_register_script('jquery', "http" . ($_SERVER['SERVER_PORT'] == 443 ? "s" : "") . "://code.jquery.com/jquery-2.1.1.min.js", false, null);
			wp_enqueue_script('jquery');
			wp_enqueue_script('gallery-script', plugins_url() . '/wednesday-gallery/wednesday-gallery.js', array(), '1.0.0', true);
		}
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
			'class' => '',
			'breakpoints' => '',
			'columns' => 1,
			'layout' => '',
			'link' => 'default',
			'name' => 'gallery',
			'size' => 'medium',
			'sizes' => '',
			'showslides' => '',
			'template' => '',
			'thumbtemplate' => '',
			'textprevious' => 'previous',
			'textnext' => 'next',
			'texttoggle' => 'thumbnails',
			'options' => ''
		), $atts));

		// load the template sizes
		$sizelist = array();
		if (!empty($sizes)) {
			$sizelist = explode(',', $sizes);
		}

		// do we have breakpoints?
		if (!empty($showslides)) { $showslides = 'data-showslides="'. $showslides . '"'; }
		if (!empty($breakpoints)) { $breakpoints = 'data-breakpoints="'. $breakpoints . '"'; }

		// set the options
		$optionlist = array();
		if (!empty($options)) {
			$optionlist = explode(',', $options);
		}
		$circular = in_array('circular', $optionlist);
		$nodimensions = in_array('nodimensions', $optionlist);
		$usedivs = in_array('usedivs', $optionlist);
		$withlinks = in_array('withlinks', $optionlist);

		// set the ID and classes
		$gallery_id = $name != 'gallery' ? "id=\"$name\"" : '';
		$class = $circular ? 'circular' . $class : $class;

		switch($layout) {
			case 'json':
				echo '<script ' . $gallery_id . ' type="application/json">';
				echo '{';
				echo '	"slides" : [';
				break;
			case 'carousel':
			case 'carousel-with-thumbs':
				echo "\n<div $gallery_id $breakpoints $showslides class=\"gallery carousel $class\">\n";
				echo "\t<div class=\"controls\">\n";
				echo "\t\t<a href=\"#\" class=\"prev\">$textprevious</a>\n";
				echo "\t\t<a href=\"#\" class=\"next\">$textnext</a>\n";
				echo "\t</div>\n";
				echo "\t<ul class=\"gallery-images\">\n";
				break;
			case 'tiles':
				echo "\n<div $gallery_id $breakpoints $showslides class=\"gallery tiles $class\">\n";
				break;
			default:
				echo "\n<div $gallery_id $breakpoints $showslides class=\"gallery $class\">\n";
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
				'IMAGE' => $nodimensions ?
					preg_replace(
						'/(width|height)=\"\d*\"\s/',
						"",
						wp_get_attachment_image($image->ID, $size)
					) : wp_get_attachment_image($image->ID, $size),
				'IMAGE_URL' => wednesday_gallery_getAttachmentURL($image->ID, $size),
				'THUMB' => wp_get_attachment_image($image->ID, 'thumbnail'),
				'THUMB_URL' => wednesday_gallery_getAttachmentURL($image->ID, 'thumbnail'),
				'UPLOAD_URL' => wednesday_gallery_getAttachmentURL($image->ID, 'full'),
				'TITLE' => $image->post_title,
				'EXCERPT' => $image->post_excerpt,
				'DESCRIPTION' => $image->post_content,
				'ALT_TEXT' => get_post_meta($image->ID, '_wp_attachment_image_alt', true),
				'LINK_URL' => wp_get_attachment_url($image->ID),
				'DATE_DAY' => get_the_time('j', $image->ID),
				'DATE_MONTH' => get_the_time('F', $image->ID),
				'DATE_YEAR' => get_the_time('Y', $image->ID),
				'SIZE' => $size,
				'NEXT' => $textnext,
				'PREVIOUS' => $textprevious,
				'TOGGLE' => $texttoggle,
				'SHOWSLIDES' => $showslides
			);

			$template_slides = html_entity_decode($template); // reset the template
			$template_thumbs = html_entity_decode($thumbtemplate);

			if ($template_slides == '') { // if the template is empty, use the default template for the layout
				switch($layout) {
					case 'json':
						$template_slides .= '{';
						$template_slides .= '"count": "%IMAGE_COUNT%",';
						$template_slides .= '"id": "%IMAGE_ID%",';
						$template_slides .= '"image_url": "%IMAGE_URL%",';
						$template_slides .= '"title": "%TITLE%"';
						$template_slides .= $imagecount < count($images) ? '},' : '}';
						break;
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
						$template_slides .= $usedivs ? "			<div class=\"tile-content\" style=\"background-image: url('%IMAGE_URL%');\"></div>" : '			%IMAGE%';
						$template_slides .= '		<div class="tile-info">';
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
					case 'json':
						$template_thumbs .= '{';
						$template_thumbs .= '"count": "%IMAGE_COUNT%",';
						$template_thumbs .= '"id": "%IMAGE_ID%",';
						$template_thumbs .= '"image_url": "%THUMB_URL%"';
						$template_thumbs .= $imagecount < count($images) ? '},' : '}';
						break;
					case 'carousel-with-thumbs':
						$template_thumbs .= '<li data-thumbnail="%IMAGE_COUNT%">';
						$template_thumbs .= $usedivs ? "	<div style=\"background-image: url('%THUMB_URL%');\"></div>" : '	%THUMB%';
						$template_thumbs .= '</li>';
						break;
					default:
						$template_thumbs .= '';
						break;
				}
			}

			echo wednesday_gallery_template($template_slides, $data);
			$output_thumbs .= wednesday_gallery_template($template_thumbs, $data); // save the thumbnail output for later

		}

		// add closing markup for layout (carousel, tiles, etc.)
		switch($layout) {
			case 'json':
				echo '	],';
				echo '	"thumbnails": [';
				echo $output_thumbs;
				echo '	]';
				echo '}';
				echo '</script>';
				break;
			case 'carousel':
				echo "\t</ul>\n";
				echo "</div>\n";
				break;
			case 'carousel-with-thumbs':
				echo "\t</ul>\n";
				echo "\t<a href=\"#\" class=\"gallery-thumbnails-toggle\">$texttoggle</a>\n";
				echo "\t<ul class=\"gallery-thumbnails\">\n";
				echo $output_thumbs;
				echo "\t</ul>\n";
				echo "</div>\n";
				break;
			case 'tiles':
				echo "</div>\n";
				break;
			default:
				echo "</div>\n";
				break;
		}

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

	add_action('wp_enqueue_scripts', 'wednesday_gallery_enqueue_scripts');

	remove_shortcode('gallery');
	add_shortcode('gallery', 'wednesday_gallery_shortcode');

?>