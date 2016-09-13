var dataCount=0;

function DataSet() {
	this.setID();
	this.setupOrbitAngle();
}

DataSet.prototype.setID = function() {
	this.id=dataCount;
	dataCount++;
	this.px = 0;
	this.py = 0;
}

DataSet.prototype.setupOrbitAngle = function(){
	this.orbitAngle = 2*Math.PI*Math.random();
}

DataSet.prototype.click = function() {

}

DataSet.prototype.getOrbitRadius = function() {
	
}

DataSet.prototype.setOrbitPosition = function(){
	var angle = this.orbitAngle;
	var rad = this.getOrbitRadius();
	var dy = rad*Math.cos(angle);
	var dx = rad*Math.sin(angle);
	this.x=dx;
	this.y=dy;
}

DataSet.prototype.setCurrentOrbitPosition = function(alpha) {
	var speed = .1;
	var deltaX = this.x;
	var deltaY = this.y;
	var currentRadius = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	var targetRadius = this.getOrbitRadius();
	var radius = (currentRadius*2+targetRadius)/3;
	var arctan = Math.atan(deltaY/deltaX);

	if (deltaX>=0) {
		var theta = arctan;
	} else {
		var theta = Math.PI + arctan;
	}

	var newTheta;

	newTheta = theta + alpha*speed/radius;

	var dx = (Math.cos(newTheta))*radius;
	var dy = (Math.sin(newTheta))*radius;

	this.x = dx;
	this.y = dy;
}

DataSet.prototype.getRadius = function() {
	return 10;
}

DataSet.prototype.getColor = function() {
	return "#000000";
}

DataSet.prototype.mouseOver = function() { }

DataSet.prototype.mouseOut = function() { }

DataSet.prototype.getX = function(){
	return this.x;
}

DataSet.prototype.getY = function(){
	return this.y;
}

DataSet.prototype.getBorderColor = function() {
	return lighten(this.getColor,-0.6);
}