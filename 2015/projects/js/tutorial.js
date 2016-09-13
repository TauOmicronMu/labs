var firstRun = true;

var tutorial = new (function () {
    var messages = [];
    var tooltipDataGetter = function (d) {};
    var div;
    var n = 0;
    var canRevert = true;
    
    // Setup the list of items to have
    this.setupMessages = function(_messages) {
        if(firstRun && getUrlVars()['embedded'] !== "true") {
            $("#tutorialtip").remove();

            messages = _messages;

            div = d3.select(".graphContainer").append("div") 
                .attr("class", "tooltips")
                .attr("id", "tutorialtip")
                .style("opacity", 0);

            setUpEvents();
            fillWithValues(messages[n]);
            firstRun = false;
        }
    }
    
    // Fill the tooltip and display it
    function fillWithValues(value) {
        div .transition()  
            .duration(200)  
            .style("opacity", .9);  
        div .html(function () {
                var starttxt = "<span style=" + "font-size:12pt>" + value + "</span><br><br>Click to ";
                var endtxt = "<br>Press b to go back a message.";
                if (n == 0 && messages.length == 1) {
                    return starttxt + "close.";
                } else if (n == 0) {
                    return starttxt + "continue...";                
                } else if (messages.length > (n + 1)) {
                    return starttxt + "continue..." + endtxt;
                } else {
                    return starttxt + "close." + endtxt;
                }
            });
    }
    
    // Clear the tooltip
    function clearValues() {
        div.transition()
            .duration(500)
            .style("opacity", 0);
        checkIfDone();
    }
    
    function nextState() {
        n++;
        clearValues();
        if(messages.length > n) {
            fillWithValues(messages[n]);
        }
        checkIfDone();
    }
    
    function checkIfDone() {
        if(messages.length <= n) {
            canRevert = false;
            $("#tutorialtip").remove();
        }
    }
    
    function lastState() {
        if(n != 0) {
            n--;
            clearValues();
            fillWithValues(messages[n]);
        }
    }
    
    function setUpEvents() {
        //CLICK advances the message.
        div.on("click", nextState);
        
        //ENTER or B closes the tutorial.
        $(document).keyup(function(e) {
            if (canRevert && (e.keyCode == 13 || e.keyCode == 78)) {
                nextState();
            }
        });
        
        //n closes the tutorial.
        $(document).keyup(function(e) {
            if (e.keyCode == 66 && canRevert) {
                lastState();
            }
        });
        
        //ESC closes the tutorial.
        $(document).keyup(function(e) {
            if (e.keyCode == 27) {
                n = messages.length;
                clearValues();
            }
        });
    }
})();