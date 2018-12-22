/**
 * evt.data:{
                "polygons": vm.polygons, //[{x,y},{x,y},{x,y}] => [{key,points:[{x,y},{x,y},{x,y}]}]
                "startPoint": vm.currentLine.startPoint,
                "endPoint": vm.currentLine.endPoint
            };
 * return {
     "polygons": [{
            points:[{x,y},{x,y},{x,y}],
            intersectionPoints:[{
                line:[{x,y},{x,y}],
                point:{x,y},
                hasChange:false
            },{
                line:[{x,y},{x,y}],
                point:{x,y},
                hasChange:false
            }]
         }],
     "startPoint": vm.currentLine.startPoint,
     "endPoint": vm.currentLine.endPoint
   }
 */
onmessage = function (evt) {
    var data = evt.data,
        polygons = data.polygons,
        sp = data.startPoint,
        ep = data.endPoint;
    var returnValue = {
        "polygons": [],
        "startPoint": sp,
        "endPoint": ep,
        "id": data.id
    };

    //循环所有多边形
    for (var i = 0; i < polygons.length; i++) {
        var polygon = polygons[i],
            p = polygon.points,
            intersectionPoints = [];

        //对多边形所有边进行相交计算
        for (var j = 0; j < p.length; j++) {
            var tmp, line;

            j == p.length - 1 ? line = [p[j], p[0]] : line = [p[j], p[j + 1]];

            tmp = crossPoint(sp, ep, line[0], line[1]);

            if (tmp) {
                intersectionPoints.push({
                    "line": line,
                    "point": tmp,
                    "hasChange": false
                });
            }
        }

        //先求出最少2个交点，然后进行点校验
        if (intersectionPoints.length > 1) {
            var result = {
                "points": p,
                "intersectionPoints": intersectionPoints,
                "key": polygon.key
            };
            //如果有相交则进行垂直检测
            //hasChange无效
            reaction(result);

            //如果有相交则进行平行检测

            //如果有相交则进行顶点检测
            calVertex(result);

            //如果有相交则进行中点检测
            calMid(result);

            returnValue.polygons.push(result);
        }

    }

    postMessage(returnValue);
};

/**
 * 垂直检测
 * @param {Object} result
 */
function reaction(result) {
    var intersections = result.intersectionPoints;
    var polygon = result.points;
    var result = false;
    //垂直感应
    for (var i = 0, iLen = intersections.length - 1; i < iLen; i++) {
        var start = intersections[i];
        var end = intersections[i + 1];
        result = vertical(start, end, polygon);
        if (result) {
            break;
        }
    }
    if (result == false) {
        for (var i = intersections.length - 1; i > 0; i--) {
            var start = intersections[i];
            var end = intersections[i - 1];
            result = vertical(start, end, polygon);
            if (result) {
                break;
            }
        }
    }
}

function checkPointInPolygon(p, poly) {
    var px = p.x,
        py = p.y,
        flag = false;

    for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
        var sx = poly[i].x,
            sy = poly[i].y,
            tx = poly[j].x,
            ty = poly[j].y;

        // 点与多边形顶点重合
        if ((sx === px && sy === py) || (tx === px && ty === py)) {
            return 'on';
        }
        //点是否在边上
        //直线方程的三个值ax+by+c=0
        var a = (ty).sub(sy);
        var b = (sx).sub(tx);
        var c = ((tx).mul(sy)).sub((sx).mul(ty));
        if (((a.mul(px)).add(b.mul(py))).add(c).toFixed(5) == 0) {
            return 'on';
        }

        // 判断线段两端点是否在射线两侧
        if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
            // 线段上与射线 Y 坐标相同的点的 X 坐标
            var x = sx + (py - sy) * (tx - sx) / (ty - sy)
            //var  x = (sx).add(((py.sub(sy)).mul((tx).sub(sx))).div((ty).sub(py)));

            // 点在多边形的边上
            if (x === px) {
                return 'on';
            }

            // 射线穿过多边形的边界
            if (x > px) {
                flag = !flag;
            }
        }
    }

    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? 'in' : 'out';
}

