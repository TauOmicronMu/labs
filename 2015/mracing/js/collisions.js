var collisions = new (function Collisions() {
    this.checkSpritesCollision = function(sprites, alpha) {
        for (var i=0; i<sprites.length; i++) {
            for (var j=(i + 1); j<sprites.length; j++) {
                handleSprites(sprites[i], sprites[j], alpha);
            }
        }
    }
    
    function handleSprites(s1, s2, alpha) {        
        // Cars and cars
        if (s1 instanceof Car && s2 instanceof Car) {
            if (colCircleWithCircle(s1, s2)) {
				//ONLY 1 COLLISION REGISTERS
        		s1.colWith(s2, alpha);
            }
        // Cars and barriers
        } else if (s1 instanceof Car && s2 instanceof Barrier) {
            if (colCircleWithLine(s1, s2)) {
                doCollide(s1, s2, alpha);
            }
        } else if (s1 instanceof Barrier && s2 instanceof Car) {
            if (colCircleWithLine(s2, s1)) {
                doCollide(s1, s2, alpha);
            }
        // Cars and checkpoints
        } else if (s1 instanceof Car && s2 instanceof Checkpoint) {
            if (colCircleWithCircle(s1, s2)) {
                doCollide(s1, s2, alpha);
            }
        } else if (s2 instanceof Car && s1 instanceof Checkpoint) {
            if (colCircleWithCircle(s2, s1)) {
                doCollide(s1, s2, alpha);
            }
        } else if (s1 instanceof Car && s2 instanceof Boost) {
            if (colCircleWithCircle(s1, s2)) {
                doCollide(s1, s2, alpha);
            }
        } else if (s2 instanceof Car && s1 instanceof Boost) {
            if (colCircleWithCircle(s2, s1)) {
                doCollide(s1, s2, alpha);
            }
        }
    }
    
    function doCollide(s1, s2, alpha) {
        s1.colWith(s2, alpha);
        s2.colWith(s1, alpha);
    }

    function colCircleWithLine(c, l) {
        var topLeft = {
            x: Math.min(l.pos1.x, l.pos2.x) - c.dim,
            y: Math.min(l.pos1.y, l.pos2.y) - c.dim
        };
        
        var bottomRight = {
            x: Math.max(l.pos1.x, l.pos2.x) + c.dim,
            y: Math.max(l.pos1.y, l.pos2.y) + c.dim
        };
        
        // Check if it's in the bounding box
        if (c.pos.x < topLeft.x || c.pos.y < topLeft.y || 
            c.pos.x > bottomRight.x || c.pos.y > bottomRight.y)
            return false;
        
        var acDist = getPointDistance(c.pos, l.pos1);
        var abAng = getAngleOfLine(l.pos1, l.pos2);
        var acAng = getAngleOfLine(l.pos1, c.pos);
        var bacAng = abAng - acAng;
        var cdDist = Math.abs(acDist * Math.sin(bacAng));
        
        return cdDist < c.dim;
    }
    
    function colCircleWithCircle(c1, c2) {
        return getPointDistance(c1.pos, c2.pos) < (c1.dim + c2.dim);
    }
})();