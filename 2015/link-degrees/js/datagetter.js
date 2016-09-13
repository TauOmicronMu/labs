datagetter = new (function() {
    var startDomain,
        endDomain,
        sessionID;
    
    var baseURL = "getFromJava.php";
    
    this.initialise = function(_startDomain, _endDomain) {
        startDomain = _startDomain;
        endDomain = _endDomain;
        sessionID = parseInt(Math.random() * 1000);
        
        window.onbeforeunload = datagetter.destroy;
        
//        $.ajax({
//            url: baseURL,
//            data: {
//                start: startDomain,
//                end: endDomain,
//                sessionid: sessionID
//            },
//            success: function(res) {
//                console.log(res);
//                
//                if (res == "TOO MANY THREADS") {
//                    console.log("Too many threads");
//                    graph.displayServerBusy();
//                } else {
//                    console.log("Initialised graph creation.");
//                }
//            },
//            async: false
//        });
    }

    this.getMostRecent = function(fn) {
        var accessToken = $("#accesstoken").val();
        
        $.ajax({
            url: baseURL,
            data: {
                start: startDomain,
                end: endDomain,
                sessionid: sessionID,
                accesstoken: accessToken
            },
            success: fn
        });
    }
    
    this.destroy = function(e) {
        $.ajax({
            url: baseURL,
            data: {
                sessionid: sessionID,
                destroy: "true"
            },
            success: function() {
                console.log("Destroyed graph.");
            }
        });
    }
})();