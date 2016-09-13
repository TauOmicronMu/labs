/**
 * Created by samuelt on 02/09/2016.
 */

var isoWidth = 6, isoLength = 11;
var dataOffset = 54;
var data = null;

d3.select('#slider').call(d3.slider().value(isoLength).axis(d3.svg.axis().orient("top").ticks(10)).min(1).max(11).step(1).on("slide", function (evt, val) {
    isoLength = val;
    draw();
}));

onDropdownChange();

function scale( value, domainMax, rangeMax ) {
    return value / domainMax * rangeMax;
}

function onDropdownChange() {
    var dataset = document.getElementById("dropdown").value;
    var datatype = document.getElementById("dropdown2").value;
    $.getJSON("json/" + dataset + ".json", function(d) {
        data = d[datatype];
        draw();
    });
}

function draw() {
    var L, PAD, iso_data, enter_pipedons, height, iso_layout, isometric, parallelepipedon, path_generator, pipedons, svg, vis, width, y_color;

    var width = $(document).width() * 0.7;
    var height = $(document).height() * 0.7;

    var svg = d3.select("svg").attr("width", width)
        .attr("height", height);;
    svg.selectAll("*").remove();

    vis = svg.append('g').attr({
        transform: "translate(" + (width / 2) + "," + (height / 2) + ")"
    });

    isometric = function(_3d_p) {
        return [-Math.sqrt(3) / 2 * _3d_p[0] + Math.sqrt(3) / 2 * _3d_p[1], +0.5 * _3d_p[0] + 0.5 * _3d_p[1] - _3d_p[2]];
    };

    parallelepipedon = function(d) {
        var fb, ft, mlb, mlt, mrb, mrt, nb, nt;
        if (!(d.x != null)) {
            d.x = 0;
        }
        if (!(d.y != null)) {
            d.y = 0;
        }
        if (!(d.z != null)) {
            d.z = 0;
        }
        if (!(d.dx != null)) {
            d.dx = 10;
        }
        if (!(d.dy != null)) {
            d.dy = 10;
        }
        if (!(d.dz != null)) {
            d.dz = 10;
        }
        fb = isometric([d.x, d.y, d.z], mlb = isometric([d.x + d.dx, d.y, d.z], nb = isometric([d.x + d.dx, d.y + d.dy, d.z], mrb = isometric([d.x, d.y + d.dy, d.z], ft = isometric([d.x, d.y, d.z + d.dz], mlt = isometric([d.x + d.dx, d.y, d.z + d.dz], nt = isometric([d.x + d.dx, d.y + d.dy, d.z + d.dz], mrt = isometric([d.x, d.y + d.dy, d.z + d.dz]))))))));
        d.iso = {
            face_bottom: [fb, mrb, nb, mlb],
            face_left: [mlb, mlt, nt, nb],
            face_right: [nt, mrt, mrb, nb],
            face_top: [ft, mrt, nt, mlt],
            outline: [ft, mrt, mrb, nb, mlb, mlt],
            far_point: fb
        };
        return d;
    };

    iso_layout = function(data, shape, scale) {
        if (!(scale != null)) {
            scale = 1;
        }
        data.forEach(function(d) {
            return shape(d, scale);
        });
        return data.sort(function(a, b) {
            return a.iso.far_point[1] - b.iso.far_point[1];
        });
    };

    path_generator = function(d) {
        return 'M' + d.map(function(p) {
                return p.join(' ');
            }).join('L') + 'z';
    };

    y_color = d3.scale.category10();
    L = 30;
    PAD = 9;

    var max = 0;
    for(var i in data) {
        if((i - dataOffset) < data.length) {
            var val = data[i]
            if (val.count > max) max = val.count;
        }
    }
    console.log(max);

    iso_data = d3.range(isoLength * isoWidth).map(function(i) {
        var elem = data[i + dataOffset];
        if(!!elem) {
            return {
                x: (i % 6) * L + 200,
                y: Math.floor(i / 6) * L + (2 * i) - 165,
                dx: L - PAD,
                dy: L - PAD,
                date: !!elem ? elem.date : "",
                count: !!elem ? elem.count : 0,
                dz: !!elem ? scale(elem.count, max + 1,  height / 10) : 0
            };
        } else return {x: -1, y: -1, dx: -1, dy: -1, dz: -1};
    });

    iso_layout(iso_data, parallelepipedon);

    pipedons = vis.selectAll('.pipedon').data(iso_data);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d.date === "" ? "" : "<strong>" + d.date + "</strong>, " + d.count;
        });
    svg.call(tip);

    enter_pipedons = pipedons.enter().append('g').attr({
        "class": 'pipedon'
    }).on("mouseover", tip.show).on("mouseout", tip.hide);

    enter_pipedons.append('path').attr({
        "class": 'iso face bottom',
        d: function(d) {
            return path_generator(d.iso.face_bottom);
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face left template',
        d: function(d) {
            return path_generator(d.iso.face_left);
        },
        fill: function(d) {
            return y_color(d.x);
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face right',
        d: function(d) {
            return path_generator(d.iso.face_right);
        },
        fill: function(d) {
            var color;
            color = d3.hcl(d3.select(this.parentNode).select('.template').style('fill'));
            return d3.hcl(color.h, color.c, color.l - 12);
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso face top',
        d: function(d) {
            return path_generator(d.iso.face_top);
        },
        fill: function(d) {
            var color;
            color = d3.hcl(d3.select(this.parentNode).select('.template').style('fill'));
            return d3.hcl(color.h, color.c, color.l + 12);
        }
    });

    enter_pipedons.append('path').attr({
        "class": 'iso outline',
        d: function(d) {
            return path_generator(d.iso.outline);
        }
    });

}