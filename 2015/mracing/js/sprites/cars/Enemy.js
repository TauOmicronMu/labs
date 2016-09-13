function Enemy(game, pos, dir, p) {
    Car.call(this, game, pos, dir, p);
    
    this.target = {
        x: 0,
        y: 0
    };
    
//    this.maxSpeed = 1;
    this.grip = 100;
//    this.handling = 0.8;
    
    this.lastCollisionResult = 0;
    
    this.speedDirection = 1;
    this.isFacingWrongWay = false;
    this.timeStartedHitReverse = 0;
    this.nextCP = 0;
    
    this.colRayLength = this.dim * 2;
    this.colRayDist = this.dim * 0.9;
}

// For some reason "Object.create" works here, but not "= new Car();"
Enemy.prototype = Object.create(Car.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.drawDetails = function(ctx) {
    Car.prototype.drawDetails.call(this, ctx);
    
    ctx.strokeStyle = "#F00";
    
    var rStart = incrPointByAng(this.pos, this.dir + (Math.PI/2), this.colRayDist);
    var lStart = incrPointByAng(this.pos, this.dir + (Math.PI/2), -this.colRayDist);
    var rEnd = incrPointByAng(rStart, this.dir, this.colRayLength);
    var lEnd = incrPointByAng(lStart, this.dir, this.colRayLength);
    
    ctx.beginPath();
    ctx.moveTo(rStart.x, rStart.y);
    ctx.lineTo(rEnd.x, rEnd.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(lStart.x, lStart.y);
    ctx.lineTo(lEnd.x, lEnd.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(this.target.x, this.target.y);
    ctx.stroke();
    
    Car.prototype.draw.call(this, ctx);
}

Enemy.prototype.updateDirections = function(alpha) {
    if (new Date().getTime() - this.timeStartedHitReverse < 1000) {
        return;
    }
        
    this.turningDirection = this.getDirectionForTarget();
    
    if (this.isFacingWrongWay) {
        this.turningDirection = -1;
    } else {
        var avoidingDirection = this.getDirectionForAvoiding();
        
        if (avoidingDirection != 0) {
//            console.log("Avoiding something " + avoidingDirection);
            this.timeStartedHitReverse = new Date().getTime();
            this.speedDirection = -1;
            this.turningDirection = -avoidingDirection;
        } else {
            this.speedDirection = 1;
        }
    }
}

Enemy.prototype.getDirectionForTarget = function() {
    var dx = this.target.x - this.pos.x;
    var dy = this.target.y - this.pos.y;
    
	var angToTarget = Math.atan(dy / dx);
    
    if (dx < 0) {
        angToTarget += Math.PI;
	}
    
    var angDif = getAngDiff(this.dir, angToTarget);
    
    this.isFacingWrongWay = false; //Math.abs(angDif) > 1.3 * Math.PI / 2;
    
    if (this.isFacingWrongWay && this.speedDirection >= 0) {
//        console.log("Reversing");
        this.speedDirection = -1;
    } else if (!this.isFacingWrongWay && this.speedDirection < 0) {
//        console.log("Stopping reversing");
        this.speedDirection *= -1;
    }
    
    if (Math.abs(angDif) < 0.05){
        return 0;
    } else if (angDif > 0) {
        return -1;
    } else {
        return 1;
    }
}

Enemy.prototype.getDirectionForAvoiding = function() {
    if (Math.abs(getAngDiff(this.dir, this.facingDir)) > Math.PI * 0.2) {
        return 0;
    }
    
    var rStart = incrPointByAng(this.pos, this.dir + (Math.PI/2), this.colRayDist);
    var lStart = incrPointByAng(this.pos, this.dir + (Math.PI/2), -(this.colRayDist));
    var rEnd = incrPointByAng(rStart, this.dir, this.colRayLength);
    var lEnd = incrPointByAng(lStart, this.dir, this.colRayLength);
    
    var lCols = this.checkLineCollides(lStart, lEnd);
    var rCols = this.checkLineCollides(rStart, rEnd);
    
    if (lCols && rCols) {
        return this.lastCollisionResult;
    } else if (lCols) {
        this.lastCollisionResult = 1;
        return 1;
    } else if (rCols) {
        this.lastCollisionResult = -1;
        return -11;
    } else {
        return 0;
    }
}

Enemy.prototype.checkLineCollides = function(start, end) {
    for (var i=0; i<this.game.sprites.length; i++) {
        var curSprite = this.game.sprites[i];
        
        if (curSprite instanceof Barrier) {
            var colResults =
                checkLineIntersection(
                    start.x, start.y, end.x, end.y,
                    curSprite.pos1.x, curSprite.pos1.y, curSprite.pos2.x, curSprite.pos2.y
                );
            
            if (colResults.onLine1 && colResults.onLine2) {
                return true;
            }
        }
    }
    
    return false;
}

Enemy.prototype.colWithCheckpoint = function (c, alpha) {
    if(c.index == (this.cpcounter + 1)) {
        this.cpcounter ++;
        if(this.game.coursePoints.length - 1 == this.cpcounter) {
            this.lap ++;
            this.cpcounter = 0;
        }
    }
    
    // Find the next checkpoint
    for (var i=0; i<this.game.sprites.length; i++) {
        var curSprite = this.game.sprites[i];

        if (curSprite instanceof Checkpoint && 
            curSprite.index == (this.cpcounter + 1) &&
            curSprite != this.nextCP) {
            
            this.nextCP = curSprite;
            
//            console.log(this.cpcounter);
            
            // Get a random point in it
            this.target = {
                x: this.nextCP.pos.x + (this.nextCP.dim * ((Math.random() * 0.5) - 0.5)),
                y: this.nextCP.pos.y + (this.nextCP.dim * ((Math.random() * 0.5) - 0.5))
            };

//            console.log("Got next target")

            break;
        }
    }
    
//    this.target = game.coursePoints[this.cpcounter + 1];
}
