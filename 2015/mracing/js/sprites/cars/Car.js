function Car(game, _pos, _dir, p) {
    Sprite.call(this, game);
    
    this.player = p.player;
    this.name = p.name;
    this.website = p.website;
    this.data = p.data;
    this.img = p.img;
    this.iscpu = p.type;
    
    this.pos = _pos; //{ x: 50, y: 50 };
    this.dim = 5;
    
    this.dir = _dir;
	this.facingDir = this.dir;
    
    this.turningDirection = 0;
    
    this.speed = 0;
    this.speedDirection = 0;
    this.maxSpeed = 0.7 + this.data.TrustFlow / 75;
    this.minSpeed = -(this.data.TrustFlow / 100);
    this.acceleration = 0.01 + this.data.CitationFlow / 5000;
    this.handling = 0.0125 + this.data.TopicalTrustFlow_Value_0 / 4000;
    this.mass = 10; //This should change to use the API rresult.
    this.drift = 0.025;
    
    this.cpcounter = 0;
    this.lap = 0;
    
    if(this.iscpu != "cpu") {
        this.tds = document.getElementById("p" + this.player + "hud").getElementsByTagName("td");
        this.tds[0].innerHTML = "Name: " + this.name;
        this.tds[1].innerHTML = "Website: " + this.website;
        this.tds[3].innerHTML = this.player == 0 ? "Go: &#8593; , Stop: &#8595; , Left: &#8592; , Right: &#8594;" : "Go: w, Stop: s, Left: a, Right: d";

        this.hudCarImg = document.getElementById("carpic" + this.player);
        this.hudCarImg.width = 64;
        this.hudCarImg.height = 64;
        this.hudctx = this.hudCarImg.getContext("2d");
        this.hudctx.mozImageSmoothingEnabled = false;
        this.hudctx.imageSmoothingEnabled = false;
        this.hudctx.msImageSmoothingEnabled = false;
        this.hudctx.imageSmoothingEnabled = false;
        this.hudctx.scale(4, 4);

        document.getElementById("p" + this.player + "hud").parentElement.parentElement.style.display = 'block';
    }
}

Car.prototype = new Sprite();
Car.prototype.constructor = Car;

Car.prototype.draw = function(ctx) {    
    ctx.translate(this.pos.x, this.pos.y);
    
    this.drawImage(ctx);
//    this.drawDetails(ctx);
    this.drawText(ctx);
    
    ctx.translate(-this.pos.x, -this.pos.y);
}

Car.prototype.drawImage = function(ctx) {
    // Get the right image
    var curImg;
    if (this.turningDirection > 0) {
        curImg = this.img.imgCarRight;
    } else if (this.turningDirection == 0) {
        curImg = this.img.imgCar;
    } else {
        curImg = this.img.imgCarLeft;
    }
    
    // Translate for right image scales/rotation
    ctx.rotate(this.facingDir + Math.PI * 0.5);
    
    // Draw the image
    ctx.drawImage(curImg, -this.img.imgCar.width/2, -this.img.imgCar.height * 0.3);
    
    // Undo transformations
    ctx.rotate(-this.facingDir - Math.PI * 0.5);
    
    // Update hud car.
    if(this.iscpu != "cpu") {
        var antiscale = 8;
        this.hudctx.clearRect(0, 0, this.hudCarImg.width, this.hudCarImg.height);
        this.hudctx.translate(antiscale, antiscale);
        this.hudctx.rotate(this.facingDir + Math.PI * 0.5);
        this.hudctx.drawImage(curImg, -this.img.imgCar.width/2, -this.img.imgCar.height/2);
        this.hudctx.rotate(-this.facingDir - Math.PI * 0.5);
        this.hudctx.translate(-antiscale, -antiscale);   
    }
}

Car.prototype.drawText = function(ctx) {
    // Set color to be topic color
    ctx.fillStyle = "white";
    ctx.font="5px Arial";
    // Draw name
    if(this.iscpu == "cpu") {
        ctx.fillText(this.website, this.dim * 2.5, this.dim * 0.4);
    } else {
        ctx.fillText(this.name, this.dim * 2.5, this.dim * 0.4);
    }
}

