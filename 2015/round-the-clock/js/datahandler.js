//Gathers and processes all the data
function handleData(jsonResults) {
    var freshBuildDate = jsonResults.freshData.IndexBuildDate;
    var historicBuildDate = jsonResults.historicData.IndexBuildDate;
    
    console.log("Fresh date build data: " + freshBuildDate);
    console.log("Historic date build data: " + historicBuildDate);
    freshData = getRelevData(jsonResults.freshData);
    historicData = getRelevData(jsonResults.historicData);
    
    allData = combineData(freshData, historicData);
    allData = dictToArray(allData);
    addPercentages(allData);
    
    return {
        data: allData,
        freshDate: freshBuildDate,
        historicDate: historicBuildDate
    }
}

function getRelevData(orig) {
    orig = orig.DataTables.Topics.Data;
    relev = [];
    
    for (var i = 0; i < orig.length; i++) {
        relev.push({ name: orig[i].Topic, val: orig[i].TopicalTrustFlow });
    }
    
    return relev;
}

// Combine the two datasets, getting percentage increases
function combineData(fresh, historic) {
    var topicDict = {};
    var d = 0;
    
    for(var i = 0; i < fresh.length; i++) {        
        var topic = fresh[i].name;
        for(var j = 0; j < historic.length; j++) {
            if((topic == historic[j].name) && (fresh[i].val != 0) && (historic[j].val != 0)) {
                topicDict[topic] = { fresh: fresh[i].val, historic: historic[j].val };
                d++;
                if(d >= 100) {
                    i = fresh.length;
                }
            }
        }
    }
    
    return topicDict;
}

function dictToArray (d) {
    a = [];
    
    for (var key in d) {
        a.push({ name: key, f: d[key].fresh, h: d[key].historic });
    }
    
    return a;
}

function addPercentages(a) {
    for (var i=0; i<a.length; i++) {
        a[i].p = (a[i].f - a[i].h) / a[i].h;
    }
}