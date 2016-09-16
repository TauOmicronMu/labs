/**
 * Created by samuelt on 14/09/2016.
 */
var descriptions = {
    protocol: "The protocol defines how the rest of the URL is to be handled and how the resulting data is to be interpreted. The common 'http' protocol defines how web documents are transferred across the internet.",
    domain: "The domain is an easy-to-remember representation of the site's location (IP Address) and sometimes the physical machine on which the site is hosted. It is made up of an optional subdomain (www in this case), a domain name (example) and a top-level-domain (.com).",
    port: "The port is a number that identifies a specific program on a computer or a type of network service. The standard port for web traffic is port 80.",
    path: "The path resembles a path on your computer's file browser, and defines the path to the web document you are trying to access from the domain.",
    query: "The query can be used to provide extra information to the code running on the web page. It can be used to display a certain blog post, a specific number of items in a list of search results, and much more."
};

var descriptionFade = 500;

function fadeIn(elem, duration) {
    elem.hide().fadeIn(duration)
}

function fadeOut(elem, duration) {
    elem.fadeOut(duration)
}
$(function () {
    var urlElements = $(".url-element");
    urlElements.on("click", function (htmlElem) {
        var id = htmlElem.target.id;
        var desc = descriptions[id];
        var descElem = $("#url-element-description");

        // De-highlight all url elements
        urlElements.css("color", "");
        // Keep the clicked element highlighted
        $("#" + id).css("color", "#ff8d40");

        // Fade out existing text then fade in
        var descIsEmpty = descElem.html() === "";
        if(!descIsEmpty) fadeOut(descElem, descriptionFade);
        setTimeout(function() { fadeIn(descElem.html(desc), descriptionFade) }, descIsEmpty ? 0 : descriptionFade);
    });
})