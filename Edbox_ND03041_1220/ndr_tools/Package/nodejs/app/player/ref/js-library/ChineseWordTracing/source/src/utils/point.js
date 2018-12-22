/**
 * Created by Administrator on 2016/12/15.
 * 描红中用到的点工具类
 */


export default class Point {
    constructor(x, y) {
        this.x = typeof x == 'string' ? parseInt(x) : x;
        this.y = typeof y == 'string' ? parseInt(y) : y;
    }

    getDistance (p) {
        return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
    }
}
