function getDataMapCountryCode(country_name) {
    var countries = Datamap.prototype.worldTopo.objects.world.geometries;
    for (var i = 0, j = countries.length; i < j; i++) {
        if(countries[i].properties.name === country_name) return countries[i].id;
    }
    return "";
}
/**
 * Created by samuelt on 05/09/2016.
 */
// Convert majestic million CSV to codemap.json (a mapping of ISO country codes to DataMap country codes) and data.json files
function convertCSV(data) {
    Papa.parse(data, {
        complete: function (data) {
            var arr = data.data;
            var result = [];
            var codeMap = {};
            for (var i = 1000; i < Math.min(arr.length, 2000); i++) {
                $.ajax({
                    type: "GET",
                    url: "http://freegeoip.net/json/" + arr[i][2],
                    dataType: "json",
                    success: function (data) {
                        if(!codeMap.hasOwnProperty(data.country_code)) {
                            codeMap[data.country_code] = getDataMapCountryCode(data.country_name);
                        }
                        result.push(data);
                    }
                });
            }
            setTimeout(function () {
                console.log("saving");
                var blob = new Blob([JSON.stringify({data: result})], {type: "application/json"});
                saveAs(blob, "data2.json");
                blob = new Blob([JSON.stringify({data: codeMap})], {type: "application/json"});
                saveAs(blob, "codemap.json");
            }, 40000);
        }
    })
}

function getDataMapCountry(country) {
    var countries = Datamap.prototype.worldTopo.objects.world.geometries;
    for (var i = 0, j = countries.length; i < j; i++) {
        if(countries[i].properties.name === country) return countries[i];
    }
    return {};
}