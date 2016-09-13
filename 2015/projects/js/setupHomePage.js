/*
    Dynamically adds in projects
    You can set "link" or "img" if you want a link or image that differs from the name
*/

var homeIcons = [
    { name: "WebBubbles", link: "/web-bubbles" },
    { name: "Topic Tree" },
    { name: "Round The Clock" },
    { name: "The Majestic Universe" },
    { name: "Link Degrees" },
    { name: "Link Pulse" },
    { name: "Link Events" },
    { name: "MRacing" },
    { name: "Anchor Topics" },
    { name: "Keyword Comparator" },
    { name: "Social Explorer" }
];

function setupHomePage(){
    var container = $("#projLinks");
    
    var getLinkFromName = function(name) {
        return serv_dir + "/" + name.toLowerCase().split(" ").join("-");
    };
    
    var getImageFromName = function(name) {
        return name.toLowerCase().split(" ").join("") + ".png";
    };
    
    homeIcons.forEach(function(i) {
        container
            .append(
                $("<div></div>")
                    .attr("class", "col-md-4 col-sm-6")
                    .append(
                        $("<a></a>")
                            .attr("class", "projectTitleHolder")
                            .attr("href", i.link ? serv_dir + i.link : getLinkFromName(i.name))
                            .append(
                                $("<p></p>")
                                    .attr("class", "projectTitle")
                                    .text(i.name)
                            )
                            .append(
                                $("<img></img>")
                                    .attr("src", "res/buttonImages/" + (i.img ? i.img : getImageFromName(i.name)))
                                    .attr("height", "300px")
                                    .attr("width",  "300px")
                            )
                    )
            );
    });
    
    // Makes sure footer doesn't cover last items
    container.css("margin-bottom", "50px");
}