/**
 * Created by samuelt on 02/09/2016.
 */

var apiKey = "";

function getData(url) {
    $.ajax({
        url: "http://localhost:8080/2016/api",
        path: "/api",
        method: "GET",
        dataType: "json",
        async: true,
        data: {cmd: "GetBackLinksHistory", accesstoken: apiKey, url: url},
        crossDomain: true,
        success: function(data) {
            var json = process(data);
            downloadData(url + ".json", JSON.stringify(json), "application/json");
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function downloadData(fileName, data, contentType) {
    var blob = new Blob([data], {type: contentType});
    saveAs(blob, fileName);
}

function process(data) {
    console.log("process");
    var result = {};
    var dataTable = data.DataTables.item0.Data;
    for(var i in dataTable) {
        var elem = dataTable[i];
        var arr = [];
        var keys = Object.keys(elem);
        for(var j in keys) {
            var key = keys[j];
            if(key !== "Name") {
                var obj = {date: key, count: elem[key]};
                arr.push(obj);
            }
        }
        var name = elem.Name;
        result[name] = arr;
    }
    return result;
}
