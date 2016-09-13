function Terrain(game, _points, _fillStyle) {
    Sprite.call(this, game);
    
    this.points = _points;
    this.fillStyle = _fillStyle;
}

Terrain.prototype = new Sprite();
Terrain.prototype.constructor = Terrain;

Terrain.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fillStyle;
    
    ctx.beginPath();
    
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (var i=1; i<this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.lineTo(this.points[0].x, this.points[0].y);
    
    ctx.fill();
}