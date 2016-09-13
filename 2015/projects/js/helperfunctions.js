String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

String.prototype.width = function(font) {
    var f = font || '12px Verdana',
        o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
        w = o.width();

    o.remove();

    return w;
};

//Gets the size of the window the script showuld work with. Should be called in graph.php (or where ever the d3 svg is constructed)
var width = window.innerWidth,
    height = window.innerHeight - 100;

function getPercentageParsed(p) {
    var n =  parseInt(p * 100) + "%";
    if(n.charAt(0) != '-') {
        n = "+" + n;
    }
    return n;
}

var svgZoom = 1;
function setupZoom(svg) {
    d3.select("body").on("keydown", function() {
        switch(d3.event.keyCode) {
            case 38:
                svgZoom *= 1.1;
                break;
            case 40:
                svgZoom /= 1.1;
                break;
        }
        
        setZoom(svg, svgZoom);
    });
}

function setZoom(svg, zoom) {
    svg.attr("transform",
             "translate(" + ((1-zoom)*width)/2 + "," + ((1-zoom)*height)/2 + ")," + 
             "scale(" + zoom + "," + zoom + ")");
}

function setSVGTranslate(svg, trans, zoom) {
    svg.attr("transform",
             "translate(" + (((1-zoom)*width)/2 + trans.x) + "," + (((1-zoom)*height)/2 + trans.y) + ")," + 
             "scale(" + zoom + "," + zoom + ")");
}

function getSuperTopic(topic) {
    return topic.split("/")[0];
}

function getSubTopic(topic) {
    var spl = topic.split("/");
    return spl[spl.length - 1];
}

function trimText(text, n) {
    if (text.length <= n) {
        return text;
    } else {
        return text.slice(0, n) + "...";
    }
}

function getLabel(textElem) {
    return d3.select(textElem).html();
}

function formatNumber(i) {
    var suffixes = ["", "thousand", "million", "billion", "trillion"];
    
    var count = 0;
    while (i.toString().length > 3) {
        count ++;
        i = Math.round(i / 1000);
    }
    
    return i + " " + suffixes[count];
}

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var months = ["January", "February", "March", "April", "May",
 "June", "July", "August", "September", "October",
 "November", "December"];

function getThs(n) {
    n = n + "";
    
    switch(n[n.length-1]) {
        case '1':
            return "st";
        case '2':
            return "nd";
        case '3':
            return "rd";
        default:
            return "th";
    }
}

function syncAJAXToJSON(url, data) {
    var resp = $.ajax({
        url: url,
        data: data,
        async: false
    }).responseText;
	
    var json = $.parseJSON(resp);
    
    return json;
}

function syncPostAJAXToJSON(url, data) {
    // Get the access token
    var accessToken = $("#accesstoken").val();
    
    // If it exists, attach it to the data to send
    if (accessToken)
        data.accessToken = accessToken;
    
    var resp = $.ajax({
        url: url,
        data: data,
        method: "POST",
        async: false
    }).responseText;
	
    var json = $.parseJSON(resp);
    
    return json;
}

function loadFullAccess() {
    window.location.replace(window.location.href.split("?")[0] + "?fullaccess=true");
}

function loadKeyGetter() {
    window.open("https://majestic.com/apps/GGWKJQBU", '_blank');
}

// Show a left/right keys prompt
function showLRPrompt() {
    d3.select("body")
        .append("div")
        .attr("class", "tooltips")
        .attr("id", "lrprompt")
        .style("top", "70px")
        .style("left", "50px")
        .text("Press the left and right keys to move around.");
}

// Hide the prompt
function hideLRPrompt() {
    d3.select("#lrprompt")
        .remove();
}

//Acts as a js $_GET
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//Used in projects that are embeddable, you pass it the id of the element in th ehtml the website will be gotten from if it's not embedded.
function getDataValues(ids) {
    var dataVals = {};
    
    for(var i = 0; i < ids.length; i++) {
        if (getUrlVars()['embedded'] == "true") {
            dataVals[ids[i]] = getInfoFromGoto(getUrlVars()['goto'], i);
        } else {
            dataVals[ids[i]] = document.getElementById(ids[i]).value;
        }
    }
    
    return dataVals;
}

function getInfoFromGoto(fullname, index) {
    var count = 0;
    var prev = 0;
    for(var i = 0; i < fullname.length; i++) {
        if(fullname[i] == "_") {
            if(count == index) {
                return fullname.substr(prev, i);
            }
            prev = i + 1;
            count++;
        }
    }
    return fullname.substr(prev, (fullname.length));
}

//Get cookie in javascript by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function setCookie() {
    var accessToken = $('#accesstoken').val();
    
    if (accessToken && accessToken != "") {
        document.cookie = "accessToken=" + accessToken + ";domain=.labs.majestic.com;path=/";
    } else if (getUrlVars()["embedded"] != "true") {
        deleteCookie();
    }
}

function deleteCookie() {
    if (getCookie("accessToken")) {
        document.cookie = "accessToken=;domain=.labs.majestic.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
}

// E.G "10px" -> 10
function pxStringToInt(p) {
    return parseInt(p.slice(0, p.length-2));
}

//Checks for valid json
function checkForError(json) {
	if(json.ErrorMessage !== "") {
		showError(json);
		removeLoadingScreen();
		throw new Error("Invalid API call made");
	}
	return true;
}

//displays given error
function showError(message) {
	var errorDiv = $("<div></div>");
	errorDiv.text(message);
	errorDiv.addClass("errorDiv");
	$("body").append(errorDiv);
}

//deletes any error currently being shown
function removeError() {
	var errorDiv = $(".errorDiv");
	if(errorDiv) {
		errorDiv.remove();
	}
}