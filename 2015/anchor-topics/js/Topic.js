function Topic(data,name,nodes){
	this.name = name;
	this.children = [];
    this.isTopic = true;
    
	for(var j in data){
		if($.inArray(j, dict)<0){
			var anchorWord = data[j];
			var anchorNode = new AnchorText(this,anchorWord,j);
			this.children.push(anchorNode);
		}
	}
    
	this.children.sort(function(a,b){return b.value-a.value});
	this.children = this.children.splice(0,10);
	
    Dataset.call(this);
    
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
	this.childrenValue = this.getTotalChildrenVal();
    this.radius = this.getRadius();
}

Topic.prototype = new Dataset();
Topic.prototype.constructor = Topic;

Topic.prototype.getTotalChildrenVal = function() {
    var totalVal = 0;
    
    for(var i = 0; i < this.children.length; i++) {
        totalVal += this.children[i].value;
    }
    
    return totalVal;
}

Topic.prototype.getRadius = function() {
    return 7 * Math.sqrt(this.childrenValue);
}

Topic.prototype.setStartCoords = function(_x, _y) {
    this.x = _x;
    this.y = _y;
	
	for(var i = 0; i < this.children.length; i++) {
		this.children[i].setCoords(_x, _y);
	}
}

Topic.prototype.isCollidingWithTopic = function(topic) {
    if(topic.isTopic) {
        var dist = Math.sqrt(
            Math.pow(this.y - this.topic.y, 2) +
            Math.pow(this.x - this.topic.x, 2)
        );
        
        return dist <= (this.radius + topic.radius);
    } else {
        return false;
    }
}

Topic.prototype.isOffScreenX = function() {
    var xMax = this.x + this.radius;
    var xMin = this.x - this.radius;
    
    return (xMax > window.innerWidth) || (xMin < 0);
}

Topic.prototype.isOffScreenY = function() {
    var yMax = this.y + this.radius;
    var yMin = this.y - this.radius;
    
    return (yMax > window.innerHeight) || (yMin < 0);
}

Topic.prototype.getBoundedCoords = function() {
    var curX = this.x;
    var curY = this.y;
    var xOff = this.isOffScreenX();
    var yOff = this.isOffScreenY();
    var x = !xOff ? curX : (curX - this.radius < 0 ? curX + 1 : curX - 1);
    var y = !yOff ? curY : (curY - this.radius < 0 ? curY + 1 : curY - 1);
	
	this.x = x;
	this.y = y;
	
    return {x: x, y: y};
}

Topic.prototype.getColor = function() {
	return lighten(getColorForTopic(this.name),0.6);
}

Topic.prototype.getAnchor = function() {
	return "-";
}

Topic.prototype.getTopic = function() {
	return this.name;
}

Topic.prototype.getValue = function() {
	return this.childrenValue;
}
