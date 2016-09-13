<?php
    if(isset($_POST["timestamp"])) {
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

        $timestamp = $_POST["timestamp"];
        
        $conn -> query("INSERT INTO socialexplorer_times (unixtime) VALUES ($timestamp);");
        
        $sql = "SELECT id FROM socialexplorer_times WHERE unixtime = $timestamp";
        $result = $conn->query($sql);

        print ($result->fetch_assoc()['id']);
        // Clean up
        $conn->close();
    } else {
        echo ("Time stamp undefined");
    }
?>

