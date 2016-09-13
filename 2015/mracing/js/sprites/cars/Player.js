function Player(game, pos, dir, p) {
    Car.call(this, game, pos, dir, p);
    
    this.controls = p.controls;
}

// For some reason "Object.create" works here, but not "= new Car();"
Player.prototype = Object.create(Car.prototype);
Player.prototype.constructor = Player;

Player.prototype.updateDirections = function(alpha) {
    this.speedDirection = (this.controls.up ? 1 : 0) - (this.controls.down ? 1 : 0);
    this.turningDirection = (this.controls.right ? 1 : 0) - (this.controls.left ? 1 : 0);
}

Player.prototype.drawText = function(ctx) {
    Car.prototype.drawText.call(this, ctx);
}
