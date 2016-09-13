function CompanyEvent(_singleEvents) {
    Dataset.call(this);
    
    this.singleEvents = _singleEvents;
    
    this.isNew = this.singleEvents[0].isNew;
    this.date = this.singleEvents[0].date;
    this.company = this.singleEvents[0].getDomain();
}

// Extend Dataset
CompanyEvent.prototype = new Dataset();
CompanyEvent.prototype.constructor = CompanyEvent;

// The size is the amount of children, as all their sizes are 0
CompanyEvent.prototype.getSize = function() {
    return this.singleEvents.length;
};

// Remove self and add children
CompanyEvent.prototype.onClick = function() {
    this.removeSelf();
    
    for (var i=0; i<this.singleEvents.length; i++) {
        // Set up coords so no NaN errors
        this.singleEvents[i].setupWithElement(this);
        
        // Add to list
        nodes.push(this.singleEvents[i]);
    }
    
    graph.update();
};

CompanyEvent.prototype.onMouseOver = function() {
    var myDate = this.date;
    graph.shouldHighlight = function(d) {
        return (myDate == d.date);
    }
};

CompanyEvent.prototype.getText = function() {
    return trimText(this.hasText() ? this.company.split(".")[0] : "", 8);
};

CompanyEvent.prototype.getGravPoint = function() {
    if (!this.grav)
        return DateEvent.prototype.getGravPoint.call(this);
    
    return this.grav;
};

CompanyEvent.prototype.setupWithElement = function(elem) {
    this.x = (Math.random()-0.5) * elem.getRadius() + elem.x;
    this.y = (Math.random()-0.5) * elem.getRadius() + elem.y;
    this.px = this.x;
    this.py = this.y;
    
    this.grav = elem.getGravPoint();
};

CompanyEvent.prototype.getDateGroupKey = function() {
    return this.date + "-" + this.isNew;
};

CompanyEvent.prototype.hasText = function() {
    return (this.getRadius() > 10);
}

CompanyEvent.prototype.getTooltip = function() {
    tooltip.setupTooltipElems(["Company", "Date", "Links " + (this.isNew ? "gained" : "lost")]);
    return [this.company, this.getDateString(), this.getSize()];
}
