var graph = new (function() {
	var data;
	var radius;
	var path;
    var tip;
	var arc;
	var text;
	var topicText;
	var totalScore;
    var x, y;
    // Check if anything is expanded
    var somethingExpanded;
    // Stores last node clicked, so if it's clicked again we know to unexpand
    var lastClicked;
	
	//Generates D3 graph
    this.loadGraph = function() {
		//Disable space bar scrolling
		window.onkeydown = function(e) {
			return ([37, 38, 39, 40, 32].indexOf(e.keyCode)) == -1;
		};
        
        data = $.parseJSON(decodeURI($.ajax({
            dataType: "json",
            url: serv_dir + "/social-explorer/mysql/getdata.php",
            data: {
                topic: "chart"
            },
            type: "POST",
            async: false
        }).responseText));
        
        if(!mobile)
            setupTooltip();
        
        var $container = $(".graph#socialexplorer");
        width = pxStringToInt($container.css("width"));
        height = pxStringToInt($container.css("height"));
        var minDim = Math.min(width, height);
        
        radius = (minDim / 2) * 0.8;
        
        if (mobile) {
            width = minDim;
            height = minDim;
            $container.css("height", minDim);
            $container.css("width", minDim);
            $(".graphContainer").css("height", minDim);
        }
        
        // Scales the angle of the segment
		x = d3.scale.linear()
		   .range([0, 2 * Math.PI]);
        
        // Scales how much the segment comes out
		y = d3.scale.sqrt()
			.range([0, radius]);
        
        // Setup D3
		var svg = d3.select(".graph#socialexplorer").append("svg")
			.append("g")
    		.attr("transform", "translate(" + (width / 2) + "," + ((height / 2) * 0.85) + ")");
		
		var partition = d3.layout.partition()
			.value(function(d) { return d.score; });
        
		arc = d3.svg.arc()
			.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
			.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
			.innerRadius(function(d) { return (d.expanded ? 1.2 : 1) * Math.max(0, y(d.y)); })
			.outerRadius(function(d) { return (d.expanded ? 1.2 : 1) * Math.max(0, y(d.y + d.dy)); });
		
		var elem = svg.selectAll("g.node")
            .data(partition.nodes(data));
		
		var elemEnter = elem.enter()
            .append("g")
            .attr("class", "node");
		
		path = elemEnter.append("path")
            .attr("class", "graph-segment")
			.on("click", click)
			.style("fill", function(d) { return getPartitionColor(d); })
			.style("stroke", "white")
			.style("stroke-width", 1)
			.attr("d", arc);
			
		elemEnter.filter(function(d) { return d.name=="All"; })
			.append("image")
			.attr("width", radius/2)
            .attr("height", radius/2)
			.attr("x", -radius/4)
            .attr("y", -radius/4)
            .attr("xlink:href", serv_dir + "/social-explorer/res/centre_logo.png")
			.attr("class", "graph-segment")
			.on("click", function(d) { click(data); });
		
        topicText = elemEnter.filter(function(d) { return d.name=="All"; })
			.append("text")
			.attr("x", 0)
            .attr("y", radius * 1.15)
			.attr("text-anchor", "middle")
		    .style("font-size", (radius * (mobile ? 0.14 : 0.07)) + "px")
			.style("font-weight", "bold")
			.attr("fill", "#4099FF")
			.text("100%");
        
		text = elemEnter.filter(function(d) { return d.name=="All"; })
			.append("text")
			.attr("x", 0)
            .attr("y", radius * (mobile ? 1.3 : 1.23))
			.attr("text-anchor", "middle")
		    .style("font-size", (radius * (mobile ? 0.11 : 0.05)) + "px")
			.style("font-weight", "bold")
			.attr("fill", "#4099FF")
			.text("100%");
        
        if (!mobile) {
            tooltip.setupMouseWithOther(path.filter(function(d){ return d.name !== "none"; }), highlight, unhighlight);
        }
        
        removeLoadingScreen();
        
        // Show the top ten list
        $("#top-container").show();
        
        $(window).resize(function() {
//            // Resize the graph
//            width = pxStringToInt($container.css("width"));
//            height = pxStringToInt($container.css("height"));
//            radius = (Math.min(width, height) / 2.0);
//            
//            console.log(radius);
//            
//            y = d3.scale.sqrt()
//                .range([0, radius]);
//            
//            path/*.transition("expanding")
//                .duration(750)*/
//                .attr("d", arc);
            
            // Resize the main content to make room for the bottom bar (can't do in CSS)
            if (mobile || !$("#footer").is(":visible")) {
                return;
            }
            
            var sizeBody = pxStringToInt($("body").css("height"));
            var sizeFooter = pxStringToInt($("#footer").css("height"));
            
            $("#main-content").css("height", sizeBody - sizeFooter - 10);
        });
        
        gotoProfile(handle);
        
        if (topic1) {
            gotoTopics();
        }
	}
	
	function highlight(segment) {
		path.filter(function(d) { return d==segment; } )
			.style("fill", lighten(getPartitionColor(segment),0.5));
	}
    
	function unhighlight(segment) {
		path.filter(function(d) { return d==segment; } )
			.transition("fade")
			.duration(300)
			.style("fill", getPartitionColor(segment));
	}
			
    this.searchForProfile = function () {
        // Get text from search bar
        handle = $("#search-input").val().toLowerCase();
        // Set address to the profile
        window.history.pushState("", "", handle);
        // Goto the profile
        gotoProfile(handle);
    }   
    
    // If data is loaded from .json file, objects doesn't have functions, and this fixes that
    // by converting it to Page objects
    function convertToPage(data) {
        var topprofiles = getTop10Json(data);
        for (var i = 0; i < topprofiles.length; i++) {
            topprofiles[i] = new Page(
                topprofiles[i].url,
                topprofiles[i].username,
                topprofiles[i].score,
                topprofiles[i].trust,
                topprofiles[i].citation,
                topprofiles[i].subnets,
                topprofiles[i].topics
            );
        }
        
        for (var i = 0; i < data.children.length; i++) {
            convertToPage(data.children[i]);
        }
    } 
    
    // Gets all the profiles
    function getAllProfiles(data) {
        var list = [];
        var topprofiles = getTop10Json(data);
        if(topprofiles) {
            for(var i = 0; i < topprofiles.length; i++) {
                list.push(topprofiles[i].getProfile());
            }
        }
        
        if(data.children) {
            for(var i = 0; i < data.children.length; i++) {
                var childProfiles = getAllProfiles(data.children[i]);
                
                for (var j = 0; j < childProfiles.length; j++) {
                    if (list.indexOf(childProfiles[j]) == -1) {
                        list.push(childProfiles[j]);
                    }
                }
            }
        }
        
        return list;
    }
    	
	// Set tooltip variables
    function setupTooltip() {
        //Set up for tooltips
        tooltip.setupTooltipElems(["Topic", "Percentage"]);
        tooltip.setDataGetter(function(d) {
            return [
                d.name,
				showPercentage(d)
            ];
        });
    }
    
    // Go to selection of topics
    function gotoTopics() {
        // I'm really, really sorry about this
        
        var finalData;
        var topicData;
        
        if (topic1) {
            topicData = getTopic(data, topic1);
        }
        
        if (topicData) {
            finalData = topicData;
            topicData = getTopic(topicData, topic2);
        }
        
        if (topicData) {
            finalData = topicData;
            topicData = getTopic(topicData, topic3);
        }
        
        if (topicData) {
            finalData = topicData;
        }
        
        if (finalData) {
            click(finalData);
        }
    }
    
    // Gets a topic container from a dataset's children
    function getTopic(data, topic) {
        if (!topic) return;
        
        var topicData;
        
        data.children.forEach(function(d) {
            if (d.name.toLowerCase().replace(new RegExp(" ", "g"), "") == topic.toLowerCase()) {
                topicData = d;
            }
        });
        
        return topicData;
    }
    
    // Open segment with profile in it
    function gotoProfile(profName) {
        var startD;
        if (profName) {
            startD = getGotoFromChildren(data, profName);
        }
        
        click(startD ? startD : data);
    }
    
    // Finds the page object to go to
    function getGotoFromChildren(data, goto) {
        // If one of it's children is the goto, return the data
        var topprofiles = getTop10Json(data);
        
        if(topprofiles) {
            for(var i = 0; i < topprofiles.length; i++) {
                if(topprofiles[i].getProfile().toLowerCase() == goto) {
                    return data;
                }
            }
        }
        
        // Otherwise, check if any of its children contain the goto
        if(data.children) {
            for(var i = 0; i < data.children.length; i++) {
                var fromChildren = getGotoFromChildren(data.children[i], goto);
                if(fromChildren)
                    return fromChildren;
            }
        }
        
        return null;
    }
	
	//Return color of partition
	function getPartitionColor(d) {
        var color;
        
        if (d.name == "All") {
            color = "white";//#e1e8ed
        } else if(d.name == "none") {
			color = "white";
		} else {
			color = lighten(getColorForTopic(d.supertopic), -0.1 * d.depth);
            /*
            // Check if need to darken to show highlighted
            if (somethingExpanded && !d.expanded) {
                color = lighten(color, -0.6);
            }*/
		}
        
        return color;
	}
	
    // Expand a segment and all it's children
	function expand(d, exp) {
		d.expanded = exp;
		if(d.children /*d.name !== "none"*/) {
			for(var i = 0; i < d.children.length; i++) {
				expand(d.children[i],exp);
			}
		}
        
        somethingExpanded = !(d.name == "All");
	}
	
    // Get a formatted percentage
	function showPercentage(d) {
//        return ((d.score / data.score) * 100).toPrecision(2) + "%";
		var percentage = String(100 * d.score / data.score);
		var formattedPercentage = "";
		var count = 0;
		for(var i = 0; i < percentage.length; i++){
			count--;
			formattedPercentage += percentage[i];
			if(percentage[i] == ".") {
				count = 2;
			}
			if(count == 0){
				break;
			}
		}
		return formattedPercentage + "%";
	}
	
    // Called when segment clicked
	function click(d) {
        if (d == lastClicked && d.name == "All") {
            return;
        }
        
        setEmbedCode(d);
        
        // Check if unexpanding necessary
        if (d != data && d == lastClicked) {
            click(data);
            lastClicked = data;
            return;
        } else {
            lastClicked = d;
        }
        
        // Change text in centre
        var percentage = showPercentage(d);
        if (d.name == "All") {
            topicText.html("Click on a segment to explore");
            text.html("");
        } else {
            topicText.html(d.name, 20);
            text.html(percentage);
        }

        updateTop10(d);
		expandSegment(d);
        
        // Change the URL
        if (d.fullname.indexOf("Top 10") == -1) {
            window.history.pushState("", "", serv_dir + "/social-explorer/bytopic/" + d.fullname.toLowerCase().split(" ").join(""));
        } else {
            window.history.pushState("", "", serv_dir + "/social-explorer");
        }
        
	}
	
	function expandSegment(d) {
        // Set whether nodes expanded
		expand(data, false); 
		if(d.name !== "All" && d.name !== "none"){
			expand(d, true);
		}
        
        // Do the expanding and highlighting
		path.transition("expanding")
            .duration(750)
            .attr("d", arc);
	}
    
    // Shows the currently selected segment's top 10 in the side bar
    function updateTop10(d) {
        $("#top-list").empty();
        $("#top-title").html(getTop10Title(d));
        
        getTop10Json(d).forEach(function(p, i) {
            
            var itemContainer = $("<div></div>")
                .attr("class", "col-md-4");
            
            var item = $("<div></div>")
                .attr("class", "top-item");
            
            if (handle == p.getProfile().toLowerCase()) {
                item.attr("class", "top-item top-item-highlighted");
            }
            
            var rank = $("<div></div>")
                .attr("class", "top-item-rank")
                .html("" + (i + 1))
                .append($("<span></span>").css("line-height", "10px"));
            
            var details = $("<div></div>")
                .attr("class", "top-item-details");
            
            // Topic to display:
            var index = p.containsTopic(d.fullname);
            if (index == -1) {
                index = 0;
            }
            
            var topic = p.topics[index];
            
            var txt = $("<div></div>")
                .attr("class", "top-item-link")
                .append(
                        $("<a></a>")
                            .html("@" + p.getProfile())
                            .attr("href", "http://twitter.com/" + p.getProfile())
                            .attr("target", "_blank"))
                .append($("<div></div>")
                        .attr("class", "top-item-majimg")
                        .css("background-color", getColorForTopic(topic.topic))
                        .css("color", getTextColorForTopic(topic.topic))
                        .text(topic.value)
                        .click(function() {
                            window.open("http://majestic.com/reports/site-explorer?q=@" + p.getProfile(), "_blank");
                        })
                    );
            
            
            
            var tweet = $("<a></a>")
                .attr("class", "twitter-share-button")
                .attr("href", "https://twitter.com/intent/tweet?url=http://labs.majestic.com/2015/social-explorer/" + ((d.fullname.indexOf("Top 10 profiles on Twitter") == -1) ? "bytopic/" + d.fullname.toLowerCase().split(" ").join("") : "") + "&hashtags=SocialExplorer&text=" + getTweet(p, d, i))
                .attr("data-count", "none");
                      
                      
            var follow = $("<a></a>")
                .attr("class", "twitter-follow-button")
                .attr("href", "http://twitter.com/" + p.getProfile())
                .attr("data-show-count", true)
                .attr("data-show-screen-name", "false");
            
            var twitterLoading = $("<span></span>")
                .attr("class", "twitter-loading")
                .text("Loading...");
            
            if (mobile) {
                tweet.attr("data-size", "large");
                follow.attr("data-size", "large");
            }
            
            details.append(txt);
            details.append(twitterLoading);
            details.append(tweet);
            details.append(follow);

            item.append(rank);
            item.append(details);
            
            itemContainer.append(item);
            
            $("#top-list").append(itemContainer);
            
            try {
                // Load the twitter buttons, and once they load remove the loading box
                setTimeout(function() {
                    twttr.widgets.load(tweet).then(function() { twitterLoading.remove(); } );
                    twttr.widgets.load(follow).then(function() { twitterLoading.remove(); } );
                }, 1000);
            } catch (err) {
                twitterLoading.remove();
                console.log("Failed to load twitter buttons");
            }
        });
        
        trimTop10Handles();
    }
    
    function trimTop10Handles() {
        $(".top-item").each(function(i, e) {
            
            var $box = $(e);
            var $text = $box.find(".top-item-link > a");
            var $rank = $box.find(".top-item-rank");
            var sizeBox, sizeText;
            var count = 0;
            
            do {
                var sizeBox = pxStringToInt($box.css("width"));
                var sizeText = pxStringToInt($text.css("width"));
                var sizeRank = pxStringToInt($rank.css("width"));
                
                if ((sizeText + sizeRank) + 10 > sizeBox) {
                    var text = $text.text().split(".").join("");
                    $text.text(text.substr(0, text.length - 1) + "...");
                }
                
                count ++;
            } while ((sizeText + sizeRank) + 10 > sizeBox && count < 10);
        });
    }
    
    // Get title to display at for Top 10
    function getTop10Title(d) {
        if(d.depth > 0) {
            return "Top 10 profiles in " + d.fullname;
        } else {
            return d.fullname;
        }
    }
    
    // Get tweet text for tweeting
    function getTweet(profile, d, i) {
        var txt = ".@";
        txt += profile.getProfile();
        txt += " is No.";
        txt += (i + 1);
        txt += " in @tryMajestic top 50K Twitter profiles";
         
        if (d.depth == 0) {
            txt += "!";
        } else {
            txt += " in \"" + d.name + "\".";
        }
        
        return txt;
    }
    
    function getTop10Json(d) {
        var topprofiles = $.parseJSON(decodeURI($.ajax({
            dataType: "json",
            url: serv_dir + "/social-explorer/mysql/getdata.php",
            data: {
                topic: encodeURI(d.fullname.split("/").join("-"))
            },
            type: "POST",
            async: false
        }).responseText));
        
        for (var i = 0; i < topprofiles.length; i++) {
            topprofiles[i] = new Page(
                topprofiles[i].url,
                topprofiles[i].username,
                topprofiles[i].score,
                topprofiles[i].trust,
                topprofiles[i].citation,
                topprofiles[i].subnets,
                topprofiles[i].topics
            );
        }
        
        return topprofiles;
    }
    
    // Pur appropriate embed code in box
    function setEmbedCode (d) {
        var topiccode = d.fullname.toLowerCase().split(" ").join("");
        if(topiccode.indexOf("Top 10 profiles on Twitter") > -1) {
            topiccode = "";
        } else {
            topiccode = "/bytopic/" + topiccode;
        }
        $("#embedcode-link").val("https://labs.majestic.com/2015/social-explorer/bytopic/" + topiccode);
        $("#embedcode-embedfull").val("<iframe src=\"https://labs.majestic.com/2015/social-explorer" + topiccode + "/embedded\" width=\"650px\" height=\"540px\" frameborder=\"0\"></iframe>");
        $("#embedcode-embedlist").val("<iframe src=\"https://labs.majestic.com/2015/social-explorer" + topiccode + "/embeddedtop10\" width=\"400px\" height=\"540px\" frameborder=\"0\"></iframe>");
        $("#embedcode-embedchart").val("<iframe src=\"https://labs.majestic.com/2015/social-explorer" + topiccode + "/embeddedgraphic\" width=\"650px\" height=\"540px\" frameborder=\"0\"></iframe>");
    }
    
    this.showEmbedCode = function () {
        $('#embedcode-link').attr("cols", window.innerWidth / 25);
        $('#embedcode-embedfull').attr("cols", window.innerWidth / 25);
        $('#embedcode-embedlist').attr("cols", window.innerWidth / 25);
        $('#embedcode-embedchart').attr("cols", window.innerWidth / 25);
        $("#embedcode-holder").show();
    }
    
    this.hideEmbedCode = function () {
        $("#embedcode-holder").hide();    
    }
})();
