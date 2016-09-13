function Boost(game, _pos, _dir) {
    Sprite.call(this, game);
    
    this.pos = _pos;
    this.dir = (_dir + Math.PI / 2);
    this.dim = 20;
}

Boost.prototype = Object.create(Sprite.prototype);
Boost.prototype.constructor = Boost;

Boost.prototype.draw = function(ctx) {
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.dir);
    
    ctx.drawImage(imgBoost, -imgBoost.width / 2, -imgBoost.height / 2);
    
    ctx.rotate(-this.dir);
    ctx.translate(-this.pos.x, -this.pos.y);
}