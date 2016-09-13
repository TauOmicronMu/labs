<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>Anchor Topics</title>

        <?php include '../projects/phpIncludes/coreImports.php'?>
    
        <!-- JS -->
        <script src="js/main.js"></script>
		<script src="js/Dataset.js"></script>
        <script src="js/Topic.js"></script>
		<script src="js/AnchorText.js"></script>
		<script src="js/CommonWords.js"></script>
		
		<script>
			function getGraphValues() {
				return {
					data: getDataValues(["domain"]),
					projectname: "anchor-topics"
				};
			}
		</script>
    </head>
    
    <body onload="logo.setupLogo();">
        <?php			
            $inputs = ["Website"];
            $ids = ["domain"];
            $defaults = [getFetchJsonSites(0)];
			$usageImg = "veryHigh";

            include('../projects/phpIncludes/inputbar.php');
        ?>
        
        <div class="graphContainer">
            <!--All graph related elements go here (e.g. svg, tooltips, tutorials)-->
            
            <div class="graph" id="anchortopics">
                <!--SVG goes here-->
            </div>
        </div>
        
        <?php include '../projects/phpIncludes/setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>

