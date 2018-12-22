/**
 * Created by Administrator on 2016/12/15.
 * 描红中用到的线工具类
 */

import Point from "./point";

export default class Line {
    constructor() {
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

    getK() {
        return -this.a / this.b;
    }

    getX(y) {
        return (-this.c - this.b * y) / this.a;
    }

    getY(x) {
        return (-this.c - this.a * x) / this.b;
    }

    getLength() {
        return this.p1.getDistance(this.p2);
    }

    getDistance(p) {
        return Math.abs(this.a * p.x + this.b * p.y + this.c) / Math.sqrt(this.a * this.a + this.b * this.b);
    }

    getRectangle(width, distance) {
        var startVLine = this.getVertical(this.p1);
        var endFootPoint = this.getPoint(this.p1, this.p2, distance);
        var endVLine = this.getVertical(endFootPoint);
        var startPoints = startVLine.getPoints(this.p1, width / 2);
        var endPoints = endVLine.getPoints(endFootPoint, width / 2);

        return [startPoints[0], startPoints[1], endPoints[1], endPoints[0]];
    }

    getVertical(p) {
        var c = -this.b * p.x + this.a * p.y;
        return new Line(this.b, -this.a, c);
    }

    getPoint(start, director, distance) {
        var ps = this.getPoints(start, distance);
        var d1 = director.getDistance(ps[0]);
        var d2 = director.getDistance(ps[1]);
        if (d1 < d2)
            return ps[0];
        return ps[1];
    }

    getPoints(p, distance) {
        if (Math.round(this.b) == 0)
            return [new Point(p.x, p.y - distance), new Point(p.x, p.y + distance)];
        var x = Math.sqrt(distance * distance / (1 + this.getK() * this.getK()));
        return [new Point(p.x + x, this.getY(p.x + x)), new Point(p.x - x, this.getY(p.x - x))];
    }
}

