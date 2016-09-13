<?php
    if(isset($_POST["topic"])) {
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

        $topictoquery = $_POST["topic"];
        $timeid = file_get_contents('http://labs.majestic.com/2015/social-explorer/mysql/getmostrecenttime.php');
        
        // Get information from MySQL server
        $sql = "SELECT data FROM socialexplorer_data WHERE topic=\"$topictoquery\" AND timeid=$timeid";
        $result = $conn->query($sql);

        print ($result->fetch_assoc()['data']);

        $conn->close();
    } else {
        echo("No topic asked for.");
    }
?>