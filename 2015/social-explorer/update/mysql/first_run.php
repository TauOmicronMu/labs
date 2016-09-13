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

    // Reset the table
    $conn -> query("DROP TABLE socialexplorer_data;");
    $conn -> query("CREATE TABLE socialexplorer_data (" .
                   "id MEDIUMINT NOT NULL AUTO_INCREMENT," . 
                   "topic VARCHAR(100)," .
                   "data LONGTEXT," .
                   "timeid MEDIUMINT," .
                   "PRIMARY KEY (id));"
                  );

    $conn -> query("DROP TABLE socialexplorer_times;");
    $conn -> query("CREATE TABLE socialexplorer_times (" .
                   "id MEDIUMINT NOT NULL AUTO_INCREMENT," . 
                   "unixtime LONG," .
                   "PRIMARY KEY (id));"
                  );

    if($conn) {
        echo "done clear";
    } else {
        echo "not done";
    }

    // Clean up
    $conn->close();
?>