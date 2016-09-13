<?php 
    include '../projects/phpIncludes/helperfunctions.php';
    
    $array = getFetchJsonSites(0);
    print "[\"" . $array[0];
    for($i = 1; $i < count($array); $i++) {
        print "\",\"" . $array[$i];
    }
    print "\"]";
?>