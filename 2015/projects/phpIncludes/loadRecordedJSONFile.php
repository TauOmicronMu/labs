<?php
	$json = fopen($_GET["filename"], "r") or die("Unable to open file");
    print fread($json, filesize($_GET["filename"]));
    fclose($json);
?>