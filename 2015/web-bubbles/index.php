<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>WebBubbles</title>

        <?php include '../projects/phpIncludes/coreImports.php'?>
        
        <!-- CSS -->
        <link rel="stylesheet" type="text/css" href="css/legend.css"></link>
    
        <!-- JS -->
        <script src="js/main.js"></script>
        
		<script>
			function getGraphValues() {
				return {
					data: getDataValues(["w1", "w2"]),
					projectname: "web-bubbles"
				};
			}
		</script>
    </head>
    
    <body onload="logo.setupLogo();">
        <?php
            $inputs = ["Your website", "Their website"];
            $ids = ["w1", "w2"];
            $defaults = array(
				getFetchJsonSites(0),
				getFetchJsonSites(1)
            );
			$usageImg = "low";

            include('../projects/phpIncludes/inputbar.php');
        ?>
        
        <div class="graphContainer">
            <!--All graph related elements go here (e.g. svg, tooltips, tutorials)-->
            
            <div class="graph" id="webbubbles">
                <!--SVG goes here-->
            </div>
            
            <!-- Legend showing the colours used. -->
            <table class="legend">
                <tr class="legpiece" id="legyours">
                    <td class="legcolor"></td>
                    <td class="leglabel">Your trust</td>
                </tr>

                <tr class="legpiece" id="legtheirs">
                    <td class="legcolor"></td>
                    <td class="leglabel">Their trust</td>
                </tr>
            </table>
        </div>
        
        <?php include '../projects/phpIncludes/setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>

