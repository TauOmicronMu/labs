<?php
    if(isset($_POST["topic"]) && isset($_POST["data"]) && isset($_POST["timeid"])) {
        $topic = $_POST["topic"];
        $data = $_POST["data"];
        $timeid = $_POST["timeid"];

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

        // Inset values into the database
        $conn -> query("INSERT INTO socialexplorer_data (topic, data, timeid) VALUES (\"$topic\", \"$data\", $timeid);");

        if ($conn) {
            echo "Made successful query with topic $topic";
        } else {
            echo "Failed to query with topic $topic";
        }

        // Clean up
        $conn->close();
    } else {
        echo "Topic, Data or Timestamp not defined.";
    }
?>