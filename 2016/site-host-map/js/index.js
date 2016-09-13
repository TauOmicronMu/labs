// DataMaps uses 3 character country codes rather than the standards, so we have to map the ones from the Geo API to the DataMaps country codes
var countryCodeMap = {};

// The data to draw
var mapData = {};
// Num sites to consider
var numSites = 2000;
// The colour scale points
var scaleMin = 0, scaleMid = 0, scaleMax = 0;
// The colour scale colours
var colourMin = "#00ccff", colourMid = "#0066ff", colourMax = "#3333cc";
var sliderStep = 5;

// The map itself
var choropleth = new Datamap({
    element: document.getElementById("choropleth"),
    projection: 'mercator',
    done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            var win = window.open("https://en.wikipedia.org/wiki/" + geography.properties.name.replace(" ", "_"), "_blank");
            if(win) win.focus();
        });
    },
    geographyConfig: {
        popupTemplate: function (geography, data) {
            return "<div class='hoverinfo'>" + geography.properties.name + (!!data ? "<br>Sites: " + data.count : "")
        },
        borderColor: 'black',
        highlightFillColor: 'teal'
        //highlightBorderColor: 'white'
    },
    fills: {
        defaultFill: 'white'
    }
});

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "json/codemap.json",
        dataType: "json",
        success: function (data) {
            countryCodeMap = data.data;
            $.ajax({
                type: "GET",
                url: "json/data.json",
                dataType: "json",
                success: function (data) {
                    mapData = data.data;
                    setScaleDomain(0, 50, 100);
                    d3.select("#slider").call(d3.slider().axis(true).value(scaleMin).min(0).max(scaleMax - sliderStep).step(sliderStep).on("slide", function (evt, val) {
                        setScaleDomain(val, scaleMid, scaleMax);
                    }));
                }
            });
        }
    });
});

function setScaleDomain(min, mid, max) {
    scaleMin = min;
    scaleMid = mid;
    scaleMax = max;
    draw();
}

function setScaleColours(min, mid, max) {
    colourMin = min;
    colourMid = mid;
    colourMax = max;
    draw();
}

// Parse mapData and draw the results
function draw() {
    var colourScale = d3.scale.linear().domain([scaleMin, scaleMax]).range([colourMin, colourMax]);
    var obj = {};
    numSites = Math.min(numSites, mapData.length);
    for (var i = 0; i < numSites; i++) {
        var elem = mapData[i];
        var countryCode = elem.country_code;
        // Get the country code from the countryCodeMap if it exists there
        if (countryCodeMap.hasOwnProperty(countryCode)) countryCode = countryCodeMap[countryCode];
        // Increment the country code count or set it to 0
        obj[countryCode] = obj.hasOwnProperty(countryCode) ? obj[countryCode] + 1 : 1;
    }
    // Convert the coutry code counts to objects with the count and colour
    for (var i in Object.keys(obj)) {
        var key = Object.keys(obj)[i];
        var count = obj[key];
        var colour = 0;
        if(key === "USA") colour = "#000066";
        else colour = count >= scaleMin ? colourScale(count) : "white";
        obj[key] = {color: colour, count: count};
    }
    choropleth.updateChoropleth(obj);
}