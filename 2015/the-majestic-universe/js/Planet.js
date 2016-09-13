//TLD not yet defined

function Planet(json){
	DataSet.call(this);
	this.isTopic=false;
	this.Domain = json.Domain ? json.Domain : json.Item;
	this.RefIPs = json.RefIPs;
	this.RefSubNets = json.RefSubNets;
	var domainSplit = this.Domain.split(".");
    this.TLD = domainSplit[domainSplit.length - 1];
	this.setOrbitPosition();
	this.px=this.x;
	this.py=this.y;
}

Planet.prototype = new DataSet();
Planet.prototype.constructor = Planet;

Planet.prototype.getOrbitRadius = function(){
	var radius = Math.sqrt(1/this.RefIPs) * 300000;

	var cap = 2500;
	if (radius > cap) radius = cap;

	return (-Math.atan(this.RefIPs * 14 / 2704894 + 1.3) + 1.5) * 1800 + 100;
}

Planet.prototype.getColor = function(){
    return graph.color(this.TLD);
}

Planet.prototype.mouseOver = function(){
	tooltip.mouseoverTooltip(this);
	this.hasMouse = true;
}

Planet.prototype.mouseOut = function(){
	tooltip.mouseoutTooltip(this);
	this.hasMouse = false;
}

Planet.prototype.click = function(){
	graph.collapseNode();
	graph.focusOnData(this)
}

Planet.prototype.getRadius = function(){
	var rad = Math.sqrt(this.RefIPs/Math.PI);
	return 0.05*rad;
}

Planet.prototype.orbitLocation = function(alpha){
	return function(d){
		this.setCurrentOrbitPosition({x:width/2,y:height/2},alpha);
	}
}

Planet.prototype.getX = function(){
	return this.x;
}

Planet.prototype.getY = function(){
	return this.y;
}
