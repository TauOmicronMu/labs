/*
    To set up tooltips:
    1) Call setupTooltipElems with list of labels
    2) Set tooltipDataGetter function that returns list of values to fill tooltip, given d
    3) Call setupMouseEvents with D3 element variables for anything you want mouseover to work with.
*/

var tooltip = new (function () {
    var labels = [];
    var tooltipDataGetter = function (d) {};
    var div;
    
    // Setup the list of items to have
    this.setupTooltipElems = function(_labels) {
        d3.select("#tooltip").remove();
        labels = _labels;
        div = d3.select("body").append("div") 
            .attr("class", "tooltips")
            .attr("id", "tooltip")
            .style("opacity", 0);
        
        $(document).mousemove(function(e) {
            div.style("left", (e.pageX) + "px")
               .style("top", (e.pageY - 28) + "px");
        });
    }
    
    // Set the function to retrieve data from a dataset
    this.setDataGetter = function(dg) {
        tooltipDataGetter = dg;
    }
    
    // Setup mouseover functions
    this.setupMouseEvents = function(elem) {
        elem.on("mouseover", this.mouseoverTooltip);
        elem.on("mouseout", this.mouseoutTooltip);
    }
    
    this.setupMouseWithOther = function(elem, oldOver, oldOut) {
        // I hate whoever made me do this.
        var self = this;
        
        elem.on("mouseover", function(d) {
            oldOver(d);
            self.mouseoverTooltip(d);
        });
                
        elem.on("mouseout", function(d) {
            oldOut(d);
            self.mouseoutTooltip(d);
        });
    }
    
    // Fill the tooltip and display it
    function fillWithValues(values) {
        tooltip.showHTML(getHTMLForValues(values));
    }
    
    this.showHTML = function(html) {
        div .transition()  
            .duration(200)  
            .style("opacity", .9);
        div .html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px"); 
    }
    
    // Get HTML formatting for the values
    function getHTMLForValues(values) {
        var html = "<table class=tttable>";
        for (var i=0; i<labels.length; i++) {
            html += 
                "<tr>" + 
                "<td class=ttlabel>" + labels[i] + ": </td>" + 
                "<td class=ttvalue>" + values[i] + "</td>";
        }
        html += "</table>";
        return html;
    }
    
    // Clear the tooltip
    this.clearValues = function() {
        div.transition()  
            .duration(500)  
            .style("opacity", 0); 
    }

    // Called when revealing tooltip
    this.mouseoverTooltip = function(d) {
        fillWithValues(tooltipDataGetter(d));
    }

    // Called when hiding tooltip
    this.mouseoutTooltip = function(d) {
        tooltip.clearValues();
    }
})();