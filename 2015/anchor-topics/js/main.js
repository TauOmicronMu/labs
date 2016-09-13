var graph = new (function() {
	var topicForce;
    var anchorForce;
	var topicNodes;
	var anchorNodes;
	var nodes;
	var pageCount = 100;
	var anchorTextCount = 200;
	
	//Makes calls to the api to get all the data necessary
    this.loadData = function(values) {
		var topPages = $.ajax({
			url: "../projects/APIFilter.php",
			data: {
				cmd: "GetTopPages",
				query: values.data.domain,
				datasource: "fresh",
				count: pageCount,
				AccessToken: values.accessToken
			},
			type: "POST",
			async: false,
			dataType: "json"
		}).responseText;

		topPages = $.parseJSON(topPages).DataTables.Matches.Data;

		for(var i = topPages.length-1; i >= 0; i--) {
			if(topPages[i].URL.indexOf(" ")==-1){
				var anchorTextsJSON = $.ajax({
					url: "../projects/APIFilter.php",
					data: {
						cmd: "GetAnchorText",
						item: topPages[i].URL,
						datasource: "fresh",
						count: anchorTextCount,
						AccessToken: values.accessToken
					},
					type: "POST",
					async: false,
					dataType: "json"
				}).responseText;

				anchorTextsJSON = $.parseJSON(anchorTextsJSON).DataTables.AnchorText.Data;

				var anchorTexts = [];
				for(var j = 0; j < anchorTextsJSON.length; j++){
					anchorTexts.push(anchorTextsJSON[j].AnchorText);
				}

				topPages[i].AnchorTexts = anchorTexts;
			} else {
				topPages.splice(i,1);
			}
		}

		var anchorTopics = calculateAnchorTopics(topPages);
		return anchorTopics;
    }
	
		
	//Converts associative array to standard array of objects
	function createAnchorTopicsArray(anchorTopics){
		var data = [];
		var anchorWords = [];
		for(var i in anchorTopics){
			var topic = anchorTopics[i];
			var topicNode = new Topic(topic,i,anchorWords);
			anchorWords = anchorWords.concat(topicNode.children);
			data.push(topicNode);
		}
		return {
			topicData: data,
			anchorData: anchorWords
		}
	}
	
	//Performs calculations to find number of words for each topic
	function calculateAnchorTopics(rawData) {
		var data = {};
		for(var i = 0; i < rawData.length; i++){
			var anchorTexts = rawData[i].AnchorTexts;
			var topic = getSuperTopic(rawData[i].TopicalTrustFlow_Topic_0);
			data[topic]={};
			for(var j = 0; j < anchorTexts.length; j++){
				var words = splitAnchorText(anchorTexts[j]);
				for(var k = 0; k < words.length; k++){
					if(data[topic][words[k]]){
						data[topic][words[k]]++;
					} else {
						data[topic][words[k]] = 1;
					}
				}
			}
		}
		return data;
	}

	
	//Split anchor text into an array of formatted words
	function splitAnchorText(anchorText){
		anchorText = anchorText.replace(/[^a-zA-Z ]+/g, '').replace('/ {2,}/',' ');
		var words = anchorText.split(" ");
		var newWords = [];
		for(var i = 0; i < words.length; i++){
			var newWord = words[i].toLowerCase().replace(" ","");
			if(newWord !== ""){
				newWords.push(newWord);
			}
		}
		return newWords;
	}
	
	
	
    //Generates D3 graph
    this.loadGraph = function(_data) {
		var data = createAnchorTopicsArray(_data);
		
		anchorNodes = data.anchorData;
		topicNodes = data.topicData;
		nodes = anchorNodes.concat(topicNodes);
        
        topicNodes = topicNodes.sort(function(a, b) {a.childrenValue - b.childrenValue} );
		
		setupTooltip();
        
        tutorial.setupMessages(
			["This graphic shows how anchor texts for a website relate to topics.",
            "We grab the top 100 pages from the website, and get the anchor text linking to that page.",
            "We then get the top topic for page the anchor texts came from.",
            "We then sum the amount of times words (anchor text) for a certain topic appear, and then display it by putting anchor texts with the same super topics into groups."]);
		
		layoutTopics();
		
		anchorForce = d3.layout.force()
            .charge(-10)
            .size([width, height])
			.nodes(anchorNodes)
			.on("tick",tick)
			.gravity(0);
		
		topicForce = d3.layout.force()
            .charge(-200)
            .size([width, height])
			.nodes(topicNodes)
            .gravity(0.01);
		
		var svg = d3.select(".graph#anchortopics").append("svg")
			.attr("width", width)
			.attr("height", height)
            .append("g")
			.attr("width", width)
			.attr("height", height);;
		
		var elemEnter = svg.selectAll("g.node")
		   .data(topicNodes.concat(anchorNodes))
		   .enter()
		   .append("g")
		   .attr("class","node");
		
		var circle = elemEnter.append("circle")
			.attr("r", function(d){ return d.getRadius(); })
            .style("stroke-width", function(d) {return (d.getRadius()) / 10; })
			.style("stroke", function(d) {return (d.getBorderColor());})
			.style("fill",function(d){return d.getColor()});
		
		tooltip.setupMouseEvents(circle);
		
		anchorForce.start();
		topicForce.start();
    }
	
	
	function tick(e){
		var svg = d3.select("svg");
		
		var circle = svg.selectAll("circle")
			.attr("cx", function(d) {
				return d.getBoundedCoords().x;
			})
			.attr("cy", function(d) {
				return d.getBoundedCoords().y;
			});
		
		var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;
		
		while (++i < n) q.visit(collide(nodes[i]));
	}
	
	
	this.destroy = function() {
		if(topicForce) 
            topicForce.stop();
        if(anchorForce)
            anchorForce.stop();
	}
    
    function layoutTopics() {		
        var center = window.innerHeight / 2;
        var midVal = topicNodes[Math.round(topicNodes.length / 2)].val;
        
        for(var i = 0; i < topicNodes.length; i++) {
            var posY = center - topicNodes + midVal;
            topicNodes[i].setStartCoords(window.innerWidth * Math.random(), posY);
        }
	}
	
    function collide(d) {
        var r = d.getRadius() + 16,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r,
            node = d;
        return function(quad, x1, y1, x2, y2) {
            if (shouldCollide(quad.point,node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.getRadius() + quad.point.getRadius();
                if (l < r) {
                    l = (l - r) / l * .1;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }
	
	function shouldCollide(node1,node2){
		if(node1) {
			var differentNodes = node1 !== node2;
			var sameType = node1.isTopic == node2.isTopic;
			var inSameTopic = true;
			if(!node1.isTopic && sameType){
				inSameTopic = node1.getTopic() == node2.getTopic();
			}
			return inSameTopic && sameType && differentNodes;
		} else {
			return false;
		}
	}
	
	    // Set tooltip variables
    function setupTooltip() {
        //Set up for tooltips
        tooltip.setupTooltipElems(["Topic", "Anchor Text Word", "Amount"]);
        tooltip.setDataGetter(function(d) {
            return [
                d.getTopic(),
                d.getAnchor(),
				d.getValue()
            ];
        });
    }
    
    this.getLargestNode = function() {
        var max = 0;
        for(var i = 0; i < topicNodes.length; i++) {
            max = topicNodes[i].childrenValue <= max ? max : topicNodes[i].childrenValue;
        }
        return max;
    }
})();
