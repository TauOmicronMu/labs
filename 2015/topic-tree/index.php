<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>Topic Tree</title>

        <?php include '../projects/phpIncludes/coreImports.php'?>

        <script src="js/main.js"></script>
        <script src="js/shader.js"></script>
        <script src="js/dataHandler/handledata.js"></script>
        <script src="js/dataHandler/PageDetails.js"></script>
        <script src="js/dataHandler/TopicTree.js"></script>
        <script src="js/dataHandler/TopicDetails.js"></script>
        
        <script>
            function getGraphValues() {
                return {
					data: getDataValues(["url"]),
					projectname: "topic-tree"
                }
            }
        </script>
    </head>
    
    <body onload="logo.setupLogo();">
        <?php
            $inputs = ["Your website"];
            $ids = ["url"];
            $defaults = [getFetchJsonSites(0)];
            $usageImg = "low";

            include('../projects/phpIncludes/inputbar.php');
        ?>
        
        <div class="graphContainer">
            <div class="graph" id="topictree"></div>
        </div>
        
		<?php include '../projects/phpIncludes/setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>