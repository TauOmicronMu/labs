// Add appropriate safety space around the Majestic logo, as per the style guide (albeit modified somewhat)
function padLogo() {
    //How much to divide the original width and height by to calculate the padding.
    var PADDING_DIVISOR = 16;

    var majesticLogo = document.getElementById("logo");

    // Get the width and height of the logo
    var width = majesticLogo.clientWidth;
    var height = majesticLogo.clientHeight;

    // Calculate the margin width and half the height, so as to not calculate them twice in the next step
    var paddingWidth = width / PADDING_DIVISOR;
    var paddingHeight = height / PADDING_DIVISOR;

    // Set the horizontal margin to the paddingWidth and the vertical margin to the paddingHeight
    $("#logo").css({
        "margin-left": paddingWidth,
        "margin-right": paddingWidth,
        "margin-top": paddingHeight,
        "margin-bottom": paddingHeight
    });
}

/*
 * Cuts a string down to 40 chars.
 */
function clipName(name) {
    var clippedName = name;
    if(clippedName.length > 40) {
        clippedName = clippedName.slice(0,39);
        clippedName += "..."
    }
    return clippedName;
}

/*
 * Displays a full-screen loading screen when true, and disables it when false.
 * Also disables input while the loading screen is active.
 */
function loadingScreen(b) {
    var htmlInput =  $("html :input") ;

    if(b) {
        $.LoadingOverlay("show");
        htmlInput.prop("disabled", true);
    }
    else {
        $.LoadingOverlay("hide");
        htmlInput.prop("disabled", false);
    }
}

function truncate(data, depth) {
    function aux(data, depth) {
        var newData = {};
        newData.id = data.id;
        newData.trust = data.trust;
        newData.citation = data.citation;
        newData.url = data.url;
        newData.name = data.name;
        newData.topic = data.topic;
        newData.children = [];
        if(depth === 0) {
            return newData;
        }
        for(child in data.children) {
            newData.children.push(aux(data.children[child], depth - 1));
        }
        return newData;
    }
    return aux(data, depth);
}