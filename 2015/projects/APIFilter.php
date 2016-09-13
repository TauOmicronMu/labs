<?php
	include '../projects/phpIncludes/helperfunctions.php';

    $api_url = "http://api.majestic.com/api/json";

    // If we've got the access token...

	print file_get_contents(
		$api_url .
		post_to_get() .
		"&PrivateKey=AAZDCTDSDVLPFSCSXHVEROSP"
	);
?>