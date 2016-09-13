function Sprite(_game) {
    this.game = _game;
}

Sprite.prototype.draw = function(ctx) {}

Sprite.prototype.update = function(alpha) {}

Sprite.prototype.colWith = function(s, alpha) {
    if (s instanceof Car && this.colWithCar) {
        this.colWithCar(s, alpha);
    } else if (s instanceof Barrier && this.colWithBarrier) {
        this.colWithBarrier(s, alpha);
    } else if (s instanceof Checkpoint && this.colWithCheckpoint) {
        this.colWithCheckpoint(s, alpha);
    } else if (s instanceof Boost && this.colWithBoost) {
        this.colWithBoost(s, alpha);
    }
}
