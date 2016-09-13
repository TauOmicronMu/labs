var graph = new (function() {
    // Holds data
    var nodes = [];
    // Holds MinMax obj for heights of nodes
    var mmHeights;
	// D3 force layout of graph
    var force;
    
	// Loads data from api
    this.loadData = function(values) {
        var w1json = $.parseJSON($.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetTopics",
                item: values.data.w1,
                datasource: "fresh",
                count: 100,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText);
        
        var w2json = $.parseJSON($.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetTopics",
                item: values.data.w2,
                datasource: "fresh",
                count: 100,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText);
		
		var c1topics = w1json.DataTables.Topics.Data;
		var c2topics = w2json.DataTables.Topics.Data;

		var dic = {};

		for (var i = 0; i < c1topics.length; i++) {
			var c1t = c1topics[i].Topic;

			for (var j = 0; j < c2topics.length; j++) {
				if (c1t == c2topics[j].Topic) {
					dic[c1t] = [c1topics[i].TopicalTrustFlow, c2topics[j].TopicalTrustFlow];
				}
			}
		}
		return dic;
    }
    
    this.loadGraph = function(dic) {
        setupNodes(dic);
        setupTooltip();
        setupMinMax();
        tutorial.setupMessages(["Each bubble represents the highest topical trust flows shared by your site and another's.",
								"The size of each bubble is the total topical trust flow between both sites.",
								"The ratio of your site's trust flow to their's is given by the partitioning of the colours as well as each bubble's position on the chart."]);
        
        // Create the colors
        var color = d3.scale.category20b();
        
        // Create the force layout
        force = d3.layout.force()
            // How much nodes attract/repel eachother
            .charge(-100)
            .size([width, height]);

        // Create graphics element, and set dimensions
        var svg = d3.select(".graph#webbubbles").append("svg")

        // Add the nodes, start up the graph
        force
            .nodes(nodes)
            .start();

        // Sets how to move objects to the front
        d3.selection.prototype.moveToFront = function() {
            return this.each(function() {
                this.parentNode.appendChild(this);
            });
        };


        // Create all the nodes
        var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            // Appending a g element because it's needed to hold text + circle.
            // Wouldn't need if just circle/text.
            .append("g")
            .attr("class", "gnode");

        // Create the circles
        var circle = node.append("circle")
            .attr("class", "node")
            // Set the radius to be the sum of two trusts (see function)
            .attr("r", getRadius)
            // Fills it with the right colour (depends on it's index, see above)
            .style("fill", function(d, i) {
                return "url(#grad" + i + ")";
            })
            // Set the border
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .on("mousedown", function(d) {
                var sel = d3.select(this.parentNode);
                sel.moveToFront();
            })
            // Start the dragging
            .call(force.drag);
        tooltip.setupMouseEvents(circle);

        // Add the labels
        var labels = node
            .append("text")
            // Make it unselectable. Class is in main.css
            .attr("class", "unselectable")
            // Set position
            .attr("dy", ".35em")
            // Set the font size to be dependent on the radius of the circle, 
            // and the length of the string. Works because font is monospace.
            .style("font-size", function(d) {
                var rad = getRadius(d);
                var text = trimText(getSubTopic(d.name), 8);
                return (rad / text.width()) * 20 + "px";
            })
            // Set the text to be centred
            .attr("text-anchor", "middle")
            // Set the label content
            .text(function(d) {return trimText(getSubTopic(d.name), 8);});
        tooltip.setupMouseEvents(labels);

        loadBubbleColors();

        force.on("tick", tick);
    }
    
    this.destroy = function() {
        if(force)
            force.stop();
    }
    
    // Set tooltip variables
    function setupTooltip() {
        //Set up for tooltips
        tooltip.setupTooltipElems(["Category", "Your website", "Their website"]);
        tooltip.setDataGetter(function(d) {
            return [
                d.name,
                d.c1,
                d.c2
            ];
        });
    }

    // Format the nodes into readable status
    function setupNodes(dic) {
        // Translate the dictionary into a usable object array
        nodes = [];
        for (var key in dic) {
            if (dic.hasOwnProperty(key)) {
                nodes.push({
                    name: key,
                    c1: dic[key][0],
                    c2: dic[key][1]
                });
            }
        }

        // Sort the nodes, so the bigger ones are drawn first
        nodes.sort(function(n1, n2) {
            return (n2.c1 + n2.c2) - (n1.c1 + n1.c2);
        });
    }

    // Setup minmax variables
    function setupMinMax() {
        mmWidths = new MinMax(nodes, function(d) { return d.c2 / (d.c1 + d.c2); });
    }

    // Used on text + circle so they stay within their bounds
    function snapToXBounds(d) {
        // Will get x position regardless of x or cx
        var posX = d.x;/*d3.select(this).attr("x");
        posX = posX ? posX : d3.select(this).attr("cx");
        posX = parseFloat(posX)
        if (isNaN(posX)) posX = 0;*/

        // How strong the snap is
        var k = 0.1;
        // Width of the SVG
        var svgHeight = parseFloat(d3.select("svg").style("height"));

        // Calculates where it should be
        var actual = (mmWidths.getScaledValue(d.c2 / (d.c1 + d.c2)) * 0.8 + 0.1) * width;
		
		dif = actual - posX;
		
		return posX += dif * k;
    }

    // Sums the two trusts, and scales it appropriately
    function getRadius(d) {
		var totalNodeValue = 0;
		for(var i=0; i<nodes.length; i++){
			totalNodeValue+=nodes[i].c1 + nodes[i].c2;
		}
        return (width+height)*(d.c1 + d.c2)/totalNodeValue;
    }
    
    // Load the colors for the bubbles
    function loadBubbleColors() {
        // Create the two colours for each node, depending on their trust values
        for (var i = 0; i < nodes.length; i++) {
            // Get the trust values
            var y = nodes[i].c2;
            var x = nodes[i].c1;
            //x = your score, y = their score
            // Set the scale
            var scale = 100 / (x + y);
            var proportion = y * scale;
            // Create the elements, with id's corresponding to their number
            var grad = d3.select("svg")
                .append("defs").append("linearGradient").attr("id", "grad" + i)
                .attr("y1", "0%").attr("y2", "0%").attr("x1", "100%").attr("x2", "0%");
            grad.append("stop").attr("offset", proportion + "%").style("stop-color", "#FFA5A0");
            grad.append("stop").attr("offset", proportion + "%").style("stop-color", "#ADEBAD");
        }
    }
	
    // Collision code
    function collide(node) {
        var r = getRadius(node) + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = getRadius(node) + getRadius(quad.point);
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

    // Called on tick
    function tick(e) {
		var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;
		
		while (++i < n) q.visit(collide(nodes[i]));
		
		for(var i = 0; i < nodes.length; i++) {
			nodes[i].x = boundPosition(nodes[i].x, 0, width);
			nodes[i].y = boundPosition(nodes[i].y, 0, height);
		}
		
        d3.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        d3.selectAll("text")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
		
		nodes.forEach(function(d) {
			d.x = snapToXBounds(d);
		});
    }
	
	function boundPosition(value, min, max) {
		return Math.max(Math.min(value, max), min);
	}
})();
