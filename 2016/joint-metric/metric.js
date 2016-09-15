var RECURSIVE_LIMIT = 3;

function height(x,y, f, invf) {

    function g(x) {
        return f(2*x - x);
    }

    function invg(y) {
        return invf(2*y - y);
    }

    return Math.min(lr(x, y, f, invf), lr(x, y, g, invg));
}

function lr(x, y, func, invfunc) {
    var vert = Math.abs(y - func(x));
    var horiz = Math.abs(invfunc(y) - x);
    var approx = Math.abs(aux(x, y, func, invfunc, 0));
    return Math.min(approx, vert, horiz);
}

function aux(x, y, func, invfunc, counter) {
    if(counter > RECURSIVE_LIMIT) return 0;
    var signChangeNumDenom = y - func(x);
    var signMultiplier = signChangeNumDenom/Math.abs(signChangeNumDenom);
    var vert = invfunc(y) - x;
    var horiz = y - func(x);
    var hyp = Math.sqrt(Math.pow(vert, 2) + Math.pow(horiz, 2));
    var fract = (vert * horiz)/hyp;
    var midpoint = {
        x: (x + invfunc(y))/2,
        y: (y + func(x))/2
    };
    return (signMultiplier * fract) + aux(midpoint.x, midpoint.y, func, invfunc, (counter + 1));
}

function c119(x) {
    //return 0.05927616*Math.pow(x,2) + 0.3677721*x + 0.2860636;
    return 3.959819 + 2.228665*x - 0.07230238*Math.pow(x,2);
}

function ic119(y) {
    //return 1.13169*Math.pow(10,-6)*Math.sqrt(1.31725*Math.pow(10,13)*y+3.74607*Math.pow(10,12)) - 3.10219;
    return 15.4121 + 1.38308 * Math.pow(10,-6) * Math.sqrt(Math.abs(1.52804*Math.pow(10,14)-7.23024*Math.pow(10,12)*y));
}

function c2069(x) {
    return 1.000339*x + 13.1116;
}

function ic2069(y) {
    return -0.999661*(13.1116-y);
}

function c70100(x) {
    return 0.6077348*x + 39.09392;
}

function ic70100(y) {
    return -1.64545*(39.09392-y);
}

function calcMainSeqDist(x, y) {
    if (x < 20) return height(x, y, c119, ic119);
    else if (x < 70) return height(x, y, c2069, ic2069);
    else if (x <= 100) return height(x, y, c70100, ic70100);
}

function calcDist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

function calcMetric(x, y) {
    var dist = calcMainSeqDist(x, y);
    var distDiff = calcMainSeqDist(100,0) - dist;
    var distDiffToMax = calcDist(0,0,100,100) - calcDist(x,y,100,100);
    return distDiff * distDiffToMax;
}

function downloadData(fileName, data, contentType) {
    var blob = new Blob([data], {type: contentType});
    saveAs(blob, fileName);
}

