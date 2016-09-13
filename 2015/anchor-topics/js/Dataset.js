function Dataset() {
    
}

Dataset.prototype.getX = function() {
    return this.x;
}

Dataset.prototype.getY = function() {
    return this.y;
}

Dataset.prototype.getBorderColor = function() {
	return lighten(this.getColor(),-0.2);
}