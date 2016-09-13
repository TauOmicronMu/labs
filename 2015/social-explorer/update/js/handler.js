//A list of the accounts we don't want to include in the chart.
var badHandles = ["twitter", "twitterdev", "search"];

//Loads in data from the CSV.   
function newdata() {
    var timestamp = new Date().getTime();;
    
    $('#output').empty();
    
    var timeid = $.ajax({
        url: "mysql/savetime.php",
        data: {
            timestamp: timestamp
        },
        type: "POST",
        async: false
    }).responseText;
    
    $('#output').append($("<p></p>").text("Loading data..."));       
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }   

    input = document.getElementById('fileupload');
    if (!input) {
        alert("Couldn't find the fileinput element.");
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");               
    } else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = function() {
            processdata(fr.result, timeid);
        };
        fr.readAsText(file);
    }
}

//Process the loaded data.
function processdata(csv, timeid) {
    // Get all the lines
    var lines = csv.split("\r");
    
    // Get the relevent indexes
    var columnNames = lines[0].split(",");
    var indexURL = columnNames.indexOf("URL"),
        indexUsername = columnNames.indexOf("Username"),
        indexScore = columnNames.indexOf("Score"),
        indexTrust = columnNames.indexOf("TrustFlow"),
        indexCitation = columnNames.indexOf("CitationFlow"),
        indexSubNets = columnNames.indexOf("RefSubNets"),
        indexTopicTrust0 = columnNames.indexOf("TopicalTrustFlow_Topic_0"),
        indexTopicValue0 = columnNames.indexOf("TopicalTrustFlow_Value_0"),
        indexTopicTrust1 = columnNames.indexOf("TopicalTrustFlow_Topic_1"),
        indexTopicValue1 = columnNames.indexOf("TopicalTrustFlow_Value_1"),
        indexTopicTrust2 = columnNames.indexOf("TopicalTrustFlow_Topic_2"),
        indexTopicValue2 = columnNames.indexOf("TopicalTrustFlow_Value_2"),
        indexTopicTrust3 = columnNames.indexOf("TopicalTrustFlow_Topic_3"),
        indexTopicValue3 = columnNames.indexOf("TopicalTrustFlow_Value_3"),
        indexTopicTrust4 = columnNames.indexOf("TopicalTrustFlow_Topic_4"),
        indexTopicValue4 = columnNames.indexOf("TopicalTrustFlow_Value_4");
    
    // Will hold the final set of pages
    var usefulLines = [];
    
    //Creates all of the pages.
    for(var i = 1; i < lines.length - 1; i++) {
        var parts = lines[i].split(",");
        if(!hasSubdomain(parts[indexURL])) {
            var page = new Page(
                parts[indexURL],
                parts[indexUsername],
                parts[indexScore],
                parts[indexTrust],
                parts[indexCitation],
                parts[indexSubNets],
                [{ "topic": parts[indexTopicTrust0], "value": parts[indexTopicValue0] },
                { "topic": parts[indexTopicTrust1], "value": parts[indexTopicValue1] },
                { "topic": parts[indexTopicTrust2], "value": parts[indexTopicValue2] },
                { "topic": parts[indexTopicTrust3], "value": parts[indexTopicValue3] },
                { "topic": parts[indexTopicTrust4], "value": parts[indexTopicValue4] }]
            );

            if (badHandles.indexOf(page.getProfile()) == -1) {
                usefulLines.push(page);
            }
        }
    }
    
    //Begin building the data structure used in the graph.
    var structure = new Structure("All", "All", usefulLines, 0, usefulLines);
    
    var data = structure.getMe();
    
    $('#output').append($("<p></p>").text("Saving data..."));
        
    //Create broken up data
    var notop10data = printData(data, timeid);
    $.ajax({
        url: "mysql/savedata.php",
        data: {
            topic: "chart",
            data: encodeURI(JSON.stringify(notop10data)),
            timeid: timeid
        },
        type: "POST",
        async: false
    });
        
    $('#output').append($("<p></p>").text("Done!"));
}

function hasSubdomain(url) {
    url = url.split("//")[1];
    var subdomain = url.split(".")[0];
    
    return !(subdomain == "twitter" || subdomain == "www");
}

//Sends the data to the php file to save it on the server
function printData(data, timeid) {
    $.ajax({
        url: "mysql/savedata.php",
        data: {
            topic: encodeURI(data.fullname.split("/").join("-")),
            data: encodeURI(JSON.stringify(data.topprofiles)),
            timeid: timeid
        },
        type: "POST",
        async: false
    });
    
    delete data.topprofiles;
    
    var tempChildren = [];
    if(data.children) {
        for(var i = 0; i < data.children.length; i++) {
            tempChildren.push(printData(data.children[i], timeid));
        }
    }
    
    data.children = tempChildren;
    
    return data;
}

function rollback() {
    $('#output').empty();
    
    $.ajax({
        url: "mysql/roll-back.php",
        async: false
    });
    $('#output').append($("<p></p>").text("Data restored to previous data set."));
}
