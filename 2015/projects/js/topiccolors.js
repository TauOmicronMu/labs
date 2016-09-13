// Store colours for topics
var topicColors = {
    "Arts": '#ff6700',
    "News": '#76d54b',
    "Society": '#7a69cd',
    "Computers": '#f33',
    "Business": '#c5c88e',
    "Regional": '#f582b9',
    "Recreation": '#89c7cb',
    "Sports": '#55355d',
    "Kids": '#fc0',
    "Reference": '#c84770',
    "Games": '#557832',
    "Home": '#d95',
    "Shopping": '#600',
    "Health": '#009',
    "Science": '#6bd39a',
    "Adult": '#333',
    "World": '#577'
};

// Can pass in whole topic
function getColorForTopic(topic) {
    return topicColors[getSuperTopic(topic)];
}

//Lightens the color given hexcode
function lighten(color,lum){
	//Expand hex code to full length
	color = String(color).replace(/[^0-9a-f]/gi, '');
	if (color.length < 6) {
		color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
	}
	
	lum = lum || 0;

	// convert to decimal and change luminosity
	var newColor = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(color.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		newColor += ("00"+c).substr(c.length);
	}
	
	return newColor;
}

// Get the text color
function getTextColorForTopic(topic) {
    if ($.inArray(getSuperTopic(topic), [
        "Regional",
        "Reference",
        "Society",
        "Computers",
        "Arts",
        "Health",
        "Shopping",
        "Sports",
        "Adult",
		"Games"]) > -1) {
        return "#FFF";
    } else {
        return "#333";
    }
}
