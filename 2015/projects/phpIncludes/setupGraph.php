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
            graphValues.accessToken = getCookie("accessToken");
            graphValues.filename = getFileName(graphValues.data);
			try {
				var resp;
				if(graphValues.accessToken) {
					resp = graph.loadData(graphValues);
					//The code below should be uncommented in order to record the results to a file
					//Record.recordJSONToFile(resp, graphValues.filename);
				} else {
					resp = $.parseJSON(Record.decodeFileToJSON(graphValues));
				}

				graph.loadGraph(resp);
			} catch(err) {
				showError("Error in either the API key or the URL that have been entered")
			}
            removeLoadingScreen();
        }, 0);
    }    
    
    function getFileName(data) {
        var filename = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                filename += data[key] + "_";
            }
        }
        
        return filename.substr(0, filename.length - 1);
    }
    
    //I know this is bad, but cant find why the solution (why it needs to be moved up). I assume css.
    if(getUrlVars()['embedded'] == "true") {
        document.getElementsByClassName("graphContainer")[0].style.marginTop = "0";
    }
    
    if(!getCookie("accessToken") && !getUrlVars()['fullaccess']) {
        setupGraph();
    }
</script>

<?php 
    if(isset($_GET["goto"]) && isset($_COOKIE["accessToken"]))
        print "<script> setupGraph(); </script>";
?>