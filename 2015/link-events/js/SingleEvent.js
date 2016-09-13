function SingleEvent(_json, _isNew) {
    Dataset.call(this);
    
    this.json = _json;
    
    this.isNew = _isNew;
    this.url = this.json.SourceURL;
    this.date = Date.parse(this.json.Date);
    
    this.grav = { x: 0, y: 0 };
}

// Extend Dataset
SingleEvent.prototype = new Dataset();
SingleEvent.prototype.constructor = SingleEvent;

SingleEvent.prototype.getSize = function() {
    return 1;
};

SingleEvent.prototype.getDomain = function() {
    var domainTools = new DomainTools();
    domainTools.setup(this.url);
    
    return domainTools.getShortDomain();
};

SingleEvent.prototype.onClick = function() {
    window.open(this.url, "_blank");
};

SingleEvent.prototype.onMouseOver = function() {
    var myDomain = this.getDomain();
    var myDate = this.date;
    graph.shouldHighlight = function(d) {
        return (myDate == d.date && (!d.getDomain || myDomain == d.getDomain()));
    }
};

SingleEvent.prototype.getText = function() {
    return this.getDomain().toUpperCase()[0];
};

SingleEvent.prototype.setupWithElement = function(elem) {
    this.x = (Math.random()-0.5) * elem.getRadius() + elem.x;
    this.y = (Math.random()-0.5) * elem.getRadius() + elem.y;
    this.px = this.x;
    this.py = this.y;
    
    this.grav = elem.getGravPoint();
};

SingleEvent.prototype.getGravPoint = function() {
    return this.grav;
};

SingleEvent.prototype.getCompanyGroupKey = function() {
    return this.getDomain() + "-" + this.date + "-" + this.isNew;
};

SingleEvent.prototype.getDateGroupKey = function() {
    return this.date + "-" + this.isNew;
};

SingleEvent.prototype.getTooltip = function() {
    tooltip.setupTooltipElems(["Link", "Date", "Links " + (this.isNew ? "gained" : "lost")]);
    return [this.url, this.getDateString(), this.getSize()];
}