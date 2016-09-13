function Game(players, _coursePoints, _raceLength) {
    this.coursePoints = _coursePoints;
    this.scale = 0.01;
    this.transX = 0;
    this.transY = 0;
    this.sprites = [];
    this.raceLength = _raceLength;
    this.raceWinner;
    
    this.initGrass();
    
    var terrain = buildCourse(this, this.coursePoints);
    
    for (var i=0; i<terrain.length; i++) {
        this.sprites.push(terrain[i]);
    }
    
    var startingAngle = getCompleteAngle(this.coursePoints[0], this.coursePoints[1]);
    startingAngle = putAngleInRange(startingAngle);
    
    for (var i=1; i<this.coursePoints.length - 1; i++) {
        if((i + 1) !== this.coursePoints.length) {
            var length = getPointDistance(this.coursePoints[i], this.coursePoints[i + 1]);
            if(length > 400) {
                var angle = getCompleteAngle(this.coursePoints[i], this.coursePoints[(i + 1) % this.coursePoints.length]);
                this.sprites.push(new Boost(
                    this,
                    this.getPointOnLine(this.coursePoints[i], angle, length),
                    angle));   
            }
        }
    }
    
    for(var i = 0; i < players.length; i++) {
        var displaceBy = - 23 + (15 * (i % 4));
        
        var startingPoint = incrPointByAng(
            this.coursePoints[0],
            startingAngle,
            - Math.floor(i / 4) * 20
        );
        
        var curPoint = incrPointByAng(
            startingPoint,
            putAngleInRange(startingAngle + (Math.PI / 2)),
            (((((i%4) / 4) * 2) - 1) * roadWidth) + roadWidth / 4
        );
        
        if(players[i].type == "player") {
            this.sprites.push(new Player(
            this,
            curPoint,
            startingAngle,
            players[i]));
        } else {
            this.sprites.push(new Enemy(
            this,
            curPoint,
            startingAngle,
            players[i]));
        }
    }
}

Game.prototype.tick = function(ctx, alpha) {
    ctx.fillStyle = "#000";
    ctx.fillRect( 0, 0, c.width, c.height);

    this.focusOnPlayers(ctx, alpha);
    
    for (var i = 0; i < this.sprites.length; i++) {
        var s = this.sprites[i];
        
        s.update(alpha);
        s.draw(ctx);
        
        if (s instanceof Car && !raceFinished && s.lap == this.raceLength) {
            //Winning code here.
            this.raceWinner = s;
            raceFinished = true;
            document.getElementById("winnerbox").style.display = 'block';
            var txt = document.getElementById("congratsbox");
            txt.innerHTML = "Congratulations " + s.name + " using " + s.website + "!";
            document.getElementById("pausebutton").style.display = 'none';
        }
    }
    
    collisions.checkSpritesCollision(this.sprites, alpha);
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

Game.prototype.focusOnPlayers = function(ctx, alpha) {
    var transSpeed = 0.04;
    var scaleSpeed = 0.1;
    
    // Get all players
    var playersForCamera = [];
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof Player) {
            playersForCamera.push(this.sprites[i]);
        }
    }
    
    // Calculate average coords
    var desX = 0.0, desY = 0.0;
    playersForCamera.forEach(function(s) {
        desX += s.pos.x;
        desY += s.pos.y;
    });
    desX /= playersForCamera.length;
    desY /= playersForCamera.length;
    
    // Calcualate largest distance
    var maxDist = 0;
    playersForCamera.forEach(function(p) {
        var dist = Math.sqrt(
            Math.pow(desX - p.pos.x, 2) +
            Math.pow(desY - p.pos.y, 2)
        );

        if (dist > maxDist)
            maxDist = dist;
    });
    
    // Set the scale to accommodate the max dist
    var desScale = Math.min(4, 200/Math.pow(maxDist, 0.95));
    
    // Winning code here.
    if (raceFinished && !beforeStart) {
        desX = this.raceWinner.pos.x;
        desY = this.raceWinner.pos.y - (window.innerHeight / 5);
        desScale = 2;   
    }
    
    var dX = desX - this.transX;
    var dY = desY - this.transY;
    var dScale = desScale - this.scale;
    
    this.transX += dX * transSpeed * alpha;
    this.transY += dY * transSpeed * alpha;
    this.scale += dScale * scaleSpeed * alpha;
    
    // Transform the camera to focus
    ctx.translate(
        (-this.transX * this.scale + (window.innerWidth / 2)),
        (-this.transY * this.scale + (window.innerHeight / 2)));
    ctx.scale(this.scale, this.scale);
}

Game.prototype.initGrass = function() {
    var grassPat=ctx.createPattern(imgGrass, "repeat");
    
    var grass = new Terrain(
        this,
        [
            { x: -1000, y: -1000 },
            { x: -1000, y: +3000 },
            { x: +3000, y: +3000 },
            { x: +3000, y: -1000 }
        ],
        grassPat
    );

    this.sprites.unshift(grass);
}

Game.prototype.getPointOnLine = function(point, angle, length){
    var distAlongLine = 0.25;
    var distFromP = length * 0.25;
    var deltaX = getComponent(distFromP, angle, Math.cos);
    var deltaY = getComponent(distFromP, angle, Math.sin);
    
    return {x: (point.x + deltaX), y: (point.y + deltaY)};    
}