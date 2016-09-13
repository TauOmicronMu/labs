//Basic attributes not yet defined

function Moon(parent,i){
	DataSet.call(this);
	this.isTopic = true;
	this.parentDomain = parent;
	this.topic = parent.moreInfo["TopicalTrustFlow_Topic_"+i];
	this.value = parent.moreInfo["TopicalTrustFlow_Value_"+i];
}

Moon.prototype = new DataSet();
Moon.prototype.constructor = Moon;

Moon.prototype.getOrbitRadius = function(){
	if (!this.randRadius)
		this.randRadius = Math.random();

	var ret = ((Math.sqrt(this.parentDomain.RefIPs / Math.PI)) *  0.05) * (2 + (this.randRadius * 5));
	return ret;
}

Moon.prototype.getColor = function(){
	return getColorForTopic(this.topic);
}

Moon.prototype.getRadius = function(){
	return Math.sqrt(this.parentDomain.RefIPs) * this.value * 0.0001;
}

Moon.prototype.getX = function(){
	return this.x + this.parentDomain.getX();
}

Moon.prototype.getY = function(){
	return this.y + this.parentDomain.getY();
}