<?php
    // Get parameters
    $lowerBound = $_GET["lower"];
    $upperBound = $_GET["upper"];

    if (!ctype_digit($lowerBound) || !ctype_digit($upperBound))
        die("Bounds aren't valid numbers.");

    // Server information
    $servername = "labs.majestic.com";
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
    $sql = "SELECT * FROM site WHERE refips >= $lowerBound AND refips <= $upperBound";
    $result = $conn->query($sql);
    
    // Print the results in JSON form
    echo "{ \"results\":[";
    $rowCount = 0;
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo "{";
            echo "\"Domain\": \"" . $row["domain"] . "\", ";
            echo "\"RefSubNets\": \"" . $row["refsubnets"] . "\", ";
            echo "\"RefIPs\": \"" . $row["refips"] . "\", ";
            echo "\"TLD\": \"" . $row["tld"] . "\"";
            echo "}";
            
            if ($rowCount != $result->num_rows-1)
                echo ",";
            
            $rowCount ++;
        }
    }
    
    echo "]}";
?>