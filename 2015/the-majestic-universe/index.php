<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>The Majestic Universe</title>
        
        <?php include '../projects/phpIncludes/coreImports.php'?>
        
        <!-- CSS -->
        <link rel="stylesheet" type="text/css" href="css/main.css"></link>
        
        <!-- OUR JS -->
        <script src="js/main.js"></script>
        <script src="js/infobox.js"></script>
		<script src="js/DomainTools.js"></script>
		<script src="js/DataSet.js"></script>
		<script src="js/Planet.js"></script>
		<script src="js/Moon.js"></script>
	
		<script>
			function getGraphValues() {
				return {
					focus: document.getElementById("focus").value,
					follow: document.getElementById("followCheck").checked
				};
			}
		</script>
    </head>
    
    <body onload="graph.loadGraph();
				  logo.setupLogoWithWhiteText();
                  <?php 
                    if(isset($_GET["showinfo"]) && $_GET["showinfo"]=="false") { 
                        echo "showhideTip();";
                    } 
                  ?>" 
          style="background-color: black;">
        
		<?php	
			include("getLocalDataSet.php");

            $inputs = ["Focus on website", "Follow website"];
            $ids = ["focus", "followCheck"];
			$types = ["text", "checkbox"];
			$shortenedCsv = getLocalDataSet();
			$defaultSites = [];

			for($i = 0; $i < count($shortenedCsv); $i++){
				$defaultSites[] = $shortenedCsv[$i]["Domain"];
			}

			$defaults = array(
				$defaultSites,
				true
            );
			$usageImg = "high";

			$button["onclick"] = "graph.checkTextBox();";
			$button["text"] = "Find";
            
            $hideButton = true;

            include("../projects/phpIncludes/inputbar.php");
        ?>
        
		<script>
			graph.csvData = <?php print json_encode($shortenedCsv); ?>
		</script>
				
        <div class="graphContainer">
            <div class="graph" id="themajesticuniverse"></div>
        </div>
        
        <div class="tooltips" id="infobox">
            <button class="toggleSizeTipHide" id="hideshowtipbutton" onclick="showhideTip();">Hide</button>
			<div id="infoBoxContainers">
				<div class="infoBoxContainer" id="authorisedInfoBoxcontainer">
					<img id="selectedPlanetPic" src="" width="50px" height="50px"></img>
					<table class="infodetails">
						<tr id="domain">
							<td class="infolabel">Domain:</td><td class="infovalue"></td>
						</tr>
						<tr id="trust">
							<td class="infolabel">Trust flow:</td><td class="infovalue"></td>
						</tr>
						<tr id="citation">
							<td class="infolabel">Citation flow:</td><td class="infovalue"></td>
						</tr>
						<tr id="backlinks">
							<td class="infolabel">Backlinks:</td><td class="infovalue"></td>
						</tr>
					</table>

					<div>
						<h2>Top Topics</h2>
						<table id="infotopics"></table>
						<button onclick="infobox.openRoundTheClock()" id="roundtheclocklink" class="linkbutton">
							Topics visualisation
						</button>
						<button onclick="graph.toggleTopicPlanets();" id="showTopicPlanetsButton">
							Show/Hide Topic Moons
						</button>
					</div>
					<h2>Top Backlinks</h2>
					<table id="infobacklinks"></table>
					<button onclick="graph.toggleBackLinks()">Show/Hide lines to backlinks</button>
					<img id="infolinkprofile"/>
				</div>
				<div class="infoBoxContainer" id="unauthorisedInfoBoxContainer">
					<img id="selectedPlanetPic2" src="" width="50px" height="50px"></img>
					<table>
						<tr id="domain2">
							<td class="infolabel">Domain:</td><td class="infovalue"></td>
						</tr>
						<tr id="refSubNets2">
							<td class="infolabel">Referring Domains:</td><td class="infovalue"></td>
						</tr>
						<tr>
							<td class="infolabel" colspan=2>To see trust flow, citation flow, backlinks and topics provide an API key to authorise full version</td>
						</tr>
					</table>
					<img id="infolinkprofile2"/>

				</div>	
			</div>
		</div>
		<?php include 'setupGraph.php'?>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>