function vertical(start, end, polygon) {
    var center = {
        x: (start.point.x + end.point.x) / 2,
        y: (start.point.y + end.point.y) / 2
    };
    //切线的中心不在多边形内，非法切线
    if (checkPointInPolygon(center, polygon) != 'in') {
        return false;
    }
    //两个切点一样
    if (start.point.x == end.point.x && start.point.y == end.point.y) {
        return false;
    }

    //判断切线与多边形相交的线段的角度是否在85-95度之间,夹角为x
    var vector1 = {
            x: start.line[0].x - start.point.x,
            y: start.line[0].y - start.point.y
        },
        vector2 = {
            x: end.point.x - start.point.x,
            y: end.point.y - start.point.y
        };
    var cosx = (vector1.x * vector2.x + vector1.y * vector2.y) / (Math.pow(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2), 0.5) * Math.pow(Math.pow(vector2.x, 2) + Math.pow(vector2.y, 2), 0.5));
    //已经垂直或不在感应范围之内,感应区域85-95度，不需要处理
    if (cosx == 0 || (cosx < 0 && cosx < Math.cos(2 * Math.PI / 360 * 95)) || (cosx > 0 && cosx > Math.cos(2 * Math.PI / 360 * 85))) {
        return false;
    } else if (cosx < 0) {
        cosx = Math.abs(cosx);
        vector1 = {
            x: start.point.x - start.line[1].x,
            y: start.point.y - start.line[1].y
        }
    }

    //有在感应区处理
    var newX, newY;
    //求切线 start到end两点的距离
    var se = Math.pow(Math.pow(vector2.x, 2) + Math.pow(vector2.y, 2), 0.5);
    var sl = se * Math.sin(Math.acos(cosx));
    var el = se * cosx;
    //线段垂直Y轴
    if (start.line[0].x.toFixed(5) == start.line[1].x.toFixed(5)) {
        start.point.y = end.point.y;
        start.hasChange = true;
        end.hasChange = true;
        return true;
    } else if (start.line[0].y.toFixed(5) == start.line[1].y.toFixed(5)) { //线段垂直X轴
        //console.log('垂直X轴', end.point.x);
        start.point.x = end.point.x;
        start.hasChange = true;
        end.hasChange = true;
        return true;
    }

    var lineSlope = (start.line[0].y - start.line[1].y) / (start.line[0].x - start.line[1].x);
    //	newX = start.point.x + Math.pow((sl * sl) / (1 + lineSlope * lineSlope), 0.5);
    newX = (lineSlope * end.point.y - lineSlope * start.point.y + Math.pow(lineSlope, 2) * start.point.x + end.point.x) / (1 + Math.pow(lineSlope, 2))
    newY = start.point.y - lineSlope * (start.point.x - newX);

    //点是否在边上
    //直线方程的三个值ax+by+c=0
    //	var a = (end.point.y).sub(start.point.y);
    //	var b = (start.point.x).sub(end.point.x);
    //	var c = ((end.point.x).mul(start.point.y)).sub((start.point.x).mul(end.point.y));
    //	if (((a.mul(newX)).add(b.mul(newY))).add(c).toFixed(5) != 0) {
    //		newX = start.point.x - Math.pow((sl * sl) / (1 + lineSlope * lineSlope), 0.5);
    //		newY = start.point.y - lineSlope * (start.point.x - newX);
    //	}

    start.point = {
        x: newX,
        y: newY
    };
    start.hasChange = true;
    end.hasChange = true;
    return true;
}

/**
 * 顶点检测
 */
function calVertex(result) {
    var offset = 15;
    for (var i = 0; i < result.intersectionPoints.length; i++) {
        var ip = result.intersectionPoints[i],
            point = ip.point,
            line = ip.line;
        if (ip.hasChange)
            continue;
        if ((Math.abs(point.x - line[0].x) <= offset && Math.abs(point.y - line[0].y) <= offset)) {
            ip.point = line[0];
            ip.hasChange = true;
        }
        if ((Math.abs(point.x - line[1].x) <= offset && Math.abs(point.y - line[1].y) <= offset)) {
            ip.point = line[1];
            ip.hasChange = true;
        }
    }
}
/**
 * 中点检测
 */
function calMid(result) {
    var offset = 15;
    for (var i = 0; i < result.intersectionPoints.length; i++) {
        var ip = result.intersectionPoints[i],
            point = ip.point,
            line = ip.line;
        if (ip.hasChange)
            continue;
        var midPoint = {
            "x": (line[0].x + line[1].x) / 2,
            "y": (line[0].y + line[1].y) / 2
        };
        if ((Math.abs(point.x - midPoint.x) <= offset && Math.abs(point.y - midPoint.y) <= offset)) {
            ip.point = midPoint;
            ip.hasChange = true;
        }
    }
}

/**
 * 线段ab和线段cd是否相交，不相交返回false，相交返回交点坐标
 * @param {Object} a a点
 * @param {Object} b b点
 * @param {Object} c c点
 * @param {Object} d d点
 */
function crossPoint(a, b, c, d) {
    // 三角形abc 面积的2倍
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    // 三角形abd 面积的2倍
    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
    // 面积符号相同则两点在线段同侧,不相交
    if (area_abc * area_abd > 0) {
        return false;
    }
    // 三角形cda 面积的2倍
    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
    // 三角形cdb 面积的2倍
    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
    var area_cdb = area_cda + area_abc - area_abd;
    if (area_cda * area_cdb > 0) {
        return false;
    }
    //计算交点坐标
    var t = area_cda / (area_abd - area_abc);
    var dx = t * (b.x - a.x),
        dy = t * (b.y - a.y);
    return {
        x: a.x + dx,
        y: a.y + dy
    };
};

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return Number(accDiv(this, arg));
};
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return Number(accMul(arg, this));
};
//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m;
}
//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return Number(accAdd(arg, this));
};
//减法函数
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((Math.round(arg2 * m) - Math.round(arg1 * m)) / m).toFixed(n);
}
///给number类增加一个sub方法，调用起来更加方便
Number.prototype.sub = function (arg) {
    return Number(accSub(arg, this));
};