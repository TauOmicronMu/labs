<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
		<title>Industry Comparator</title>

        <?php include '../projects/phpIncludes/coreImports.php'?>
        
		<link rel="stylesheet" type="text/css" href="css/layout.css"></link>
		
        <!-- OUR JS -->
        <script src="js/main.js"></script>
        
        <script>
            function getGraphValues() {
                return {
					data: getDataValues(["url", "keyword"]),
					projectname: "keyword-comparator"
				};
            }
        </script>
    </head>
    
    <body onload="logo.setupLogo();">
        <?php
            $inputs = ["Website", "Compared to sites with keyword"];
            $ids = ["url", "keyword"];
            $defaults = [getFetchJsonSites(0), getFetchJsonSites(1)];
			$usageImg = "medium";
			$button["onclick"] = "graph.openAnchorTextTool();";
			$button["text"] = "Anchor Text Tool";
			$button["fullAccess"] = true;

            include('../projects/phpIncludes/inputbar.php');
        ?>
        
        <div class="graphContainer">
            <div class="graph" id="keywordcomparator"></div>
            <div class="data-buttons">
                <button type="button" id="data-trust" onclick="">Trust Flow</button>
                <button type="button" id="data-citation">Citation Flow</button>
                <select id = "data-topic"></select>
                <span>Your website is <span id="pos">X</span> out of <span id="maxpos">Y</span>.</span>
            </div>
        </div>
        
        <table id="websiteList">
            <tr class="emptyButton"><td><button onclick="graph.emptyTableRows();">Close</button></td></tr>
        </table>
        
        <?php include '../projects/phpIncludes/setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>