Car.prototype.drawDetails = function(ctx) {
    var lineLength = this.dim * 3;
    var dirCoords = getLineOfAngle(this.dir);
    var facingCoords = getLineOfAngle(this.facingDir);
    
    ctx.strokeStyle = "#F00";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dirCoords.x * lineLength, dirCoords.y * lineLength);
    ctx.stroke();
    
    ctx.strokeStyle = "#0F0";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(facingCoords.x * lineLength, facingCoords.y * lineLength);
    ctx.stroke();
    
    ctx.strokeStyle = "#00F";
    ctx.beginPath();
    ctx.arc(0, 0, this.dim, 0, 2*Math.PI);
    ctx.stroke();
}

Car.prototype.update = function(alpha) {
    if(canDrive) {
        this.updateDirections(alpha);
    
        this.changeSpeed(this.speedDirection, alpha);
        this.changeDirection(this.turningDirection, alpha);
        this.handleDrift(alpha);

        this.move(alpha, 1);

    }
        
	if (this.lap < game.raceLength && this.iscpu != "cpu")
		this.tds[2].innerHTML = "Lap: " + (this.lap + 1) + " / " + game.raceLength;
        
}

Car.prototype.handleDrift = function(alpha) {
    var driftFactor = Math.abs(Math.min(this.maxSpeed * this.drift / this.speed, 1));
	
	this.dir = putAngleInRange(
        this.dir +
        (driftFactor * getAngDiff(this.facingDir, this.dir) * alpha)
    );
}

Car.prototype.updateDirections = function(alpha) {}

Car.prototype.colWithCar = function(c, alpha) {
	this.move(alpha,-1);
//	c.move(alpha, -1);
	
	var angle = c.dir;
	var speed = c.speed;
	
	c.dir = this.dir;
	c.speed = this.speed;
	
	this.speed = speed;
	this.dir = angle;
	
//    var speedRatio = (this.speed * this.mass) / (c.speed * c.mass) % 1;
//    
//    this.move(alpha, -1);
//
//    if(isNaN(speedRatio)) {
//        this.speed *= -1;
//    } else {
//        var newDir = (this.dir + (c.dir * speedRatio))%(2 * Math.PI);
//        var newSpeed = this.speed * speedRatio;
//
//        this.dir = newDir;
//        this.speed = newSpeed;
//    }
}

Car.prototype.colWithBarrier = function(b, alpha) {
    this.move(alpha, -1);
    
    var targetDir = b.getCarDir(this);

    var angDiff = getAngDiff(targetDir, this.facingDir);
    
    // Don't move to the barriers angle if it's a direct hit
    if (Math.abs(angDiff) < Math.PI * 0.38 ) {
        this.facingDir += 0.03 * angDiff * alpha;
        this.facingDir = putAngleInRange(this.facingDir);
        
        this.speed = this.speed * 0.97;
        this.dir = targetDir;
        this.move(alpha, 1);
    } else {
        this.speed *= -0.3;
    }
}

Car.prototype.colWithCheckpoint = function(c, alpha) {
    if(c.index == (this.cpcounter + 1)) {
        this.cpcounter ++;
        if(this.game.coursePoints.length - 1 == this.cpcounter) {
            this.lap ++;
            this.cpcounter = 0;
        }
        
    }
}

Car.prototype.colWithBoost = function(b, alpha) {
    this.speed *= 1.02;
}

Car.prototype.move = function(alpha, dir) {
    var dCoords = getLineOfAngle(this.dir);
    
    this.pos.x += dCoords.x * this.speed * dir * alpha;
    this.pos.y += dCoords.y * this.speed * dir * alpha;
}

Car.prototype.changeDirection = function(n, alpha) {
    this.facingDir += n * this.handling * (this.speed / this.maxSpeed) * alpha;
    
    if (this.facingDir > 2 * Math.PI) {
        this.facingDir -= 2 * Math.PI;
    }
    
    if (this.facingDir < 0) {
        this.facingDir += 2 * Math.PI;
    }
}

Car.prototype.changeSpeed = function(n, alpha) {
    if (n > 0) {
        this.speed += ((this.maxSpeed - this.speed) * this.acceleration) * alpha;
    } else if (n == 0) {
        this.speed -= ((this.speed) / 100) * alpha;
        
        if (this.speed < 0.1)
            this.speed = 0;
    } else {
        this.speed += ((this.minSpeed - this.speed) * this.acceleration) * alpha;
    }
}
