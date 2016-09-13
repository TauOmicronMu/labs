var mmDates;
var mmSize;
var nodes = [];
var force;
var totalSize = 0;
var graphWidth;

var graph = new (function() {
    var svg;
    var elem;
    this.shouldHighlight = function (d) { return true; };
    var vertIndent = 0;
        
    this.loadData = function(values) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd<10) dd='0'+dd;

        if (mm<10) mm='0'+mm;
        
        var dateTo = yyyy + "-" + mm + "-" + dd;
		var dateFrom = "2001-01-01";
		
		var dataSource = "fresh";
		
        var gained = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetNewLostBackLinks",
                item: values.data.url,
                datasource: dataSource,
                Count: 10000,
                Mode: 0,
                Datefrom: dateFrom,
                Dateto: dateTo,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;
        
        
        var lost = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetNewLostBackLinks",
                item: values.data.url,
                datasource: dataSource,
                Count: 10000,
                Mode: 1,
                Datefrom: dateFrom,
                Dateto: dateTo,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;
        
        return {New: $.parseJSON(gained), Lost: $.parseJSON(lost)};
    }
    
    this.loadGraph = function(json) {
        nodes = createData(json);
        graphWidth = width * 3;
        
        tutorial.setupMessages(
			["Above is a time line of backlinks gained and lossed over time for a given website.",
            "Green  bubbles are links gained and red are links lost. The size of the bubble indicates the quantity of links losses or gained for that day.",
            "Clicking on a day will break it down in to the domains the links were gained or lost from, and clicking on one of them shows the specific urls the links were lost or gained at."]);
        
        nodes.forEach(function(d) { totalSize += d.getSize(); });
        
        showLRPrompt();
        
        mmDates = new MinMax(nodes, function(d) { return d.date; });
        mmSize = new MinMax(
            nodes.concat(
                { getSize: function() { return 0; }}
            ), 
            function(d) { return d.getSize(); });
     
		
        // Make sure they start in the right place
        nodes.forEach(function(d) {
            d.x = d.getGravPoint().x;
        });
        
        svg = d3.select(".graph#linkevents")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                 "scale(0.9, 0.9), " +
                 "translate(" + ((0.1*width)/2) + "," + (0.1*height)/2 + ")");
        
        setupTooltip();
        setupAxis();
        setupKeyEvents();
        
        force = d3.layout.force()
            .charge(0)
            .gravity(0)
            .size([width, height])
            .nodes(nodes)
            .start();
        
        this.update();
        
        force.on("tick", tick);
    }
    
    this.destroy = function() {
        hideLRPrompt();
        if (force)
            force.stop();
    }
    
    this.update = function() {
        elem = svg.selectAll("g.node").data(nodes, function(d) { return d.id; });
        
		var elemEnter = elem.enter().append("g").attr("class", "node");
        
		var circle = elemEnter.append("circle")
			.attr("r", function(d) { return d.getRadius(); })
			.style("fill", function(d) { return d.getColor(); })
            .style("stroke", function(d) { return "#333"; })
            .style("stroke-width", function(d) { return d.getRadius() / 20; })
            .on("mouseover", function(d) { d.onMouseOver(); })
            .on("click", function(d) { d.onClick(); })
            .call(force.drag);
        
        var text = elemEnter.append("text")
            .attr("text-anchor", "middle")
            .style("fill", "#333")
            .attr("dy", function(d) { return d.getRadius()*0.15; })
            .text(function(d) { return d.getText(); })
            .on("click", function(d) { d.onClick(); })
            .attr("font-size", function(d) {
                var textLen = d3.select(this).text().width();
                return Math.max(d.getRadius() / (textLen > 15 ? (textLen / 13) : 1.5),1);
            });
        
        tooltip.setupMouseWithOther(circle,
            function(d) { d.onMouseOver(); },
            function(d) { d.onMouseOut(); });
        
        tooltip.setupMouseWithOther(text,
            function(d) { d.onMouseOver(); },
            function(d) { d.onMouseOut(); });
        
        elem.exit().remove();
        
        force.start();
    }
    
    function tick(e) {
        var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;
        
		while (++i < n) q.visit(collide(nodes[i]));
        
        svg.selectAll("circle")
            .attr("cx", function(d) { return d.x = Math.max(d.getRadius(), Math.min(graphWidth - d.getRadius(), d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(d.getRadius(), Math.min(height - d.getRadius(), d.y)); })
            .style("fill", function(d) { return d.getColor(); })
            .each(gravity(.05 * e.alpha))
        
        svg.selectAll("text")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }
    
    // Set up button presses
    function setupKeyEvents() {
        // Registers how much to scroll to the right/left.
        $("body").keydown(function(e) {
            if(e.keyCode == 39)
                vertIndent += 20;
            else if(e.keyCode == 37)
                vertIndent -= 20;
            else
                return;
            
            if (vertIndent < 0) vertIndent = 0;
            if (vertIndent > graphWidth-width) vertIndent = graphWidth-width;

            svg.attr("transform",
                 "scale(0.9, 0.9), " +
                 "translate(" + (((0.1*width)/2) - vertIndent) + "," + (0.1*height)/2 + ")");
        });
    }
    
    function setupAxis() {
        // Setup axis objects
        var xAxisScale= d3.scale.linear()
            .domain([mmDates.min, mmDates.max])
            .range([0, graphWidth]);
        
        var xAxis = d3.svg.axis()
            .scale(xAxisScale)
            .orient("bottom")
            .ticks(20)
            .tickFormat(function(d) {
                var dateObj = new Date(d);
                return dateObj.getDate() + getThs(dateObj.getDate()) + " " + months[dateObj.getMonth()] + " " + dateObj.getFullYear();
            });

        // Add axis to SVG
        svg.append("g")
            .attr("class",  "axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("dy", "30px");
    }

    // Set tooltip variables
    function setupTooltip() {
        tooltip.setupTooltipElems(["Amount", "Date"]);
        tooltip.setDataGetter(function(d) {
            return d.getTooltip();
        });
    }
    
    // Collision code
	function collide(node) {
		var r = node.getRadius() + 16,
			nx1 = node.x - r,
			nx2 = node.x + r,
			ny1 = node.y - r,
			ny2 = node.y + r;
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
    
    // Gravitates a node towards a point
    function gravity(alpha) {
        var capD = 100;
        return function(d) {
            var gravPoint = d.getGravPoint();
            var dx = (gravPoint.x - d.x) * alpha;
            var dy = (gravPoint.y - d.y) * alpha;
            d.x += Math.abs(dx) > capD ? capD : dx;
            d.y += Math.abs(dy) > capD ? capD : dy;
        };
    }
})();
