var graph = new(function() {
    // Holds keyword data
    var keywordData;
    // Holds url data
    var urlData;
    // Interval increment graph by
    var interval = 5;
    // The maximum domain
    var maxRefDomain;
    // Holds the site to compare's index in the graph
    var siteIndex;
    // Function to extract relevent data from dataset
    var getReleventData = function(d) {
        return d.TrustFlow;
    };
    // Scales for axes
    var scaleX, scaleY;
    // Holds the bars for changing data
    var bars;
    // Holds margin dimensions
    var margin;
    // Graphics
    var svg;
    // The currently selected metric
    var currentlySelected = "trust";
    //W and H;
    var originalH = height;
    var originalW = width;

    this.loadData = function(values) {
        var _keywordResults = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "SearchByKeyword",
                query: values.data.keyword,
                scope: 0,
                count: 1000,
                AccessToken: values.accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;

        var _urlResult = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetIndexItemInfo",
                items: 1,
                item0: values.data.url,
                datasource: "fresh",
                AccessToken: values.accessToken,
                DesiredTopics: 10
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;

        var results = {
            keywordResults: $.parseJSON(_keywordResults).DataTables.Results.Data,
            urlResult: $.parseJSON(_urlResult).DataTables.Results.Data
        };
        return results;
    }


    this.loadGraph = function(_data) {
        keywordData = _data.keywordResults;
        urlData = _data.urlResult[0];

        setupTooltips();

        setupDataButtons();
        tutorial.setupMessages(["This bar chart displays how a given website compares in trust flow, citation flow and various topics to other sites as found by searching a given keyword.",
            "The bar and text highlighted in red shows where the site entered places in the chart.",
            "Click on a bar to see all the websites in that bar."
        ]);

        //Get frequencies array
        var frequencies = getFrequencyList();

        //Define margin of svg
        width = originalW;
        height = originalH;
        margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        }
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;


        //Define axes scales
        scaleX = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(frequencies.map(function(d) {
                return d.intvl
            }));

        scaleY = d3.scale.linear()
            .range([height, 0])
            .domain([0, getMaxFreq(frequencies)]);

        //Append svg to chart div
        svg = d3.select(".graph#keywordcomparator").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        refreshAxes();

        bars = svg.selectAll("g.bar")
            .data(frequencies);

        createBars()
    }

    this.destroy = function() {

    }

    // Create the bar element
    function createBars() {
        var rect = bars.enter().append("rect")
            .on("mouseover", function(d) {
                var dataList = getDataList(d.intvl);
                var dataString = "";
                for (var i = 0; i < dataList.length; i++) {
                    dataString += ("<p>" + dataList[i]);
                }
                tooltip.showHTML(dataString);
            })
            .on("mouseout", function(d) {
                tooltip.clearValues();
            })
            .on("click", function(d) {
                graph.emptyTableRows();
                var dataList = getWebsiteList(d.intvl);
                var table = document.getElementById("websiteList");
                for (var i = 0; i < dataList.length; i++) {
                    table.getElementsByTagName("tbody")[0].appendChild(createTableRow(dataList[i]));
                }
                table.style.display = 'block';
            })
            .attr("y", function(d) {
                return scaleY(d.frq) + (height - scaleY(d.frq));
            })
            .attr("height", function(d) {
                return 0;
            })
            .transition().duration(750)
            .attr("x", function(d) {
                return scaleX(d.intvl);
            })
            .attr("width", scaleX.rangeBand())
            .attr("y", function(d) {
                return scaleY(d.frq);
            })
            .attr("height", function(d) {
                return height - scaleY(d.frq);
            })
            .attr("class", function(d) {
                if (d.intvl == siteIndex) {
                    return "selectedBar";
                } else {
                    return "unselectedBar";
                }
            })
            .style("fill", function(d) {
                if (d.intvl == siteIndex) {
                    return "red";
                } else if (currentlySelected == "trust" || currentlySelected == "citation") {
                    return "#333";
                } else {
                    return getColorForTopic(currentlySelected);
                }
            });
    }

    // Get list of items in tooltip
    function getDataList(selectedIndex) {
        var dataList = [];
        for (var i = 0; i < keywordData.length; i++) {
            var index = Math.floor(getReleventData(keywordData[i]) / interval);
            if (index == selectedIndex) {
                dataList.push(keywordData[i].Title);
            }
            if (dataList.length == 10) {
                break;
            }
        }
        return dataList;
    }

    // Get list of items in bar
    function getWebsiteList(selectedIndex) {
        var dataList = [];
        for (var i = 0; i < keywordData.length; i++) {
            var index = Math.floor(getReleventData(keywordData[i]) / interval);
            if (index == selectedIndex) {
                dataList.push(keywordData[i].Item);
            }
        }
        return dataList;
    }

    // Setup the buttons for changing metric
    function setupDataButtons() {
        // Setup the trust/citation buttons
        d3.select("#data-trust").on("click", function(d) {
            getReleventData = function(d) {
                return d.TrustFlow;
            };

            currentlySelected = "trust";

            refreshGraph();
        });

        d3.select("#data-citation").on("click", function(d) {
            getReleventData = function(d) {
                return d.CitationFlow;
            };

            currentlySelected = "citation";

            refreshGraph();
        });

        // Fill dropdown with topics
        var topicList = getTopicsForData(urlData);
        $('#data-topic')
            .find('option')
            .remove()
        $.each(topicList, function(key, value) {
            $('#data-topic')
                .append($("<option></option>")
                    .attr("value", key)
                    .text(value.name));
        });

        // Setup what the getter function when a topic is selected
        $("#data-topic").change(function(e) {

            var topic = $("#data-topic option:selected").text();
            currentlySelected = topic;

            getReleventData = function(d) {
                var topicList = getTopicsForData(d);
                var topicValue = 0;

                for (var i = 0; i < topicList.length; i++) {
                    if (topicList[i].name == topic) {
                        topicValue = topicList[i].value;
                        break;
                    }
                }
                if (topicValue == 0) {
                    return null;
                }
                return parseInt(topicValue);
            };

            refreshGraph();
        });
    }

    // Get a list of super topics and their values for a piece of data
    function getTopicsForData(d) {
        var count = 0;
        var topics = {};


        while (d["TopicalTrustFlow_Topic_" + count] != null) {
            var superTopic = getSuperTopic(d["TopicalTrustFlow_Topic_" + count]);
            var value = getSuperTopic(d["TopicalTrustFlow_Value_" + count]);

            if (!(superTopic in topics) || topics[superTopic] < value) {
                topics[superTopic] = value;
            }

            count++;
        }

        var ret = [];
        var keys = Object.keys(topics);

        for (var i = 0; i < keys.length; i++) {
            ret.push({
                name: keys[i],
                value: topics[keys[i]]
            });
        }

        ret.sort(function(a, b) {
            return b.value - a.value;
        });

        return ret;
    }

    // Setup tooltip elements
    function setupTooltips() {
        tooltip.setupTooltipElems([""]);
    }

    // Refresh the graph
    function refreshGraph() {
        graph.emptyTableRows();
        var frequencies = getFrequencyList();

        //Define axes scales
        scaleX = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(frequencies.map(function(d) {
                return d.intvl
            }));

        scaleY = d3.scale.linear()
            .range([height, 0])
            .domain([0, getMaxFreq(frequencies)]);

        bars.exit().remove();
        bars.transition().duration(750)
            .attr("y", function(d) {
                return height;
            })
            .attr("height", function(d) {
                return 0;
            });

        bars = d3.select("svg g").selectAll(".bar")
            .data(frequencies);

        createBars();
        refreshAxes();
    }

    // Refresh axes for new data
    function refreshAxes() {
        d3.selectAll(".tick").remove();
        d3.selectAll("text").remove();

        //Create axes using scales
        var xAxis = d3.svg.axis()
            .scale(scaleX)
            .orient("bottom")
            .tickFormat(function(d) {
                return d * interval + " - " + (d + 1) * interval;
            });

        var yAxis = d3.svg.axis()
            .scale(scaleY)
            .orient("left")
            .ticks(10);

        //Call xAxis on svg to append it
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll('.tick')
            .filter(function(d) {
                return d == siteIndex
            })
            .select('text')
            .attr("class", "tick selectedTick")
            .style("font-weight", "bold")
            .style("fill", "red");

        //Call yAxis on svg and append label
        svg.append("g")
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(-40,-35)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .text("Number of sites");
        
        refreshPosOutOf();
    }
    
    function refreshPosOutOf() {
        var pos = 1;
        var maxpos = 0;
        
        for(var i = 0; i < keywordData.length; i++) {
            if(getReleventData(keywordData[i]) > getReleventData(urlData))
                pos++;
            if(getReleventData(keywordData[i]))
                maxpos++;
        }
        
        document.getElementById("pos").innerHTML = pos;
        document.getElementById("maxpos").innerHTML = maxpos;
    }

    // Get the largest frequency
    function getMaxFreq(freqArray) {
        var max = 0;
        for (var i = 0; i < freqArray.length; i++) {
            if (freqArray[i].frq > max) {
                max = freqArray[i].frq;
            }
        }
        return max;
    }

    // Get the frequencies
    function getFrequencyList() {
        maxRefDomain = 0;
        for (var i = 0; i < keywordData.length; i++) {
            var refDomain = getReleventData(keywordData[i]);
            maxRefDomain = Math.max(maxRefDomain, refDomain);
        }

        maxRefDomain = Math.max(maxRefDomain, getReleventData(urlData));

        var length = Math.floor(maxRefDomain / interval);

        var freqArray = [];

        for (var i = 0; i <= length; i++) {
            freqArray.push({
                frq: 0,
                intvl: i
            });
        }

        siteIndex = Math.floor(getReleventData(urlData) / interval);

        for (var i = 0; i < keywordData.length; i++) {
            if (getReleventData(keywordData[i])) {
                freqArray[Math.floor(getReleventData(keywordData[i]) / interval)].frq++;
            }
        }
        
        return freqArray;
    }

    function createTableRow(content) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var a = document.createElement("a");
        tr.className = "websiteListTr";
        a.href = "http://" + content;
        a.innerHTML = content;
        td.appendChild(a);
        tr.appendChild(td);
        return tr;
    }

    this.emptyTableRows = function() {
        var table = document.getElementById("websiteList");
        table.style.display = 'none';
        var trs = table.getElementsByClassName("websiteListTr");
        for (var i = trs.length - 1; i > -1; i--) {
            $(trs[i]).remove();
        }
    }
	
	this.openAnchorTextTool = function() {
		window.location.href = "findKeywords.php";
	}
})();
