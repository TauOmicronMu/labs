<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>Round The Clock</title>
        <link rel="icon" type="image/png" href="/projects/res/icons/favicon.png">

        <?php include '../projects/phpIncludes/coreImports.php'?>
        
        <!-- Our JS -->
        <script src="js/main.js"></script>
        <script src="js/datahandler.js"></script>
        
        <script>
            function getGraphValues() {
                return {
					data: getDataValues(["url"]),
					projectname: "round-the-clock"
                };
            }
        </script>
    </head>
    
    <body onload="logo.setupLogo();">
        <!-- Inputs for website and amount of topics to show. -->
        
        <?php
            $inputs = ["Your website"];
            $ids = ["url"];
            $defaults = [getFetchJsonSites(0)];
            $usageImg = "low";
            
            include('../projects/phpIncludes/inputbar.php');
        ?>
        
        <div class="graphContainer">
            <div class="graph" id="roundtheclock"></div>
            <div class="updatebutton">
                <button id="switch" type="button" onclick="graph.switchViewPressed()">Switch view</button>
            </div>
        </div>
        
        <?php include '../projects/phpIncludes/setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>
