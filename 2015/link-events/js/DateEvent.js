function DateEvent(_companyEvents) {
    Dataset.call(this);
    
    this.companyEvents = _companyEvents;
    
    this.isNew = this.companyEvents[0].isNew;
    this.date = this.companyEvents[0].date;
}

// Extend Dataset
DateEvent.prototype = new Dataset();
DateEvent.prototype.constructor = DateEvent;

// Remove self and add children
DateEvent.prototype.onClick = function() {
    // Reset the breakdowns
    groupBackTogether();
    
    this.removeSelf();
    
    for (var i=0; i<this.companyEvents.length; i++) {
        // Set up coords so no NaN errors
        this.companyEvents[i].setupWithElement(this);
        
        // Add to list
        nodes.push(this.companyEvents[i]);
    }
    
    graph.update();
};

DateEvent.prototype.onMouseOver = function() {
    var myDate = this.date;
    graph.shouldHighlight = function(d) {
        return (myDate == d.date);
    }
};

DateEvent.prototype.getText = function() {
    return this.getDateString();
};

DateEvent.prototype.getSize = function() {
    var size = 0;
    
    for (var i=0; i<this.companyEvents.length; i++) {
        size += this.companyEvents[i].getSize();
    }
    
    return size;
};

DateEvent.prototype.getTooltip = function() {
    tooltip.setupTooltipElems(["Date", "Links " + (this.isNew ? "gained" : "lost")]);
    return [this.getDateString(), this.getSize()];
}
