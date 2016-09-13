var infobox = new (function() {
    var population;
	var minRefIPs = 515;
    var topicAmount = 5;
    var container;
    var svg;

    // Setup the infobox
    this.setup = function() {
        svg = d3.select("svg#universe > g");
        container = d3.select("#infobox");
        initTopicTable();
        initBackLinkTable();
    }
    
    // Populate with data set - makes sure .moreInfo is present
    this.populate = function(dataset) {
		document.getElementById("authorisedInfoBoxcontainer").style.display = 'block';
		document.getElementById("unauthorisedInfoBoxContainer").style.display = 'none';
		if (!dataset.moreInfo) {
        	getJSONIndexItemInfo(dataset, populateAuthoristation, true);
		} else {
			populateAuthoristation(dataset, dataset.moreInfo);
		}
    }
	
	this.populateFree = function(dataset) {
		document.getElementById("authorisedInfoBoxcontainer").style.display = 'none';
		document.getElementById("unauthorisedInfoBoxContainer").style.display = 'block';
		populateNoAuthoristation(dataset);
	}
    
    // If dataset doesn't have .moreInfo, this sets it
    this.populateMoreInfo = function(dataset) {
        var json;
		if (!dataset.moreInfo && getCookie("accessToken")!==undefined) {
        	getJSONIndexItemInfo(dataset, function(dataset, json) { dataset.moreInfo = json; }, false);
		}
    }
    
    // Populate once you have the json
    function populateAuthoristation(dataset, json) {
		
		
        // Get data on the dataset
        population = dataset;
        dataset.moreInfo = json;
        dataset.backlinkData = getJSONBackLinks(dataset.Domain);
		
        // Set basic information
        container.select("#domain > .infovalue").html(
            "<a href=\"http://" + 
            dataset.Domain + 
            "\" target=\"_blank\">" +
            dataset.Domain + 
            "</a>");
	
        container.select("#trust > .infovalue").html(json.TrustFlow);
        container.select("#citation > .infovalue").html(json.CitationFlow);
        container.select("#backlinks > .infovalue").html(formatNumber(json.ExtBackLinks));
        
        // Set topics
        for (var i = 0; i < topicAmount; i++) {
            var name = json["TopicalTrustFlow_Topic_" + i];
            container.select("#infotopicname" + i)
                .text(trimText(name, 30))
                .style("background-color", function(d) { return getColorForTopic(name); })
                .style("color", function(d) { return getTextColorForTopic(name); });
            container.select("#infotopicvalue" + i)
                .text(json["TopicalTrustFlow_Value_" + i])
                .style("background-color", function(d) { return getColorForTopic(name); })
                .style("color", function(d) { return getTextColorForTopic(name); });
        }
        
        // Set backlinks
        for (var a=0; a < 5; a++) {
            container.select("#infobacklinkname" + a)
                .text(trimText("", 60));
        }
        
       	
        for (var a=0; a < dataset.backlinkData.length; a++) {
            var name = dataset.backlinkData[a].SourceURL;
            container.select("#infobacklinkname" + a)
                .text(trimText(name, 60))
				.on("click",function(){graph.focusOnDomain(d3.select(this).text());})
                .style("color", 
                       getTextColorForTopic(dataset.backlinkData[a].SourceTopicalTrustFlow_Topic_0))
                .style("background-color", 
                       getColorForTopic(dataset.backlinkData[a].SourceTopicalTrustFlow_Topic_0));
        }

        // Set the link profile
        container.select("#infolinkprofile")
            .attr("src", 
                  "https://majestic.com/charts/linkprofile/3/?threshold=&target=" + 
                  dataset.Domain + 
                  "&datatype=1&IndexDataSource=F");
        
        // Set the RoundTheClock link
        container.select("#roundtheclocklink")
            .attr("href", 
                  "http://labs.majestic.com/2015/round-the-clock/index.php?goto=" + 
                  dataset.Domain)
            .attr("target","_blank");
        
        // Set the favicon
        container.select("#selectedPlanetPic")
            // Load the default fav...
            .attr("src", "res/defaultfav.png")
            .attr("onload", function() { 
                // And once that's loaded, load the proper one.
                container.select("#selectedPlanetPic")
                    .attr("src",
                          "http://icons.better-idea.org/api/icons?url=" + 
                          dataset.Domain + 
                          "&i_am_feeling_lucky=yes");
            })
    }
	
	//Populates info box that is displayed when user has no autorisation
	function populateNoAuthoristation(dataset){
		population = dataset;
		
		container.select("#domain2 > .infovalue").html(
            "<a href=\"http://" + 
            dataset.Domain + 
            "\" target=\"_blank\">" +
            dataset.Domain + 
            "</a>");
		
		container.select("#refSubNets2 > .infovalue").html(dataset.RefIPs);
        
        // Set the favicon
        container.select("#selectedPlanetPic2")
            // Load the default fav...
            .attr("src", "res/defaultfav.png")
            .attr("onload", function() { 
                // And once that's loaded, load the proper one.
                container.select("#selectedPlanetPic2")
                    .attr("src",
                          "http://icons.better-idea.org/api/icons?url=" + 
                          dataset.Domain + 
                          "&i_am_feeling_lucky=yes");
            });
		
        // Set the link profile
        container.select("#infolinkprofile2")
            .attr("src", 
                  "https://majestic.com/charts/linkprofile/3/?threshold=&target=" + 
                  dataset.Domain + 
                  "&datatype=1&IndexDataSource=F");
		
	}
    
    function initTopicTable() {
        var table = container.select("#infotopics");
        
        for (var i=0; i < topicAmount; i++) {
            var tr = table.append("tr");
            
            tr.append("td")
                .attr("class", "infolabel")
                .attr("id", "infotopicname" + i);
            
            tr.append("td")
                .attr("class", "infovalue")
                .attr("id", "infotopicvalue" + i);
        }
    }
        
    function initBackLinkTable() {
        var table = container.select("#infobacklinks");
        
        for (var i=0; i< 5; i++) {
            var tr = table.append("tr");
            
            tr.append("td")
                .attr("class", "infolabel")
                .attr("id", "infobacklinkname" + i);
        }
    }

    
    this.openRoundTheClock = function() {
        window.open("http://labs.majestic.com/2015/round-the-clock/index.php?goto=" + population.Domain, "_blank");
    }
})();

