/**
 * Created by Administrator on 2016/12/15.
 */

export default {
    //点到点的距离
    pointToPoint(p1,p2) {
        var d = 0;
        try{
            d = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));

        }catch(e){
            console.log(e);
        }

        return d;
    },

    //判断一个点是否在一个多边形内
    isPointInPoly(point, polyArray) {
        for(var p = 0,paLen = polyArray.length;p < paLen;p++ ){
            var poly = polyArray[p].points;
            var length = poly.length;
            for (var c = false, i = -1, j = length - 1; ++i < length; j = i) {
                ((poly[i].y <= point.y && point.y < poly[j].y) || (poly[j].y <= point.y && point.y < poly[i].y))
                && (point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
            }
            if(c) return c;
        }

        return c;
    },
    //窗口到canvas坐标转换
    windowToCanvas(canvas,x,y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    },

    //mouse event和 touch event时的坐标获取
    getPosition(event) {

        var x = 0, y = 0;

        switch (event.type){
            case "mousedown":
            case "mousemove":
            case "mouseup":
                //x = event.pageX;
                //y = event.pageY;
                //兼容生字卡描红坐标值在不同分辨率转换后出现小数点的情况
                x = event.coordinate && event.coordinate.x ? event.coordinate.x : event.pageX;
                y = event.coordinate && event.coordinate.y ? event.coordinate.y : event.pageY;
                break;
            case "touchstart":
            case "touchmove":
            case "touchend":
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
                break;
        }

        return {x, y};
    }
}