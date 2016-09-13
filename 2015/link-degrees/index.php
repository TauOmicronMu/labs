<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
        <title>Link Degrees</title>
        
        <?php include '../projects/phpIncludes/coreImports.php'?>

        <!-- OUR JS -->
        <script src="js/main.js"></script>
        <script src="js/datagetter.js"></script>
        <script src="/projects/js/minmax.js"></script>
        <script src="/projects/js/DomainTools.js"></script>
        
        <script>
			function getGraphValues() {
                var graphValues;
                
                if (!$("#domain1").length) {
                    var path = $("#domain2").val();
                    path = path.split(" to ")
                    graphValues = {
                        domain1: path[1],
                        domain2: path[0],
                        accessToken: true
                    };
                } else {
                    graphValues = {
                        domain1: $("#domain1").val(),
                        domain2: $("#domain2").val(),
                        accessToken: true
                    };
                }
                
                return graphValues;
			}
		</script>
    </head>
    
    <body onload="logo.setupLogo();">
        
        <?php
            $inputs = ["Start", "Finish"];
            $ids = ["domain2", "domain1"];

            $fullaccess = isset($_COOKIE["accessToken"]) || (isset($_GET["fullaccess"]) && $_GET["fullaccess"]);

            if ($fullaccess) {
                $defaults = [
                    ["majestic.com"],
                    ["moz.com"]
                ];
            } else {
                $defaults = [[
                    "majestic.com to moz.com",
                    "bbc.co.uk to nbc.com",
                    "pinterest.com to imgur.com",
                    "aston.ac.uk to majestic.com",
                    "majestic.com to aston.ac.uk"
                ], [""]];
            }
            
			$usageImg = "veryHigh";

            include('../projects/phpIncludes/inputbar.php');
        ?>
        
        <?php if (!$fullaccess): ?>
        <script>
            // Manually edit the entry boxes for free mode
            $(".inputsection:nth-of-type(2)").remove();
            $(".inputsection-title").text("Path to find:");
        </script>
        <?php endif; ?>
        
        <div class="graphContainer">
            <div class="graph" id="linkdegrees"></div>
        </div>
        
        <script>    
            function setupGraph() {
                if (getUrlVars()['embedded'] != "true") {
                    document.getElementById("submitbutton").blur();
                }
                
                setCookie();
                
                if(!getCookie("accessToken") && getUrlVars()['fullaccess'])
                    window.location = window.location.href.split("?")[0];
                
                removeError();
                createLoadingScreen();

                $(".graph").empty();
                graph.destroy();

                setTimeout(function() {
                    //getGraphValues should be located in the index file of the project and should return the filename and any data values needed to make the api calls
                    var graphValues = getGraphValues();
                    
                    var resp = graph.loadData(graphValues);
                    graph.loadGraph(resp);
                    removeLoadingScreen();
                }, 0);
            }

            //I know this is bad, but cant find why the solution (why it needs to be moved up). I assume css.
            if(getUrlVars()['embedded'] == "true") {
                document.getElementsByClassName("graphContainer")[0].style.marginTop = "0";
            }

            if(!getCookie("accessToken") && !getUrlVars()['fullaccess']) {
//                setupGraph();
            }
        </script>
        
        <?php 
            if(isset($_GET["goto"]) && isset($_COOKIE["accessToken"]))
                print "<script> setupGraph(); </script>";
        ?>
        
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>
