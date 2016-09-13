<?php
    if (!isset($_GET["countrycode"])) {
        die("Needs country code");
    }
       
    $country_code = $_GET["countrycode"];
    
    print file_get_contents("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/$country_code.geo.json");
?>