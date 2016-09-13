var PAGE_1_CONTENT_AREA_SVG = $("#page-1-content-area svg");
var PAGE_INFO = $("#page-info");
var DEMO_AREA = $("#demo-area");

var PAGES = [1,2,3,4];
var lastPage = PAGES[PAGES.length - 1];

var topicColourMap = {
    "Arts": 0,
    "News": 1,
    "Society": 2,
    "Computers": 3,
    "Business": 4,
    "Regional": 5,
    "Recreation": 6,
    "Sports": 7,
    "Kids": 8,
    "Reference": 9,
    "Games": 10,
    "Home": 11,
    "Shopping": 12,
    "Health": 13,
    "Science": 14,
    "Adult": 15,
    "World": 16,
    "None": 17
};

var demoData = [
    "10-3-FRESH-www.birmingham.ac.uk.json",
    "10-3-FRESH-web.mit.edu.json",
    "10-3-FRESH-www.aston.ac.uk.json",
    "10-3-FRESH-www.bcu.ac.uk.json",
    "10-3-FRESH-www.ox.ac.uk.json",
    "10-3-FRESH-www.cam.ac.uk.json",
    "10-3-FRESH-www.imperial.ac.uk.json"
];

var jsonPath = "../res/json/";

//How deep the graph will display to by default.
var DEPTH_LIMIT = 2;
var GRAPH_DATA = null;

function getMainTopic(link) {
    return link.topic === "" ? "None" : link.topic.match("(.+?)(/|$)")[1];
}

function drawDemoData(path) {
    d3.json(jsonPath + path, function (data) {
        GRAPH_DATA = data;
        PAGE_1_CONTENT_AREA_SVG.remove();
        drawForceDirGraph("page-1-", true);
    });
}

function changeSite() {
    var selected_option = $('#page-1-site-choice option:selected');
    var parts = demoData[selected_option[0].index].split("-");
    var url = parts[3].replace(".json", "");
    var breadth = parts[0];
    var depth = parts[1];
    var index = parts[2];
    redirect("index.html?url=" + url + "&breadth=" + breadth + "&depth=" + depth + "&index=" + index);
}

$(document).keypress(function(e){
    if (e.which == 13)  PAGE_2_NEW_REPORT_BUTTON.click(); // Bind Enter key to the "Generate Report" button.
    else if (e.which == 109) PAGE_INFO.hide(); // Bind m key to clear the page info
});

$(document).click(function() { PAGE_INFO.hide(); }); // Hide the hover menu when the user clicks.

function displayPage(n) {
    var idString = "#page-" + n;
    $(idString).show();

    //if (n === 1) drawDemoData(demoData[0]);
    if(n === 2) {
        populateList();
    }

    for(var page in PAGES) if(PAGES[page] !== n) hidePage(PAGES[page]); //Hide all pages that we are not displaying.
}

function hidePage(n) {
    var idString = "#page-" + n;
    $(idString).hide();
    if(n === 1) {
        PAGE_INFO.hide();
        DEMO_AREA.remove();
    }
    if (n === lastPage) PAGE_INFO.hide();
}
function getURL() {
    return window.location.href;
}

function getURLParam(key) {
    var url = getURL();
    var match = url.match(key + "=(.*?)(&|$)");
    return match ? match[1] : null;
}

function redirect(url) {
    console.log("redirect: " + url);
    window.location = url;
}

$(document).ready(function() {
    // Add twitter share button
    $("#twitter-button").append('<a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-text="Ever wondered if @unibirmingham&#39;s website linked to @AstonUniversity? Or even @Cambridge_Uni? Find out here!" data-hashtags="majestic-link-graph" data-show-count="false">Tweet</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>');
    // Get the report params from URL
    var url = getURLParam("url");
    var breadth = getURLParam("breadth");
    var depth = getURLParam("depth");
    var index = getURLParam("index");
    if(url && breadth && depth && index) {
        // If the report params were present
        var filepath = breadth + "-" + depth + "-" + index + "-" + url + ".json";
        // Set twitter card meta tags
        $("meta[name*='twitter:card']").attr("content", "summary_large_image");
        $("meta[name*='twitter:site']").attr("content", "@Majestic");
        $("meta[name*='twitter:title']").attr("content", url + " link graph");
        $("meta[name*='twitter:description']").attr("content", "Link graph representing the links between " + url + " and other sites, by Majestic");
        $("meta[name*='twitter:image']").attr("content", "res/graph.png");
        // Set title
        $("title").text(url + " - Majestic Link Graph");
        padLogo();
        displayPage(1);
        drawDemoData(filepath);
        var i = demoData.indexOf(filepath);
        if(i >= 0) {
            // Set correct dropdown option as selected
            $('select>option:eq(' + i + ')').attr('selected', true);
        } else alert("That report doesn't exist for the moment!")
    } else {
        // Redirect to url with params present
        redirect("index.html?url=www.birmingham.ac.uk&breadth=10&depth=3&index=FRESH")
    }
});
