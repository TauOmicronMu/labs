var dataCount = 0;

function Dataset() {
    this.setID();
}

Dataset.prototype.setID = function() {
    this.id = dataCount;
    dataCount ++;
};

Dataset.prototype.getText = function() {
    return this.getSize();
};

Dataset.prototype.getDateString = function() {
    var dateObj = new Date(this.date);
    return dateObj.getDate() + getThs(dateObj.getDate()) + " " + months[dateObj.getMonth()] + " " + dateObj.getFullYear();
};

Dataset.prototype.getSize = function() {
    return 0;
};

Dataset.prototype.getRadius = function() {
    return Math.sqrt(mmSize.getScaledValue(this.getSize())) * (width+height)/20;
};

Dataset.prototype.getColor = function() {
    return graph.shouldHighlight(this) ? 
        (this.isNew ? "#77DD77" : "#FF6961") :
        (this.isNew ? "#478547" : "#B24A44") ;
};

Dataset.prototype.onMouseOver = function() { };
 
Dataset.prototype.onMouseOut = function() {
    graph.shouldHighlight = function(d) {
        return true;
    }
};

Dataset.prototype.onClick = function() { };

Dataset.prototype.getGravPoint = function() {
    return {
        x: graphWidth * mmDates.getScaledValue(this.date), 
        y: this.y
    };
};

Dataset.prototype.removeSelf = function() {
    var thisIndex = nodes.indexOf(this);
    
    if (thisIndex != -1)
        nodes.splice(thisIndex, 1);
    
    graph.update();
};

Dataset.prototype.setupWithElement = function(elem) {
    this.x = elem.x;
    this.y = elem.y;
    this.px = this.x;
    this.py = this.y;
};

Dataset.prototype.getTooltip = function() {
    tooltip.setupTooltipElems(["Default"]);
    return ["123"];
}
