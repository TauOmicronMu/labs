function drawForceDirGraph(pageName, interLinkMode) {
    
    var INFO_DISPLAYED = false;
    graphMap = {};

    interLinkMode = true;

    DEPTH_LIMIT = 3;

    var contentAreaName = "#" + pageName + "content-area";

    //Get width and height of the current page. ~TauOmicronMu
    var width = $(document).width() * 0.8;
    var height = $(document).height() * 0.87;

    var GRAVITY = .25;
    var CHARGE = -70;
    var LINK_DISTANCE = 20;

    if(interLinkMode) {
        GRAVITY = .15;
        CHARGE = -90;
        LINK_DISTANCE = 50;
    }

    var IS_FIRST_STROKE = true;

    /*
     * Majestic topic colour scheme - courtesy of Steve F <3
     .Arts {color: #ff6700;}
     .News {color: #76D54B;}
     .Society {color: #7A69CD;}
     .Computers {color: #d33;}
     .Business {color: #C5C88;}
     .Regional {color: #F582B9;}
     .Recreation {color: #89C7CB;}
     .Sports {color: #55355D;}
     .Kids {color: #fc0;}
     .Reference {color: #C84770;}
     .Games {color: #557832;}
     .Home {color: #d95;}
     .Shopping {color: #600;}
     .Health {color: #009;}
     .Science {color: #6BD39A;}
     .Adult {color: #333;}
     .World {color: #577;}
     */
    var fill = ["#ff6700", "#76D54B", "#7A69CD", "#d33", "#C5C88E",
        "#F582B9", "#89C7CB", "#55355D", "#fc0", "#C84770",
        "#557832", "#d95", "#600", "#009", "#6BD39A", "#333",
        "#577", "#fff"];

    //Colours to be used if the Trust Flow colour scheme is selected.
    var trustColours = [
        "#dddddd", "#e6f0ff", "#cce0ff", "#b3d1ff", "#99c2ff",
        "#80b3ff", "#66a3ff", "#4d94ff", "#3385ff", "#1a75ff",
        "#0066ff", "#005ce6", "#0052cc", "#0047b3", "#003d99",
        "#003380", "#002966", "#001f4d", "#001433", "#000a1a",
        "#000000"
    ];

    var citationColours = [
        "#dddddd", "#e6ffe6", "#ccffcc", "#b3ffb3", "#99ff99",
        "#80ff80", "#66ff66", "#4dff4d", "#33ff33", "#1aff1a",
        "#00ff00", "#00e600", "#00cc00", "#00b300", "#009900",
        "#008000", "#006600", "#004d00", "#003300", "#001a00",
        "#000000"
    ];

    var radius = 7;

    var force = d3.layout.force()
        .gravity(GRAVITY)
        .charge(CHARGE)
        .linkDistance(LINK_DISTANCE)
        .size([width, height]);

    $(contentAreaName + " svg").remove();

    var svg = d3.select(contentAreaName)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var linksvg = svg.append('svg:g')
        .attr("id", "link_elements");

    var nodes = force.nodes(),
        links = force.links();

    function getNodeLabel(d) {
        return d.name + "| Citation: " + d.citation + " | Trust: " + d.trust + " | Topic: " + getMainTopic(d);
    }

    function update() {

        nodes[0].topic = "Reference";

        var drag = force.drag()
            .on("dragstart", dragstart);

        d3.selectAll("input[name=" + pageName + "line-colouring")
            .on("change", colourLines);

        d3.selectAll("input[name=" + pageName + "display-type")
            .on("change", changeDisplay);

        d3.select("#go-deeper-button")
            .on("click", expandAllNodes);

        d3.select("#page-1-go-deeper-button")
            .on("click", expandAllNodes);

        var link = linksvg.selectAll("line")
            .data(links);

        link.enter().append("line")
            .style("stroke-width", 2.5);

        link.exit().remove();

        var node = svg.selectAll("circle")
            .data(nodes);

        node.enter().append("circle")
            .attr("r", calcRadius)
            .attr("class", "node")
            .style("fill", function (d) { return fill[d.group]; })
            .style("stroke", calcStroke)
            .on("dblclick", dblclick)
            .call(drag);

        var texts = svg.selectAll("text.label")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("fill", "black")
            .text(function(d) {
                return (d.id === nodes[0].id)? d.name : "";  });

        node.exit().remove();

        function tick() {
            node.attr("cx", function (d) {
                return d.x = Math.max(radius, Math.min(width - radius, d.x));
            })
                .attr("cy", function (d) {
                    return d.y = Math.max(radius, Math.min(height - radius, d.y));
                });

            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            texts.attr("transform", function(d) {
                return "translate(" + (d.x + 20) + "," + d.y + ")";
            });
        }

        colourLines();
        circleMouseBind();

        force
            .on("tick", tick)
            .start();
    }


    function expandAllNodes() {
        loadingScreen(true);
        setTimeout(function () {
            var nodes = force.nodes();
            for(var c in nodes) {
                var node = nodes[c];
                if(node.isLeaf) addNodeChildrenToDepth(node, 1);
            }
            update();
            loadingScreen(false);
        }, 250);
    }

    function calcStroke(d) {
        if (IS_FIRST_STROKE) {
            IS_FIRST_STROKE = false;
            return "#000";
        }
        return d3.rgb(fill[d.group]).darker();
    }

    function calcRadiusMultiplier(c, t) {
        var scale = d3.scale.sqrt()
            .domain([1, 201])
            .clamp(true)
            .range([0.5, 1.25]);
        var top = Math.pow(t, 2) + (c * t) + t + c;
        var btm = c + 1;
        return scale(top/btm + 1);
    }

    function calcRadius(node) {
        return (node.id === 0) ? 15 : (radius * calcRadiusMultiplier(node.citation, node.trust) - .75);
    }

    function colourLines() {
        svg.selectAll("line")
            .style("stroke", function (l) {
                var citation = ($("input[name=" + pageName + "line-colouring]:checked").val() === "citation");
                var scale = d3.scale.sqrt()
                    .domain([0, 100])
                    .clamp(true)
                    .range([0, 20]);
                if (citation) {
                    return citationColours[Math.round(scale(l.target.citation))];
                }
                return trustColours[Math.round(scale(l.target.trust))];
            });
    }

    function changeDisplay() {
        var duplicates = ($("input[name=" + pageName + "display-type]:checked").val() === "duplicates");
        drawForceDirGraph(pageName, !duplicates);
    }

    function circleMouseBind() {
        svg.selectAll("circle")
            .on("contextmenu", handleRightClick)
    }

    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
        if(d.url === nodes[0].url) return getNodeLabel(d);
        var texts = svg.selectAll("text.label")
            .text(function(l) {
                if(d.url === l.url) {
                    l.displayed = false;
                    return "";
                }
                if(d.url === nodes[0].url) return getNodeLabel(d);
                if(l.displayed) return getNodeLabel(l);
                return "";
            })
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
        if(d.url === nodes[0].url) return getNodeLabel(d);
        var texts = svg.selectAll("text.label")
            .text(function(l) {
                if(d.url === l.url) {
                    l.displayed = true;
                    return getNodeLabel(d);
                }
                if(l.displayed) return getNodeLabel(l);
                return "";
            })
    }

    function isGraphLeaf(node) {
        var links = force.links();
        for(var c in links)
            if(links[c].source.id === node.id) return false;
        return true;
    }

    // Add a node to d3
    function addNode(json) {
        if(interLinkMode && graphMap.hasOwnProperty(json.url)) return graphMap[json.url];
        var node = makeNode(json);
        node.id = force.nodes().length;
        node.raw = json;
        node.isLeaf = false;
        nodes.push(node);
        if(interLinkMode) graphMap[json.url] = node;
        return node;
    }

    function addLink(parentNode, childNode) {
        var link = makeLink(childNode, parentNode, interLinkMode);
        links.push(link);
        return link;
    }

    // Adds a leaf's direct children to d3 and returns the children nodes
    function addNodeChildren(node) {
        var result = [];
        for(var c in node.raw.children) {
            node.isLeaf = false;
            var child = node.raw.children[c];
            var childNode = addNode(child);
            childNode.isLeaf = true;
            result.push(childNode);
            addLink(node, childNode);
        }
        return result;
    }

    function addAllNodeChildren(parentNode) {
        var childrenNodes = addNodeChildren(parentNode);
        for(var c in childrenNodes) addAllNodeChildren(childrenNodes[c]);
    }

    function addNodeChildrenToDepth(parentNode, depth) {
        if(depth === 0) return;
        var childrenNodes = addNodeChildren(parentNode);
        for(var c in childrenNodes) addNodeChildrenToDepth(childrenNodes[c], depth - 1);
    }

    function handleRightClick(p) {
        window.open(p.url, '_blank');
        /*
         $('#page-info').hide();
         if(isGraphLeaf(p)) {
         addNodeChildren(p);
         update();
         }
         */
    }

    // Add the root and its children to the graph, to a maximum depth of DEPTH_LIMIT
    var root = addNode(GRAPH_DATA);
    addNodeChildrenToDepth(root, DEPTH_LIMIT);
    update();

    var texts = svg.selectAll("text.label")
        .text(function(d) {
            if(d.url === nodes[0].url) {
                d.displayed = true;
                return d.name + "| Citation " + d.citation + " | Trust " + d.trust + " | Topic : Reference";
            }
        })
}

function makeNode(link) {
    return {
        url: link.url,
        name: clipName(link.url),
        group: topicColourMap[getMainTopic(link)],
        trust: link.trust,
        citation: link.citation,
        topic: link.topic
    }
}

function makeLink(childNode, parentNode, interLinkMode) {
    return {
        source: interLinkMode ? graphMap[parentNode.raw.url] : parentNode.id,
        target: interLinkMode ? graphMap[childNode.raw.url] : childNode.id,
        value: childNode.raw.trust + parentNode.raw.trust
    };
}
