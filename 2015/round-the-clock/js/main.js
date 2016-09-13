var graph = new (function () {
    // Holds the main graphics for the graph
    var svg;
    // Current state of the graph
    var state = 0;
    // List of nodes
    var nodes;
    // The graph object
    var force;
    // Holds the random position for state 3.
    var rand4;
    // MinMax variables
    var mmFresh,
        mmHistoric,
        mmPercentages;
    // The vertical indent of the graph, used for state 4.
    var vertIndent = 0;
    // Holds where each node should go for the category grouping
    var targetDict = {};
    //The shortest dimension
    var shortestDimension = 1000;
    
    this.loadData = function(values) {
		dataValues = values.data;
        var fresh = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetTopics",
                item: dataValues.url,
                datasource: "fresh",
                count: 100,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;
        
        var historic = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetTopics",
                item: dataValues.url,
                datasource: "historic",
                count: 100,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;
		
        return handleData({freshData: $.parseJSON(fresh), historicData: $.parseJSON(historic)});
    }
    
    this.loadGraph = function(data) {
        state = 0;
        hideLRPrompt();
        if(getUrlVars()['embedded'] == "true") {
            state = 1;
        }
        
        tutorial.setupMessages(["Below you can see an illustration of fresh vs historic topical trust flow data for your chosen website. Each bubble is labelled with the specific topic, coloured to the general topic, and shows the percentage increase or decrease in trust for that specific topic.",
                                    "The size of the bubble is relative to the fresh trust flow.",
                                    "Hover your cursor over a bubble to see more information for that topic.",
                                    "Press space to change the layout of the bubbles. They can be viewed in a big cluster, general topical clusters, a chart of fresh against historic trusts, or ordered by percentage.",
                                    "When in one cluster, generally the higher the bubbles, the better the percentage.",
                                    "Fresh data is generally a few days old, historic data is youngest at around a month old."]);
        
        nodes = data.data;
        
        shortestDimension = Math.min(width, height);
        
        targetDict = getTargetDict(nodes, width, height);

        setupMinMaxes();
        setupKeyEvents();
        setupTooltip();
        
        //Creates the force layout
        force = d3.layout.force()
            .gravity(0)
            .charge(0)
            .nodes(nodes)
            .size([width, height])
            .start();

        //Puts the node in a verticle line with height respective to percentage.
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].y = getHeight(nodes[i]);
            nodes[i].x = width / 2;
        }

        //Creates the svg element.
        svg = d3.select(".graph#roundtheclock").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        //Adds the data to the nodes.
        var elem = svg.selectAll("g")
            .data(nodes);

        var elemEnter = elem.enter()
            .append("g");

        var circle = elemEnter.append("circle")
            .attr("r", getRadius)
            .style("fill", function (d) { return getColorForTopic(d.name); })
            .style("stroke", "#FFF")
            .call(force.drag);
        tooltip.setupMouseEvents(circle);

        var titleText = elemEnter.append("text")
            .attr("class", "nodetext")
            .attr("text-anchor", "middle")
            .text(function(d) {
                if (getHasText(d)) return "";
                
                return trimText(getSubTopic(d.name), 8);
            })
            .attr("font-size", function(d) {
                var text = d3.select(this)[0][0].textContent;
                return (getRadius(d) / text.length) * 2.5;
            })
            .attr("fill", function(d) { return getTextColorForTopic(d.name); });
        tooltip.setupMouseEvents(titleText);

        var percentageText = elemEnter.append("text")
            .attr("class", "subvalue nodetext")
            .attr("text-anchor", "middle")
            .attr("dy", function(d) {
                return getRadius(d) * (getHasText(d) ? 0.3 : 0.5);
            })
            .text(function(d) {
                return getPercentageParsed(d.p);
            })
            .attr("font-size", function(d) {
                var text = d3.select(this)[0][0].textContent;
                var size = (getRadius(d) / text.length);

                if (!getHasText(d))
                    return size;
                else
                    return size * 2;
            })
            .attr("fill", function(d) { return getTextColorForTopic(d.name); });
        
        var dateText = elemEnter.append("text")
            .attr("x", width / 2)
            .attr("y", -70)
            .attr("text-anchor", "middle")
            .attr("font-size", "150%")
            .text("From " + getDateString(data.freshDate) + ", to " + getDateString(data.historicDate));

        tooltip.setupMouseEvents(percentageText);

        force.on("tick", tick);
    }
    
    this.destroy = function() {
        if (force)
            force.stop();
    }
    
    // Changes the state of the graph, and will not do anything if in transition state 4.
    this.switchViewPressed = function() {
		document.getElementById("switch").blur();
        if (state != 4)
            nextState();
    }

    // Set up button presses
    function setupKeyEvents() {
        // Registers how much to scroll to th right/left.
        $("body").keydown(function(e) {
            if (state != 3) {
                vertIndent = 0;
                return;
            }

            if(e.keyCode == 37)
                vertIndent += 20;
            else if(e.keyCode == 39)
                vertIndent -= 20;
            else
                return;

            force.start();
        });

        // Sets up space to move states
        $(document).keyup(function(evt) {
            if (evt.keyCode == 32) {
                graph.switchViewPressed();
            }
        });
    }

    // Setup MinMax objects
    function setupMinMaxes() {
        mmFresh = new MinMax(nodes, function(d) { return d.f; }),
        mmHistoric = new MinMax(nodes, function(d) { return d.h; }),
        mmPercentages = new MinMax(nodes, function(d) { return d.p; });
    }

    // Setup the axes for the FxH state
    function setup2Axis() {
        // Setup axis objects
        var xscale= d3.scale.linear()
            .domain([mmHistoric.min,mmHistoric.max])
            .range([0,width]);
        var xaxis = d3.svg.axis()
            .scale(xscale)
            .orient("bottom")
            .ticks(20)
        var yscale= d3.scale.linear()
            .domain([mmFresh.max,mmFresh.min])
            .range([0,height]);
        var yaxis = d3.svg.axis()
            .scale(yscale)
            .orient("left")
            .ticks(20);

        // Add axis to SVG
        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(0,"+height+")")
            .call(xaxis)
            .selectAll("text")
            .attr("dy", "20px");
        svg.append("g")
            .attr("class","axis")
            .call(yaxis)
            .selectAll("text")
            .attr("dx", "-10px");
        
        // Add labels
        svg.append("text")
            .text("Historic Trust")
            .attr("class", "axislabel")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6);
        svg.append("text")
            .text("Fresh Trust")
            .attr("class", "axislabel")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(90)")
            .attr("y", -10)
            .attr("x", "8%");
    }

    // Setup axis for scrolling through percentages
    function setup1Axis() {
        // Setup axis objects
        var xAxisScale= d3.scale.linear()
            .domain([mmPercentages.min*100,mmPercentages.max*100])
            .range([-width/2,3*width/2]);
        var xaxis = d3.svg.axis()
            .scale(xAxisScale)
            .orient("bottom")
            .ticks(20)
            .tickFormat(function(d){return d+"%"});

        // Add axis to SVG
        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(0,"+height+")")
            .call(xaxis)
            .selectAll("text")
            .attr("dy", "20px");

        // Add labels
        svg.append("text")
            .text("Percentage increase")
            .attr("class", "axislabel")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height - 6);
    }

    // Remove all axes
    function removeAxis() {
        d3.selectAll(".axis").remove();
        d3.selectAll(".axislabel").remove();
    }

    // Progress the state 
    function nextState() {    
        state ++;
        state = state % 5;
        randY = {};
        force.start();

        if (state == 4) {
            removeAxis();
            hideLRPrompt();
            
            // Setup to switch state after x milliseconds
            var interval = setInterval(function (d) {
                nextState();
                clearInterval(interval);
            }, 1000);
        } else if(state==2){
            setup2Axis();
        } else if(state==3){
            removeAxis();
            setup1Axis();
            showLRPrompt();
        }
    }

    // Setup the tooltip
    function setupTooltip() {
        //Setups the tool tips.
        tooltip.setupTooltipElems(["Category", "Fresh trust", "Historic trust", "Percentage change"]);
        tooltip.setDataGetter(function(d) {
            return [
                d.name,
                d.f,
                d.h,
                getPercentageParsed(d.p)
                ];
        });
    }

    // Finds the radius of a circle given the data
    function getRadius(d) {
        var rad = d.f;
        return mmFresh.getScaledValue(rad) * (shortestDimension * 0.07) + (shortestDimension * 0.01);
    }

    // Determines if the text will be large enough to make it worth having on the circle
    function getHasText(d) {
        return (mmFresh.getScaledValue(d.f) < 0.5);
    }

    // Returns the height the node should aim for given its percentage
    function getHeight(d) {
        return height * 0.5 - (d.p * 10 * height);
    }

    // Gravitates a node towards a point
    function gravity(alpha) {
        var capD = 100;
        return function(d) {
            var gravPoint = getGravPoint(d);
            var dx = (gravPoint.x - d.x) * alpha;
            var dy = (gravPoint.y - d.y) * alpha;
            d.x += Math.abs(dx) > capD ? capD : dx;
            d.y += Math.abs(dy) > capD ? capD : dy;
        };
    }

    // Gets the point a node should gravitate towards, depends on the state
    function getGravPoint(d) {
        switch (state) {
            case 0:
                return {x: width/2, y: height/2};
            case 1:
                return targetDict[d.name.split("/")[0]];
            case 2:
                return {x: (mmHistoric.getScaledValue(d.h) * width), y: (1-mmFresh.getScaledValue(d.f)) * height};
            case 3:
                if(randY[d.name] == null){
                    randY[d.name] = height/2+(Math.random()-0.5)*height/2;
                }
                return {x: mmPercentages.getScaledValue(d.p)*width*2-width/2, y: randY[d.name]};
            case 4:
                return {x: width/2, y: (1-mmPercentages.getScaledValue(d.p))*height * 20 - height*8};
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
            if (quad.point && (quad.point !== node) && (state != 1 || node.name.split("/")[0] == quad.point.name.split("/")[0]) && (state != 2) && (state != 3)) {
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

    // Called on every tick
    function tick(e) {
        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;

        while (++i < n) q.visit(collide(nodes[i]));

        svg.selectAll("circle")
            .each(gravity(.05 * e.alpha))
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });

        svg.selectAll(".nodetext")
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            });

        svg.selectAll(".subtext")
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            });

        var scale = 0.8;
        svg.attr("transform", "translate(" + (((1 - scale)*width)/2 + (state == 3 ? vertIndent : 0)) + "," + ((1 - scale)*height)/2 + ")"
                + ",scale(" + scale + ")");
        
        svg.selectAll(".axislabel")
            .attr("font-size", function() { return height / 40; });
    }

    // Get the dictionary for grav points in the topic state
    function getTargetDict(data, width, height) {
        width *= 1;
        height *= 1;

        var margin = shortestDimension * 0.15;
        var targetWidth = width - margin * 2;
        var targetHeight = height - margin * 2;

        targetDict = {};

        for (var i = 0; i < data.length; i++) {
            nameSplit = data[i].name.split("/");
            superTopic = nameSplit[0];
            targetDict[superTopic] = {
                x: 0,
                y: 0
            };
        }
		
		var length = 0;
		for (key in targetDict){
			if(targetDict.hasOwnProperty(key)){
				length++;
			}
		}
		
		var ratio = (width/height);
		
        pointAmount = Object.keys(targetDict).length;
        var colAmount = Math.round(Math.sqrt(length*ratio))-1;
        var rowAmount = Math.round(Math.sqrt(length/ratio))-1;

        var keys = [];
        for (var k in targetDict) keys.push(k);

        for (var i = 0; i < keys.length; i++) {
            targetDict[keys[i]] = {
                x: ((i % (colAmount+1)) * (targetWidth / colAmount)) + margin,
                y: (Math.floor(i / (colAmount+1)) * (targetHeight / rowAmount)) + margin
            };
        }

        return targetDict;
    }
    
    function getDateString(date) {
        date = date.split("-");
        var day = parseInt(date[2]);
        var month = months[parseInt(date[1])];
        var year = date[0];
        return day + getThs(day) + " of " + month + " " + year;
    }
})();