function AnchorText(_parent, _data, _name){
	this.name = _name;
	this.value = _data;
	this.parent = _parent;
    this.isTopic = false;
	
    Dataset.call(this);
    
    this.x = this.parent.x;
    this.y = this.parent.y;
    
    this.radius = this.getRadius();
}

AnchorText.prototype = new Dataset();
AnchorText.prototype.constructor = AnchorText;

AnchorText.prototype.getRadius = function() {
    return 5 * Math.sqrt(this.value);
}

AnchorText.prototype.isInParent = function() {
    var dist = Math.sqrt(
        Math.pow(this.y - this.parent.y, 2) +
        Math.pow(this.x - this.parent.x, 2)
    );
    
    return dist <= (this.parent.radius - this.radius);
}

AnchorText.prototype.getBoundedCoords = function() {
	var snapAmount = 1;
	var curX = this.x;
	var curY = this.y;
	
	var x = this.isInParent() ? curX : (curX < this.parent.x ? curX + snapAmount : curX - snapAmount);
	var y = this.isInParent() ? curY : (curY < this.parent.y ? curY + snapAmount : curY - snapAmount);
	
	this.x = x;
	this.y = y;
	
    return {x: x, y: y};
}

AnchorText.prototype.getColor = function() {
	return getColorForTopic(this.parent.name);
}

AnchorText.prototype.getAnchor = function() {
	return this.name;
}

AnchorText.prototype.getTopic = function() {
	return this.parent.name;
}

AnchorText.prototype.getValue = function() {
	return this.value;
}

AnchorText.prototype.setCoords = function(_x, _y) {
	this.x = _x;
	this.y = _y;
}