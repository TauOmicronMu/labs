function Checkpoint(game, _pos, _index) {
    Sprite.call(this, game);
    this.pos = _pos;
    this.dim = roadWidth * 2;
    this.index = _index;
}

Checkpoint.prototype = new Sprite();
Checkpoint.prototype.constructor = Checkpoint;

Checkpoint.prototype.draw = function(ctx) {
//    ctx.strokeStyle = "#00F";
//    ctx.beginPath();
//    ctx.arc(this.pos.x, this.pos.y, this.dim, 0, 2*Math.PI);
//    ctx.stroke();
}