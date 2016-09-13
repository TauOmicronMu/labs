function Barrier(game, _pos1, _pos2) {
    Sprite.call(this, game);
    
    this.pos1 = _pos1;
    this.pos2 = _pos2;
}

Barrier.prototype = new Sprite();
Barrier.prototype.constructor = Barrier;

Barrier.prototype.draw = function(ctx) {
    ctx.strokeStyle = "#000";
    
    ctx.beginPath();
    ctx.moveTo(this.pos1.x, this.pos1.y);
    ctx.lineTo(this.pos2.x, this.pos2.y);
    ctx.stroke();
}

Barrier.prototype.getCarDir = function(c) {
	var deltaX = this.pos2.x-this.pos1.x;
	var deltaY = this.pos2.y-this.pos1.y;
	
	var a1 = getCompleteAngle(this.pos1, this.pos2);
	
	var a2 = (a1+Math.PI)%(2*Math.PI);
	
	var angleDif1 = Math.abs(getAngDiff(a1,c.dir));
	var angleDif2 = Math.abs(getAngDiff(a2,c.dir));
	
    if (angleDif1<=angleDif2) {
        return a1;
    } else {
        return a2;
    }
}
