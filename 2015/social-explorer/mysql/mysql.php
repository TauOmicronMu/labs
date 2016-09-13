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


    // Get information from MySQL server
    $sql = "SELECT data FROM socialexplorer_data";
    $result = $conn->query($sql);

    print ($result->fetch_assoc()['data']);


    $conn->close();
?>
