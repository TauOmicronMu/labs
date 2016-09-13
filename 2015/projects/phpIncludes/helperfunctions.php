<?php
	//Generates a list of website names from file names of a given drop down index
	function getFetchJsonSites($index) {
        $defaultsFromScan = array();
        if(isset($_GET["goto"]) && !isset($_GET["embedded"])) {
            $defaultsFromScan[] = getWebSiteFromJson($_GET["goto"], $index);
        }
        
        $scanres = scandir("json");
        for ($i = 0; $i < count($scanres); $i++) {
            if(substr($scanres[$i], count($scanres[$i]) - 6) == ".json") {
                $toAdd = getWebSiteFromJson(str_replace(".json", "", $scanres[$i]), $index);
                if(!in_array($toAdd, $defaultsFromScan)) {
                    $defaultsFromScan[] = $toAdd;
                }
            }
        }
        
		return $defaultsFromScan;
	}

	//Gets a single website name from filename
	function getWebSiteFromJson($fullname, $index) {
		$count = 0;
		$prev = 0;
		for($i = 0; $i < strlen($fullname); $i++) {
			if($fullname{$i} == "_") {
				if($count == $index) {
					return substr($fullname, $prev, $i);
				}
				$prev = $i + 1;
				$count++;
			}
		}
		return substr($fullname, $prev, strlen($fullname));
	}

	function post_to_get() {
        $param_list = "?";
        
        foreach ($_POST as $key => $value) {
            $param_list = $param_list . $key . "=" . $value . "&";
        }
        
        rtrim($param_list, "&");
        
        return $param_list;
    }
    
    function get_file_list($rootdir) {
        $dir = scandir($rootdir);
        
        unset($dir[array_search(".", $dir)]);
        unset($dir[array_search("..", $dir)]);
        
        return $dir;
    }
?>
