function d3loader(config) {
    return function() {
        var radius = Math.min(config.width, config.height) / 2;
        var tau = 2 * Math.PI;

        var arc = d3.svg.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.9)
            .startAngle(0);

        var svg = d3.select(config.container).append("svg")
            .attr("id", config.id)
            .attr("width", config.width)
            .attr("height", config.height)
            .append("g")
            .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")")

        var background = svg.append("path")
            .datum({
                endAngle: 0.33 * tau
            })
            .style("fill", "#4D4D4D")
            .attr("d", arc)
            .call(spin, 1500)

        function spin(selection, duration) {
            selection.transition()
                .ease("linear")
                .duration(duration)
                .attrTween("transform", function() {
                    return d3.interpolateString("rotate(0)", "rotate(360)");
                });

            setTimeout(function() {
                spin(selection, duration);
            }, duration);
        }

        function transitionFunction(path) {
            path.transition()
                .duration(7500)
                .attrTween("stroke-dasharray", tweenDash)
                .each("end", function() {
                    d3.select(this).call(transition);
                });
        }
    };
}

function createLoadingScreen() {
    while(document.getElementById('loader_container') != null) {
        $("#loader_container").remove();
    }
    
    var div = document.createElement('div');
    div.id = "loader_container";
    
    var txt = document.createElement("p");
    txt.innerHTML = "Loading...";
    txt.className = "loadingText";
    div.appendChild(txt);
    
    document.getElementsByTagName('body')[0].appendChild(div);
    
    //For if we want to properly fix it later:
//    var myLoader = d3loader({
//        width: window.innerWidth / 2,
//        height: 500,
//        container: "#loader_container",
//        id: "loader"
//    });
//    myLoader();
}

function removeLoadingScreen() {
    $("#loader_container").remove();
}