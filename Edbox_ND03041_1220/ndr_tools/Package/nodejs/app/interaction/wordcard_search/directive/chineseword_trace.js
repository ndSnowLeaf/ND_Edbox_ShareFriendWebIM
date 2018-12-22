/**
 * Created by Administrator on 2015/9/6.
 */
/*
 以后要抽离的
 */
var ChineseWord;
(function (Common) {
    function Line() {
        if (arguments.length == 2) {
            var p1 = arguments[0], p2 = arguments[1];
            this.a = p1.y - p2.y;
            this.b = p2.x - p1.x;
            this.c = p1.x * p2.y - p2.x * p1.y;
            this.p1 = p1;
            this.p2 = p2;
        } else if (arguments.length == 3) {
            this.a = arguments[0];
            this.b = arguments[1];
            this.c = arguments[2];
            this.p1 = null;
            this.p2 = null;
        }
    }

    Line.prototype = {
        getK: function () {
            return -this.a / this.b;
        },
        getX: function (y) {
            return (-this.c - this.b * y) / this.a;
        },
        getY: function (x) {
            return (-this.c - this.a * x) / this.b;
        },
        getLength: function () {
            return this.p1.getDistance(this.p2);
        },
        getDistance: function (p) {
            return Math.abs(this.a * p.x + this.b * p.y + this.c) / Math.sqrt(this.a * this.a + this.b * this.b);
        },
        getRectangle: function (width, distance) {
            var startVLine = this.getVertical(this.p1);
            var endFootPoint = this.getPoint(this.p1, this.p2, distance);
            var endVLine = this.getVertical(endFootPoint);
            var startPoints = startVLine.getPoints(this.p1, width / 2);
            var endPoints = endVLine.getPoints(endFootPoint, width / 2);

            return [startPoints[0], startPoints[1], endPoints[1], endPoints[0]];
        },
        getVertical: function (p) {
            var c = -this.b * p.x + this.a * p.y;
            return new Line(this.b, -this.a, c);
        },
        getPoint: function (start, director, distance) {
            var ps = this.getPoints(start, distance);
            var d1 = director.getDistance(ps[0]);
            var d2 = director.getDistance(ps[1]);
            if (d1 < d2)
                return ps[0];
            return ps[1];
        },
        getPoints: function (p, distance) {
            if (Math.round(this.b) == 0)
                return [new Point(p.x, p.y - distance), new Point(p.x, p.y + distance)];
            var x = Math.sqrt(distance * distance / (1 + this.getK() * this.getK()));
            return [new Point(p.x + x, this.getY(p.x + x)), new Point(p.x - x, this.getY(p.x - x))];
        }
    };

    Common.Line = Line;

    function Point(x, y) {
        this.x = typeof x == 'string' ? parseInt(x) : x;
        this.y = typeof y == 'string' ? parseInt(y) : y;
    }

    Point.prototype = {
        getDistance: function (p) {
            return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
        }
    };

    Point.isSimilar = function (standardPoints, verifyPoints, errorRange) {
        if (typeof errorRange == 'undefined')
            errorRange = 10;

        var flag = true;

        function pointCheck(first, second) {
            return first.getDistance(second) < errorRange;
        }

        var loop = function (formPath, toPath, passPoint) {
            var i, ilen = formPath.length, j, jlen = toPath.length, shouldCheckPass = !!passPoint, formPoint, toPoint, mapFlag = false;

            for (i = 0; i < ilen; i++) {
                formPoint = formPath[i];
                mapFlag = false;
                if (shouldCheckPass) {
                    if (pointCheck(formPoint, passPoint.firstPass.point)) {
                        passPoint.firstPass.isPass = true;
                    } else if (pointCheck(formPoint, passPoint.nextPass.point)) {
                        if (!passPoint.firstPass.isPass) {
                            flag = false;
                            break;
                        }
                    }
                }
                for (j = 0; j < jlen; j++) {
                    toPoint = toPath[j];
                    if (pointCheck(formPoint, toPoint)) {
                        mapFlag = true;
                        break;
                    }
                }
                if (!mapFlag) {
                    flag = false;
                    break;
                }
            }
        };

        function check(firstPath, secondPath) {
            var fp = firstPath, flen = fp.length, sp = secondPath, slen = sp.length, flag = true, dotCheck;

            dotCheck = pointCheck(fp[0], sp[0]);
            dotCheck = dotCheck && pointCheck(fp[flen - 1], sp[slen - 1]);
            if (dotCheck) {
                loop(fp, sp);
                loop(sp, fp, {
                    firstPass: {
                        isPass: false,
                        point: fp[Math.ceil(flen / 3)]
                    },
                    nextPass: {
                        isPass: false,
                        point: fp[Math.ceil(flen / 2)]
                    }
                });
            } else {
                return false;
            }
            return flag;
        }

        return check(standardPoints, verifyPoints);
    };

    Common.Point = Point;
})(ChineseWord || (ChineseWord = {}));

function getChineseWordTrace() {
    return ChineseWord;
}