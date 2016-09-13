<?php
    // Server information
    $servername = "localhost";
    $username = "phptest";
    $password = "e94qWB6L";
    $dbname = "labs";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $timeid = file_get_contents('http://labs.majestic.com/2015/social-explorer/mysql/getmostrecenttime.php');
    print $timeid;
    // Deleting information from MySQL server
    $delete_time = "DELETE FROM socialexplorer_times WHERE id = $timeid";
    $delete_data = "DELETE FROM socialexplorer_data WHERE timeid = $timeid";

    $result_time = $conn->query($delete_time);
    $result_data = $conn->query($delete_data);

    if($result_time) {
        print "Results:";
        print $result_time;
        print $result_data;
    } else {
        print "Nothing works";
    }

    $conn->close();
?>