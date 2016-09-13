var accessToken;

var graph = new (function (){
	var showBackLinks = false;
	//The main data set for the nodes
	var nodes;
    // Set of links between nodes
    var links;
	//Target set on mouse over a node to colour nodes in comparison
	var targetLinks = 1;
	//The range of referring sub net values across the node
	var mmLinks;
	//Used to calculate time differences for smooth, constant motion
	var lastTime;
    //The d to follow
    var dataInFocus;
    // Should load hd
    var shouldLoadHD = true;
	// Used for adding/removing nodes
	var elem;
    // Keeps track of if topic planets are expanded
    var topicsexpanded = false;
    // Controls physics of the graph
    var planetForce;
	// Controls physics of the moons
	var moonForce;
    // Used for getting colors
    this.color;
    var svg;
	
	this.csvData;
	
	var backLinkDrawCount=0;
	
	//Main function to setup D3
	this.loadGraph = function(){	
		var data = this.csvData;
		nodes = [];
		createNodes(data);
        links = [];
        
        height = window.innerHeight;
        infobox.setup();
		setupTooltip();
        
		tutorial.setupMessages(
			["This is the internet mapped as a universe. Towards the center we have 'bigger' websites and towards the outer edges there are smaller websites.",
             "The initially loaded in 350 are generally well known sites. Sites are ordered in size by referring subnets and their size is determined by their referring domains.",
             "With the full access version, you can see the web of how websites are linked to with their backlinks, and enjoy topic moons orbiting their respective planet."]);
        
        this.color = d3.scale.category20b();
        
        //Creates the force layout
		planetForce = d3.layout.force()
			.gravity(0)
			.charge(-100)
            .links(links)
			.nodes(nodes.filter(function(node){return !node.isTopic;}))
            .linkDistance(100)
            .linkStrength(0)
			.size([width, height]);
		
		moonForce = d3.layout.force()
			.gravity(0)
			.charge(0)
            .links(links)
			.nodes(nodes.filter(function(node){return node.isTopic;}))
            .linkDistance(100)
            .linkStrength(0)
			.size([width, height]);
		
		mmLinks = new MinMax(nodes, function(d) { return parseInt(d.RefIPs); });
        
		targetLinks = mmLinks.max;
	
		//Creates the svg element.
		svg = d3.select(".graph#themajesticuniverse").append("svg")
            .attr("width", width)
			.attr("height", height)
            .attr("id", "universe")
            .append("g")
			.attr("width", width)
			.attr("height", height);
        
        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };
        
		//Adds the data to the nodes.
		//elem = svg.selectAll("g.node").data(nodes);
		
        this.checkTextBox();
        
		update();
            
		lastTime = 0;
        
		planetForce.start();
		moonForce.start();
        
        // Only need for one, because tick applies to both
		planetForce.on("tick", tick);
	}
	
    // Create DataSets from nodes array
	function createNodes(data){
		for(var i=0;i<data.length;i++){
			nodes.push(new Planet(data[i]));
		}
	}

    // Update the nodes on screen - call after changing nodes array
	function update() {
        setupEnterKey();
		
        var linkElem = svg.selectAll(".backlinkLine").data(links);
        linkElem.exit().remove();
		var linkElemEnter = linkElem.enter();
        
        var backlinkLines = linkElemEnter.insert("line", "g.node")
            .attr("class", "backlinkLine")
            .style("stroke", function(d) {
                if (d.json)
                    return getColorForTopic(d.json.SourceTopicalTrustFlow_Topic_0);
                else
                    return "white";
            })
            .style("stroke-width", function(d) { return (d.source.getRadius()) / 5; }) 
            .on("click", function(d) {
                graph.focusOnData(d.target);
            });
        
        elem = svg.selectAll("g.node").data(nodes);
        elem.exit().remove();
		var elemEnter = elem.enter().append("g").attr("class", "node");
        
		var circle = elemEnter.append("circle")
			.attr("r", function(d){ return d.getRadius(); })
            .style("stroke-width", function(d) {return (d.getRadius()) / 10; })
            .on("mouseup", function(d) { d.click(); })
			.on("mouseover", function(d) { d.mouseOver(); })
			.on("mouseout", function(d) { d.mouseOut(); });
	
	
		
        var image = elemEnter
			.filter(function(d){ return !d.isTopic; })
			.append("image")
            .attr("width", function(d){ return d.getRadius(); })
            .attr("height", function(d){ return d.getRadius(); })
            .attr("xlink:href", function(d) {
                return "http://icons.better-idea.org/api/icons?url=" + d.Domain + "&i_am_feeling_lucky=yes";
            })
			.on("mouseup", function(d) { d.click(); })
			.on("mouseover", function(d) { d.mouseOver(); })
			.on("mouseout", function(d) { d.mouseOut(); });
        
        updateColor();
	}
	
	//Gets the value from the text box
	this.checkTextBox = function() {		
		accessToken = $('#accesstoken').val();
        if (accessToken){
            document.cookie = "accessToken=" + accessToken + ";domain=.labs.majestic.com;path=/";
		}
		var value =  getGraphValues().focus;
		graph.focusOnDomain(value);
	}
	
	//Sets up the enter key to pass a domain name to checkDomain
	function setupEnterKey(){
        $("#w1").on("keypress", function(e) {
            if (e.keyCode == 13) {
				checkTextBox();
            }
        });
	}
    
    // Focus on a dataset given only a domain
	this.focusOnDomain = function(domain) {
		async(fetchDomain(domain, function(d) { graph.focusOnData(d) }));
	}
	
	//Asyncronously called to pass node for given url to function
	function fetchDomain(url, fn){
		var domain = parseName(url);
		var node = checkDomain(domain);
		if (node !== null){
			fn(node);
		} else {
			if(getCookie("accessToken") !== undefined){
				getNewJSONIndexItemInfo(domain, addNewDomain, false);
				var newNode = nodes[nodes.length-1];
				if(newNode !== null){
					//addSurroundingNodes(newNode);
					//SQL on server not working
					update();
					fn(newNode);
				}
			}
		}
	}
	
	//Returns domain name from url
	function parseName(url) {
		var domainTools = new DomainTools();
		domainTools.setup(url);
		
		return domainTools.getDomain();
	}
	
	//Returns node for domain if it exists
	function checkDomain(domain) {
		for (var i=0; i<nodes.length; i++) {
			if (nodes[i].Domain == domain){
				return nodes[i];
			}
		}
		return null;
	}
	
	//Returns a new d for given domain
	function addNewDomain(json){
		var d = new Planet(json);
        nodes.push(d);
	}
	
	//Adds new nodes around new node d
	function addSurroundingNodes(d){
        var range = 0.01;
        var upper = Math.round(d.RefIPs * (1 + range));
        var lower = Math.round(d.RefIPs * (1 - range));
         
		var _url = "getMillionRange.php?upper=" + upper + "&lower=" + lower;
	
		var json = $.ajax({
				url: _url,
				async: false,
				dataType: "json"
			}).responseText;
		
		var toAdd = json.results;
		
		for (var i=0; i<toAdd.length; i++) {
			var newPlanet = new Planet(toAdd[i]);
			newPlanet.orbitAngle = d.orbitAngle + ((Math.random()));
			newPlanet.setOrbitPosition();

			nodes.push(newPlanet);
		}

	}
	
	//Focusses of data node
	this.focusOnData = function(d){
		$("#focus").val(d.Domain);
		dataInFocus = d;
		targetLinks = dataInFocus.RefIPs;
		updateColor();
		async(function(d) { 
			if(getCookie("accessToken")!==undefined){
				infobox.populate(dataInFocus);
			}else{
				infobox.populateFree(dataInFocus);
			}});
		if(showBackLinks){
        	addLinesToBackLinks(dataInFocus);
		}
	}
	
    function addLinesToBackLinks(d) {
		if (!d.backlinkData){
            d.backlinkData = getJSONBackLinks(d.Domain);
		}
        
        links = [];
        
        update();
        
		backLinkDrawCount=d.backlinkData.length;
		
        for (var i=0; i<backLinkDrawCount; i++) {
            var curDomain = parseName(d.backlinkData[i].SourceURL);
			asyncFetchDomain(curDomain);
		}
    }
	
	//Asynchronously call fetch domain with add line
	function asyncFetchDomain(url) {
		setTimeout(function(){fetchDomain(url,addLine)},0);
	}
	
    // Add a backlink line
	function addLine(d){
		var parent = dataInFocus;
		for(var i=0;i<parent.backlinkData.length;i++){
			var backLinkDomain = parseName(parent.backlinkData[i].SourceURL);
			if(backLinkDomain==d.Domain){
				links.push({source: parent, target: d, json: parent.backlinkData[i] });
				backLinkDrawCount--;
				if(backLinkDrawCount==0){
					update();
				}
				return;
			}
		}
	}
	
    // Show topics as moons around a node
	function expandNode(node) {
        graph.collapseNode();
        if (!node.moreInfo)
            infobox.populateMoreInfo(node);

        for(var i=0; node.moreInfo["TopicalTrustFlow_Topic_"+i]; i++){
			var newMoon = new Moon(node,i);
            nodes.push(newMoon);
        }

        update();
        topicsexpanded = true;
	}
    
    // Remove all moons
    this.collapseNode = function() {
        for(var i=nodes.length-1;i>=0;i--) {
            if(nodes[i].isTopic){
                nodes.splice(i,1);
            }
        }
        update();
        topicsexpanded = false;
    }

    // Setup the tooltip
	function setupTooltip() {
		//Setups the tool tips.
		tooltip.setupTooltipElems(["Domain", "Referring Domains"]);
		tooltip.setDataGetter(function(d) {
			return [
				d.Domain,
				d.RefIPs
				];
		});
	}

    // Called when color changed
	function updateColor() {
		d3.selectAll("circle").style("fill",function(d){ return d.getColor(); });
	}

    // Translate the camera to focus on a node
    function followWebsite() {
        if(document.getElementById('followCheck').checked) {
            // Speed of the camera - moves faster for outer objects to keep up with them
            var camSpeed = 0.1; //(1 - mmLinks.getScaledValue(dataInFocus.RefIPs)) * 0.3;
            
            var toggleInfoBoxButton = document.getElementById("hideshowtipbutton");
            var shouldShiftView = (toggleInfoBoxButton.innerHTML == "Hide");
            
            // Desired camera translations
            var scale = 30/dataInFocus.getRadius();
            var camX = -((dataInFocus.x * scale) - (width / 2) * (shouldShiftView ? .75 : 1)); // TODO: shouldShiftView
            var camY = -((dataInFocus.y * scale) - (height / 2));

            // Current camera translations
            var currentX = d3.transform(svg.attr("transform")).translate[0];
            var currentY = d3.transform(svg.attr("transform")).translate[1];
            var currentScale = d3.transform(svg.attr("transform")).scale[0];
            
            // Differences in translations
            var dx = camX - currentX;
            var dy = camY - currentY;
            var dscale = scale - currentScale;
            
            // Set the new translations
            var newX, newY, newScale;            
            newX = (currentX + (dx * camSpeed));
            newY = (currentY + (dy * camSpeed));
            newScale = (currentScale + (dscale * 0.1));

            // Translate the svg
            svg.attr("transform", "translate(" + newX + "," + newY + ")scale(" + newScale + ")");
        }
    }
    
    // Asynchronously calls something
    function async(fn) {
        setTimeout(fn, 0);
    }
    
    // Switch topic planets on/off
    this.toggleTopicPlanets = function() {
        if(topicsexpanded) {
            graph.collapseNode();
        } else {
            expandNode(dataInFocus);
        }
    }
	
	this.toggleBackLinks = function(){
		showBackLinks = !showBackLinks;
		if(showBackLinks){
			addLinesToBackLinks(dataInFocus);
		}else{
			links=[];
			update();
		}
	}
	
	function orbitLocation(alpha){
		return function(d){
			d.setCurrentOrbitPosition(alpha);
		}
	}
    
    // Called on every tick
	function tick(e){
		var curTime = new Date().getTime();
		var timeChange = curTime - lastTime;
		var alpha = timeChange / (1000/60);
		
		if (alpha > 10)
			alpha = 10;

		lastTime = curTime;
        
        planetForce.nodes(nodes.filter(function(node){ return !node.isTopic; }));
        moonForce.nodes(nodes.filter(function(node){ return node.isTopic; }));

        
		planetForce.start();
		moonForce.start();

		var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;
        
        //Focus on website:
        followWebsite();
        
		while (++i < n) q.visit(collide(nodes[i]));
		
		var circle = svg.selectAll("circle")
			.each(orbitLocation(alpha))
			.attr("cx", function(d) {
				return d.getX();
			})
			.attr("cy", function(d) {
				return d.getY();
			})
            .style("stroke", function(d) {
                return d.hasMouse || d == dataInFocus ? "#999" : "black";
            });
        
        var link = svg.selectAll(".backlinkLine")
            .attr("x1", function(d) { return d.source.getX(); })
            .attr("y1", function(d) { return d.source.getY(); })
            .attr("x2", function(d) { return d.target.getX(); })
            .attr("y2", function(d) { return d.target.getY(); });
        
        svg.selectAll("image")
            .attr("x", function (d) {
                return d.getX() - d.getRadius()/2;
            })
            .attr("y", function (d) {
                return d.getY() - d.getRadius()/2;
            });
    }
    
    function collide(d) {
        var r = d.getRadius() + 16,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r,
            node = d;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.getRadius() + quad.point.getRadius();
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }
})();