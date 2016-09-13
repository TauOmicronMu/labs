<?php
    if(!isset($_GET["embedded"])) {
        include('../projects/phpIncludes/userinputbar.php');
    } else {
        include('../projects/phpIncludes/embeddedbar.php');
    }
?>
