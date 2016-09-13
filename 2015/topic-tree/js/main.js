var graph = new (function() {
    // The d3 tree setup
    var tree;
    // The SVg element
    var svg;
    // Root of the tree
    var root;
    // Maximum trust flow across the graph
    var maxTrustFlow;
    // Maximum backlink count across the graph
    var maxBackLinkCount;
    // Object that holds diagonal positioning
    var diagonal;
    // Couldn't tell you... used in update function?
    var i = 0;
    var duration = 350;
    
    this.loadData = function(graphValues) {
        return getData(graphValues.data.url, graphValues.accessToken);
    }
    
    this.loadGraph = function(json) {
        height = window.innerHeight - 50;
        // Get the data
        root = json;
        setupMax();
        setupTooltip();
        tutorial.setupMessages(["This tree shows how a given website can be split into its various directories for a given number of top pages on the site.",
								"The colours show the greatest topical trust flow in all directories within a particular directory whereas the size represents an average general trust flow.",
								"The line thickness shows the total number of external backlinks to all pages within the given directory."]);

        // The diamater of the graph
        var diameter = Math.min(height, width);
        
        tree = d3.layout.tree()
            .size([360, diameter / 2 - 80])
            .separation(function(a, b) {
                return (a.parent == b.parent ? 1 : 10) / a.depth;
            });

        diagonal = d3.svg.diagonal.radial()
            .projection(function(d) {
                return [d.y, d.x / 180 * Math.PI];
            });

        svg = d3.select(".graph#topictree").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.behavior.zoom().on("zoom", function() {
                svg.attr("transform", "translate(" + (d3.event.translate[0] + (width/2)*d3.event.scale) + "," + (d3.event.translate[1] + (height/2)*d3.event.scale) + ")" + " scale(" + d3.event.scale + ")")
            }))
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.selection.prototype.moveToFront = function() {
            return this.each(function() {
                this.parentNode.appendChild(this);
            });
        };
        
        root.x0 = diameter / 2;
        root.y0 = 0;
        
        // Only collapse if other branch
        root.children.forEach(collapseOthers);
        
        update(root);
        
        d3.select(self.frameElement).style("height", height);
    }
    
    this.destroy = function() {
        
    }

    // Called on tick
    function update(source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 80;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });


        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
            .on("click", click)
            .on("mouseover", function(d) {
                var parents = getParents(d);
                d3.selectAll("path.link").style("stroke", function(l) {
                    for (var i = 0; i < parents.length - 1; i++) {
                        if (l.source == parents[i] && l.target == parents[i + 1]) {
                            return getColorForData(l.target);
                        }
                    }
                    
                    return "#F2F2F2";
                });
            })
            .on("mouseout", function(d) {
                d3.selectAll("path.link").style("stroke", function(l) {
                    return getColorForData(l.target);
                });
            });

        var circle = nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });
        tooltip.setupMouseEvents(circle);

        nodeEnter.append("text")
            .attr("class", "nodelabel")
            .attr("x", 10)
            .attr("dy", ".35em")
            .attr("text-weight", "bold")
            .attr("text-anchor", "start")
            .attr("transform", function(d) {
                if (d.x < 180) {
                    return "translate(0)";
                } else {
                    return "rotate(180)translate(" + (-getTextTranslateAmount(d))  + ")";
                }
            })
            .text(function(d) {
                return getNodeText(d);
            })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", function(d) {
                var trust = d.trustFlow;
                return 4.5 + (trust / maxTrustFlow) * 5.5;
            })
            .style("fill", function(d) {
                return !d._children ? getColorForData(d) : darkerColor(getColorForData(d), 0.6);
            })
            .style("stroke", function(d) {
                return !d._children ? getColorForData(d) : darkerColor(getColorForData(d), 0.6);
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1)
            .attr("transform", function(d) {
                return d.x < 180 ? "translate(0)" : "rotate(180)translate(" + getTextTranslateAmount(d) + ")";
            });

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .style("fill", "none")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .style("stroke", function(d) {
                return getColorForData(d.target);
            })
            .style("stroke-width",
                function(d) {
                    var backlinkWidth = Math.log(1000000 * d.target.backlinkCount / maxBackLinkCount) / Math.log(4);
                    
                    if (1 > backlinkWidth) {
                        return 1;
                    } else {
                        return backlinkWidth;
                    }
                });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Sets up the tooltips.
    function setupTooltip() {
        tooltip.setupTooltipElems(["Directory", "Top Topic", "Trust","Full Path"]);
        tooltip.setDataGetter(function(d) {
            var topic = d.topTopic.name;
            var superTopic = "No Topic";
            if (topic != "") {
                superTopic = topic.split("/")[0];
            }
			var fullDir = getFullDir(d);
            return [
                d.name,
                superTopic,
                d.trustFlow,
				fullDir
            ];
        });
    }

    // Get the maximum amounts (used for scaling)
    function setupMax() {
        maxTrustFlow = maxTrust(root);
        maxBackLinkCount = root.backlinkCount;
    }

    // Gets the color for a piece of data
    function getColorForData(d) {
        if (d.topTopic != null) {
            return getColorForTopic(d.topTopic.name);
        } else {
            return "black";
        }
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }

        update(d);
    }

    // Collapse nodes
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
    }

    // Collapse all nodes with name "Other"
    function collapseOthers(d) {
        if (d.name == "Other") {
            collapse(d);
        }

        if (d.children) {
            d.children.forEach(collapseOthers);
        }

        if (d._children) {
            d._children.forEach(collapseOthers);
        }
    }

    // Get all parennts of a node
    function getParents(d) {
        if (d.parent) {
            var pParents = getParents(d.parent);
            pParents.push(d);
            return pParents;
        } else {
            var ar = [d];
            return ar;
        }
    }

    // Get the maximum trust level across graph
    function maxTrust(json) {
        if (json.children.length == 0) {
            return json.trustFlow;
        } else {
            var max = json.trustFlow;
            for (var i = 0; i < json.children.length; i++) {
                var tempMax = maxTrust(json.children[i]);
                if (tempMax > max) {
                    max = tempMax;
                }
            }
            return max;
        }
    }
	
	function getFullDir(d){
		var parentList = getParents(d);
		var fullDir = "";
		for(var i=0; i<parentList.length; i++){
			if(parentList[i].name!=="" && parentList[i].name != "Other"){
				fullDir+=(parentList[i].name+"/");
			}
		}
		return fullDir;
	}
	
	function getNodeText(d){
		if(d==root){
			return "";
		}else{
			return trimText(d.name, 10);
		}
	}
	
	function getTextTranslateAmount(d){
		return -((getNodeText(d).width())+30);
	}
	
})();
