<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>Link Events</title>
        
        <?php include '../projects/phpIncludes/coreImports.php'?>
        
        <!-- OUR JS -->
        <script src="js/main.js"></script>
        <script src="js/Dataset.js"></script>
        <script src="js/SingleEvent.js"></script>
        <script src="js/CompanyEvent.js"></script>
        <script src="js/DateEvent.js"></script>
        <script src="js/createData.js"></script>
        
        <script>
			function getGraphValues() {
				return {
					data: getDataValues(["url"]),
					projectname: "link-events"
				};
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
            <div class="graph" id="linkevents"></div>
        </div>
        
        <?php include '../projects/phpIncludes/setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>

