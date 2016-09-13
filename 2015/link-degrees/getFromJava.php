<?php 
    if (!isset($_GET["sessionid"])) {
        die ("No session ID passed in");
    }

    // GETs
    $sessionID = $_GET["sessionid"];
    $start = isset($_GET["start"]) ? $_GET["start"] : "";
    $end = isset($_GET["end"]) ? $_GET["end"] : "";
    $destroy = isset($_GET["destroy"]) ? $_GET["destroy"] : "false";
    $accesstoken = isset($_GET["accesstoken"]) ? $_GET["accesstoken"] : "";

    $resp = @file_get_contents(
        "http://labs.majestic.com:8000/link-degrees/" .
            "?start=$start" .
            "&end=$end" .
            "&sessionid=$sessionID" .
            "&destroy=$destroy" .
            "&accesstoken=$accesstoken"
    );

    if ($resp === FALSE) {
        echo "{ \"error\": \"Server is not responding.\", \"code\": 2}";
    } else {
        echo $resp;
    }
?>
