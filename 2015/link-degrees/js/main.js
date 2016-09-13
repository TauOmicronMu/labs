function Graph() {
    // Holds graph data
    var nodes = [];
    var links = [];
    // Node currently being explored
    var curNode;
    // D3 variables
    var force;
    var svg;
    var elem;
    // How zoomed out the SVG is
    var scale = 0.9;
    
    // Time variables
    var timeLastUpdated = 0;
    var updateGap = 10;
    
    this.loadData = function(graphValues) {
        return graphValues;
    }
    
    this.loadGraph = function(graphValues) {
        nodes = [];
        links = [];
        
        svg = d3.select(".graph#linkdegrees")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                 "scale(" + scale + "), " +
                 "translate(" + (((1 - scale)*width)/2) + "," + ((1 - scale)*height)/2 + ")");
        
        d3.select("svg").style("background", "#1c3b51");
        
        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };
        
        datagetter.initialise(graphValues.domain1, graphValues.domain2);
        loadNextData();
        
        force = d3.layout.force()
            .charge(0)
            .gravity(0)
            .size([width, height])
            .nodes(nodes, function(d) { return d.url.hashCode(); })
            .links(links, function(d) { return (d.source.url + d.target.url).hashCode(); })
            .start();
        
        setupTooltips();
        
        this.update();
        
        force.on("tick", tick);
    }
    
    this.destroy = function() {
        nodes = [];
        links = [];
        
        if (force)
            force.stop();
        
        reset();
    }
    
    // Call when datasets have changed
    this.update = function() {
        var linkElem = svg.selectAll(".links").data(links);
        linkElem.exit().remove();
		var linkElemEnter = linkElem.enter();
        
        var lines = linkElemEnter.insert("line", "g.node")
            .attr("class", "links")
            .style("stroke-width", function(d) { return 7; });
        
        elem = svg.selectAll("g.node").data(nodes);
        
		var elemEnter = elem.enter().append("g").attr("class", "node");
        
		var circle = elemEnter.append("circle")
            .attr("class", "nodecircle")
			.attr("r", function(d) { return getRadius(d); })
            .style("stroke", function(d) { return "#333"; })
            .style("stroke-width", function(d) { return getRadius(d) / 20; })
            .on("click", function(d) {
                window.open("http://" + d.url, "_blank");
            });
        
        tooltip.setupMouseEvents(circle);
        
        var text = elemEnter.append("text") 
            .attr("class", "nodelabel")
            .attr("text-anchor", "middle")
            .style("fill", "#FFF")
            .attr("dy", function(d) { return -10; })
            .attr("font-size", function(d) { return 20; });
        
        elem.exit().remove();
        
        force.start();
    }
    
    // Called on tick
    function tick(e) {
        svg.selectAll(".nodecircle")
            .each(gravity(1 * e.alpha))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) {
                return d.highlighted ? "#ff8d40" : "#2d526d";
            });
        
        svg.selectAll(".nodelabel")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .text(function(d) { return getText(d); });
        
        svg.selectAll(".links")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { 
                if (!d.target)
                    return 0;
                return d.target.x; 
            })
            .attr("y2", function(d) { 
                if (!d.target)
                    return 0;
                return d.target.y; 
            })
            .style("stroke", function(d) {
                if (!d.target)
                    return "red";
                
                if (d.source.highlighted && d.target.highlighted) {
                    // Not doing this, because it overlaps nodes. 
//                    d3.select(this).moveToFront();
                    return "#ff8d40";
                } else {
                    return "#2d526d";
                }
            });
        
        svg.selectAll(".nodecircle")
            .moveToFront();
    }
    
    // Handle next set of data from graph
    function handleNewGraphData(rawJSON) {
        // Get the data from the json, make sure is structured properly
        try {
            var data = $.parseJSON(rawJSON);
        } catch(err) {
            console.log("Couldn't parse as JSON:\n" + rawJSON);
            
            loadNextData();
            return;
        }
        
        // Handle errors from server
        if (data.error) {
            console.log("SERVER ERROR: " + data.error);
            var errorCode = data.code;

            switch(errorCode) {
                case 0:
                    displayMessage("Server too busy, try again later");
                    // Return because we want to not load any more data
                    return;
                case 1:
                    displayMessage("Starting up graph...");
                    break;
                case 2:
                    displayMessage("Server not responding, trying again...");
                    break;
                case 3:
                    displayMessage("Invalid access token.");
                    // Return because we want to not load any more data
                    return;
                default:
                    displayMessage("Unrecognised error found");
                    break;
            }

            loadNextData();
            return;
        } else {
            clearMessage();
        }
        
        // Check not updating too often
        var timeNow = new Date().getTime();
        // If not enough time has passed...
        if (timeNow - timeLastUpdated < updateGap) {
            // Call again once the time gap is big enough
            setTimeout(loadNextData, updateGap - (timeNow - timeLastUpdated));
            return;
        } else {
            timeLastUpdated = timeNow;
        }
        
        // Setup data for D3
        combineNewData(data.nodes, data.links);
        setupCurNode(data.curNode);
        setHighlighted();
        
        // Update the graph
        graph.update();
        
        // Check if the graph has finished running
        if (data.running == "false") {
            console.log("Graph finished running.");
            
            // Destroy server side process
            datagetter.destroy();
            
            // Show completion message
            svg.append("text")
                .text("Done!")
                .attr("font-size", "50px")
                .style("fill", "white")
                .attr("x", "10px")
                .attr("y", "30px");
        } else {
            // Get the next lot of data and start again
            loadNextData();
        }
    }
    
    // Combine old data with new data
    function combineNewData(newNodes, newLinks) {
        
        if (nodes.length != 0) {
            // Store the completely new nodes
            var unpaired = [];

            // Combine the old with the new
            newNodes.forEach(function(nd) {
                var hasFoundPair = false;
                
                // Try and find a pair for the new data
                nodes.forEach(function(od) {
                    if (od.url == nd.url) {
                        // Do any combining, currently only depth that changes
                        od.depth = nd.depth;
                        hasFoundPair = true;
                    }
                });
                
                // If it hasn't got a pair, add it here so it can be added later
                if (!hasFoundPair) {
                    unpaired.push(nd);
                }
            });
            
            // Add the completely new nodes in
            unpaired.forEach(function(d) {
                nodes.push(d);
            });
            
            setNodesPosition();
        } else {
            // If there's no nodes to combine
            nodes = newNodes;
        }
        
        // Replace the links and update where it points to
        links = newLinks;
        setupLinkDetails();
    }
    
    // Setup the node's positioning
    function setNodesPosition() {
        var mmDepth = new MinMax(nodes, function (d) { return d.depth = parseInt(d.depth); });
        var amountAtDepth = {};
        
        // Build dictionary of counts of nodes at depths
        amountAtDepth = {};
        for (var i=0; i<nodes.length; i++) {
            var curDepth = nodes[i].depth;
            
            if (curDepth in amountAtDepth) {
                nodes[i].depthIndex = amountAtDepth[curDepth];
                amountAtDepth[curDepth] += 1;
            } else {
                nodes[i].depthIndex = 0;
                amountAtDepth[curDepth] = 1;
            }
        }
        
        // Set the node's position
        for (var i=0; i<nodes.length; i++) {            
            // Get it's depth
            var curDepth = nodes[i].depth;
            
            // Instead of setting the node's pos directly, let it gravitate there
            nodes[i].gx = ((width / amountAtDepth[curDepth]) * nodes[i].depthIndex)
                + ((width / amountAtDepth[curDepth]) / 2);
            nodes[i].gy = (mmDepth.getScaledValue(curDepth)) * height;
            
            // If it hasn't already got coordinates, set them to be where it's meant to be
            if (!nodes[i].x || !nodes[i].y) {
                nodes[i].x = width / 2;
                nodes[i].y = 0;
                
                nodes[i].px = nodes[i].x;
                nodes[i].py = nodes[i].y;
            }
        }
    }
    
    // Make the links point to the right place
    function setupLinkDetails() {
        for (var i=0; i<links.length; i++) {
            nodes.forEach(function(d) {
                if (d.url == links[i].source) {
                    links[i].source = d;
                }
                
                if (d.url == links[i].target) {
                    links[i].target = d;
                }
            });
        }
    }
    
    // Setup the curnode variable based on a URL
    function setupCurNode(url) {
        nodes.forEach(function(d) {
            if (d.url == url) {
                curNode = d;
            }
        });
    }
    
    // Set which nodes to highlight, based off the path of the curNode to the root
    function setHighlighted() {
        var curHL = curNode;
        
        // First set everything to be unhighlighted
        nodes.forEach(function(d) {
            d.highlighted = false;
        });
        
        // While it's not the root...
        while (curHL.depth != 0) {
            // Set it to be highlighted
            curHL.highlighted = true;
            
            // Search for parent
            var foundParent = false;
            for (var i=0; i<links.length; i++) {
                if (links[i].target == curHL) {
                    curHL = links[i].source;
                    foundParent = true;
                    break;
                }
            };
            
            // If it hasn't found it, break from the loop
            if (!foundParent)
                break;
            // If it has, continue with curHL set as the new parent
        }
        
        curHL.highlighted = true;
    }
    
    // Setup tooltips
    function setupTooltips() {
        tooltip.setupTooltipElems(["Domain"]);
        tooltip.setDataGetter(function(d) {
            return [d.url];
        });
    }
    
    // Load the next set of data
    function loadNextData() {
        datagetter.getMostRecent(handleNewGraphData);
    }
    
    // Display a message saying the server is busy
    function displayMessage(txt) {
        clearMessage();
        
        // Show a message in the middle of the screen
        svg.append("text")
            .attr("class", "infomessage")
            .text(txt)
            .attr("text-anchor", "middle")
            .attr("font-size", "50px")
            .style("fill", "white")
            .attr("x", width/2)
            .attr("y", height/2 - 25);
    }

    // Remove any previous messages
    function clearMessage() {
        svg.selectAll(".infomessage").remove();
    }
    
    // Gravitates a node towards a point
    function gravity(alpha) {
        var capD = 100;
        return function(d) {
            var dx = (d.gx - d.x) * alpha;
            var dy = (d.gy - d.y) * alpha;
            d.x += Math.abs(dx) > capD ? capD : dx;
            d.y += Math.abs(dy) > capD ? capD : dy;
        };
    }
    
    /* DATA FUNCTIONS */
    
    function getRadius(d) {
        return 7;
    }
        
    function getText(d) {
        if (d.highlighted) {
            return d.url;
        } else {
            return "";
        }
    }
    
}

var graph;

function reset() {
    graph = new Graph();
}

reset();