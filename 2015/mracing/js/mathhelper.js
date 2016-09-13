function getAngleOfLine(p1, p2) {
    var ang = Math.atan(
        (p2.y - p1.y) /
        (p2.x - p1.x)
    );
    
    return putAngleInRange(ang);
}

function getPointDistance(p1, p2) {
    return Math.sqrt(
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.x - p2.x, 2)
    );
}

function putAngleInRange(a) {
    while (a < 0) {
        a += 2 * Math.PI;
    }
    
    while (a > 2 * Math.PI) {
        a -= 2 * Math.PI;
    }
    
    return a;
}

function getLineOfAngle(a) {
    return {
        x: Math.cos(a),
        y: Math.sin(a)
    };
}

function incrAngle(a, i) {
    return putAngleInRange(a + i);
}

function incrPointByAng(s, a, i) {
    return {
        x: s.x + (Math.cos(a) * i),
        y: s.y + (Math.sin(a) * i)
    };
}

function getAngDiff(l, c) {
	var angleDif1 = l - c;
	var angleDif2 = Math.min(l, c) + (2 * Math.PI) - Math.max(l, c);
    
	if(l > c) {
		angleDif2 *= -1;
	}
    
	if (Math.abs(angleDif1)>Math.abs(angleDif2)) {
		return angleDif2;
	} else {
		return angleDif1;
	}
}

function getComponent(v, a, trigFn){
//	if(a>=0 && a<Math.PI*0.5){
//		return v*trigFn(a);
//	}else if(a>=Math.PI*0.5 && a<Math.PI){
//		return -v*trigFn(Math.PI-a);
//	}else if(a>=Math.PI && a<Math.PI*1.5){
//		return -v*trigFn(a-Math.PI);
//	}else{
//		return v*trigFn(Math.PI*2-a);
//	}
    
    return v * trigFn(a);
}

function getCompleteAngle(p2, p1){
    var deltaX = p1.x-p2.x;
    var deltaY = p1.y-p2.y;
	var arctan = Math.atan(deltaY/deltaX);

	if (deltaX>=0) {
		return arctan;
	} else {
		return Math.PI + arctan;
	}
}
