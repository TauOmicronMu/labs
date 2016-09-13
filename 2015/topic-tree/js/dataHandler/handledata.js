var topic_amount = 10;
var accessToken;
var max_subtrees = 10;

function getData(url, _accessToken) {
    accessToken = _accessToken;
    
    var allPages = parseURL(url, 100);
    
    allPages = allPages.sort(function (p1, p2) { return p2.getBacklinkCount() - p1.getBacklinkCount(); });
    
    var tree = makeTree(allPages, 1);
    
    console.log(tree.getMe());
    return tree.getMe();
}

function parseURL(domain, amountOfPages) {
    var pageDetails = [];
    var json = callAPI(domain, amountOfPages);
    
    for(var i in json) {
        var curJSON = json[i];
        var url = curJSON.URL;
        
        if(url != "") {
            var trustFlow = curJSON.TrustFlow;
            var citationFlow = curJSON.CitationFlow;
            var backlinkCount = curJSON.ExtBackLinks;
            var topic = new TopicDetails(curJSON.TopicalTrustFlow_Topic_0, curJSON.TopicalTrustFlow_Value_0);

            pageDetails.push(new PageDetails(url, trustFlow, citationFlow, backlinkCount, topic));
        }
    }
    
    return pageDetails;
}

function callAPI(url, amountOfPages) {
    var returned = $.ajax({
            url: "../projects/APIFilter.php",
            data: {
                cmd: "GetTopPages",
                Query: url,
                datasource: "fresh",
                count: amountOfPages,
                AccessToken: accessToken
            },
            type: "POST",
            async: false,
            dataType: "json"
        }).responseText;
    
    return $.parseJSON(returned).DataTables.Matches.Data;
}

function makeTree(allPages, d) {
    var basePage;
    var rest = [];
    
    for(var i = 0; i < allPages.length; i++) {
        if(allPages[i].getUrlPieces().length > d) {
            rest.push(allPages[i]);
        } else {
            if(basePage) {
                basePage = comparePages(basePage, allPages[i]);
            } else {
                basePage = allPages[i];
            }
        }
    }
    
    return new TopicTree(basePage, rest, (d + 1));
}

function comparePages(p1, p2) {
    return p1.getBacklinkCount() >= p2.getBacklinkCount() ? p1 : p2;
}