function showhideTip() {
    var toggleInfoBoxButton = document.getElementById("hideshowtipbutton");
    if(toggleInfoBoxButton.innerHTML == "Hide") {
        document.getElementById("infoBoxContainers").style.display="none";
        document.getElementById("infobox").className = "hidebox";
        toggleInfoBoxButton.innerHTML = "Show";
        toggleInfoBoxButton.className = "toggleSizeTipShow";
    } else {
       	document.getElementById("infoBoxContainers").style.display="block";
        document.getElementById("infobox").className = "tooltips";
        toggleInfoBoxButton.innerHTML = "Hide";
        toggleInfoBoxButton.className = "toggleSizeTipHide";
    }
}

function getJSONIndexItemInfo(dataset, fn, isAsync) {
	$.ajax({
            url: "../projects/APIFilter.php",
			success: function(response) {
				fn(dataset, parseIndexJSON(
					response
				).DataTables.Results.Data[0]);
			},
            data: {
                cmd: "GetIndexItemInfo",
				items: 1,
                item0: dataset.Domain,
                datasource: "fresh",
                count: 100,
                AccessToken: accessToken,
				DesiredTopics: 5
            },
            type: "POST",
            async: isAsync,
            dataType: "json"
        });
}

function getNewJSONIndexItemInfo(domain,fn,isAsync){
	$.ajax({
            url: "../projects/APIFilter.php",
			success: function(response) {
				fn(parseIndexJSON(
					response
				).DataTables.Results.Data[0]);
			},
            data: {
                cmd: "GetIndexItemInfo",
				items: 1,
                item0: domain,
                datasource: "fresh",
                count: 100,
                AccessToken: accessToken,
				DesiredTopics: 5
            },
            type: "POST",
            async: isAsync,
            dataType: "json"
        });
}

function parseIndexJSON(json){
	var responseJson = json;
	
	var itemCode = responseJson.DataTables.Results.Data[0].ItemType;
	if(itemCode == 1 || itemCode == 2){
		return responseJson;
	}else{
		return null;
	}
}

function getJSONBackLinks(domain) {
    var resp = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetBackLinkData",
                item: domain,
                datasource: "fresh",
                count: 100,
				MaxSameSourceURLs: 1,
                AccessToken: accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;

    var json = $.parseJSON(resp).DataTables.BackLinks.Data;
    
    if (json.length > 5) {
        json = json.slice(0, 5);
    }
    
    return json;
}