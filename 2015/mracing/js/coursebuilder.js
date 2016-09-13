var roadWidth = 45;

function buildCourse(game, points) {
    var sprites = [];
    
    // Init points
    var pointPairs = getPointPairs(points);
    pointPairs = combinePairs(pointPairs);
    
    // Put in road texture
    var roadPat = ctx.createPattern(imgRoad, "repeat");
    sprites.push(new Terrain(game, createRoadPoints(pointPairs), roadPat));
    
    // Add in missing chunk of road
    sprites.push(new Terrain(game, [
            pointPairs[0][0],
            pointPairs[1][0],
            pointPairs[1][pointPairs[1].length-1],
            pointPairs[0][pointPairs[0].length-1],
        ], roadPat));
    
    // Add in inner and outer barriers
    for (var i=0; i<pointPairs[0].length; i++) {
        var bar = new Barrier(
            game,
            pointPairs[0][i],
            pointPairs[0][(i+1) % pointPairs[0].length]);
        
        sprites.push(bar);
    }
    
    for (var i=0; i<pointPairs[1].length; i++) {
        var bar = new Barrier(
            game,
            pointPairs[1][i],
            pointPairs[1][(i+1) % pointPairs[1].length]);
        
        sprites.push(bar);
    }
    
    // Add in check points for lap detection
    for(var i = 0; i < points.length; i++) {
        sprites.push(new Checkpoint(game, points[i], i));
    }
    
    // Add in start line
    var startLine = createStartLine(
        game,
        points[0],
        getAngleOfLine(points[0], points[1])
    );
    
    sprites.push(startLine);
    
    return sprites;
}

function createStartLine(game, p, ang) {
    var frontPoint = incrPointByAng(p, ang, roadWidth / 5);
    var backPoint = incrPointByAng(p, ang, -roadWidth / 5);
    
    var startLine = new Terrain(game, [
        incrPointByAng(frontPoint, ang + (Math.PI/2), roadWidth),
        incrPointByAng(frontPoint, ang + (Math.PI/2), -roadWidth),
        incrPointByAng(backPoint, ang + (Math.PI/2), -roadWidth),
        incrPointByAng(backPoint, ang + (Math.PI/2), roadWidth)
    ], ctx.createPattern(imgStartLine, "repeat"));
    
    return startLine;
}

function createRoadPoints(pairs) {
    var points = [];
    
//    points.push(pairs[1][0]);
    
    for (var i=0; i<pairs[0].length; i++) {
        points.push(pairs[0][i]);
    }
    
    for (var i=pairs[1].length-1; i>=0; i--) {
        points.push(pairs[1][i]);
    }
    
//    points.push(pairs[0][0]);
    
    return points;
}

function combinePairs(pairs) {
    var points1 = pairs[0];
    var points2 = pairs[1];
//    points1.push(points1[0]);
//    points2.push(points2[0]);
    var newPoints1 = [];
    var newPoints2 = [];
    
    for (var i=1; i<points1.length; i += 2) {
        var p = checkLineIntersection(
            // Line 1
            points1[i-1].x,
            points1[i-1].y,
            points1[i+0].x,
            points1[i+0].y,
            // Line 2
            points1[(i+1) % points1.length].x,
            points1[(i+1) % points1.length].y,
            points1[(i+2) % points1.length].x,
            points1[(i+2) % points1.length].y
        );
        
        if (!p.onLine1 && !p.onLine2) {
            newPoints1.push(points1[i]);
            newPoints1.push(points1[(i+1) % points1.length]);
        } else {
            newPoints1.push(p);
        }
    }
    
    for (var i=1; i<points2.length; i += 2) {
        var p = checkLineIntersection(
            // Line 1
            points2[i-1].x,
            points2[i-1].y,
            points2[i+0].x,
            points2[i+0].y,
            // Line 2
            points2[(i+1) % points2.length].x,
            points2[(i+1) % points2.length].y,
            points2[(i+2) % points2.length].x,
            points2[(i+2) % points2.length].y
        );
        
        if (!p.onLine1 && !p.onLine2) {
            newPoints2.push(points2[i]);
            newPoints2.push(points2[(i+1) % points2.length]);
        } else {
            newPoints2.push(p);
        }
    }
    
    return [newPoints1, newPoints2];
//    return pairs;
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
        /*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

function getPointPairs(points) {
    var points1 = [];
    var points2 = [];
    
    for (var i=0; i<points.length - 1; i++) {
        // Get previous and current line angles
        var prevAng = i == 0 ? -1 :
            getAngleOfLine(points[i-1], points[i]);
        var curAng = i == points.length - 1 ? -1 :
            getAngleOfLine(points[i], points[i+1]);
        
        if (prevAng == -1) prevAng = curAng;
        if (curAng == -1) curAng = prevAng;
        
        // Average them
        var avgAng = (prevAng + curAng) / 2;
        
        var ang = curAng + Math.PI / 2;
        
        // Make them positive
        while (ang < 0) {
            ang += 2 * Math.PI;
        }
        
        if (points[i+1].x - points[i].x >= 0)
            ang += Math.PI;
        
//        console.log("i: " + i);
//        console.log("Prev: " + prevAng);
//        console.log("Cur:  " + curAng);
//        console.log("Avg:  " + avgAng);
//        console.log("New:  " + ang);
//        console.log("---");
        
        // Add them to the list
        points1.push(incrPointByAng(points[i], ang, +roadWidth));
        points2.push(incrPointByAng(points[i], ang, -roadWidth))
        points1.push(incrPointByAng(points[i+1], ang, +roadWidth));
        points2.push(incrPointByAng(points[i+1], ang, -roadWidth))
        
    }
    
    return [points1, points2];
}
