<?php
    die("Resetting blocked.");

    // Server information
    $servername = "labs.majestic.com";
    $username = "phptest";
    $password = "e94qWB6L";
    $dbname = "labs";

    // Open file
    $file = fopen("res/majestic_million.csv","r");

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Reset the table
    $conn -> query("DROP TABLE site;");
    $conn -> query("CREATE TABLE site (" .
                   "id MEDIUMINT NOT NULL AUTO_INCREMENT," . 
                   "domain CHAR(255)," .
                   "refsubnets INT," .
                   "refips INT," . 
                   "tld CHAR(255)," .
                   "PRIMARY KEY (id));"
                  );

    if($conn) {
        echo "done clear";
    } else {
        echo "not done";
    }
    
    // Loop through file .CSV
    $count = 0;
    while(! feof($file)) {
//        // Only do up to set row
//        if ($count > 5001) {
//            break;
//        }
        
        // Get the next row from the .CSV
        $curRow = (fgetcsv($file));
        
        // Skip the header / Only do every nth item
        if ($count == 0 || $count%100 != 0) {
            $count ++;
            continue;
        }
        
        // Get relevent info from .CSV row
        $domain = $curRow[2];
        $refsubnets = $curRow[4];
        $refips = $curRow[5];
        $tld = $curRow[3];
        
        // Inset values into the database
        $conn -> query("INSERT INTO site (domain, refsubnets, refips, tld) VALUES ('$domain', '$refsubnets', '$refips', '$tld');");
        
        if ($conn) {
            echo "Made successful query with site $domain <br/>";
            print_r($curRow);
        } else {
            echo "Failed to query with site $domain <br/>";
        }
        
        // Increment the count, so we know when to stop.
        $count ++;
    }
    
    // Clean up
    $conn->close();
    fclose($file);
?>