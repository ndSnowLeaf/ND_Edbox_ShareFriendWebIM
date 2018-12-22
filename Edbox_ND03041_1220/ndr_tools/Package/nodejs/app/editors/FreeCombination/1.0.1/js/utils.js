define([
        'jquery',
        'angular','./shape/shapes.js'],function(jquery,angular,templates) {
    var stageScale = 100;
    return {
        zoomSize: function(size){
            if (!stageScale) return size;
            if (isNaN(size)) return size;
            return size * 100 / stageScale;
        },
        parseSize:function(value,base){
            if(!value) return 0;
            if(!isNaN(value)){
                return parseInt(value);
            }
            if(value.charAt(value.length-1)=='%'){
                return Math.round((parseInt(value.substring(0,value.length-1))||0)*base/100);
            }else if(value.substring(value.length-2)=='px'){
                return parseInt(value.substring(0,value.length-2))||0;
            }else{
                return parseInt(value)||0;
            }
        },
        stageSize:{
            height: 575,
            width: 1194
        },
        scaleSize:function(size){
            if(!stageScale) return size;
            if(isNaN(size)) return size;
            return size*stageScale/100;
        },
        formatPx : function(value){
            if(!value) return '100%';
            if(!isNaN(value)){
                return Math.max(0,Math.round(value))+"px";
            }
            if(value.indexOf('%')==value.length-1){
                return value;
            }
            return this.parseSize(value)+"px";
        },
        findTemplate : function(type){
            for(var key in templates){
                if(templates[key].type == type){
                    return templates[key];
                }
            }
            throw ("未配置的形状："+type);
        },
        calculateBox :function(points){
            if(!points||points.length<2) {
                return {top: 0, left: 0};
            }
            var x0 = points[0][0];
            var y0 = points[0][1];
            var x1 = points[1][0];
            var y1 = points[1][1];
            if(x1==undefined&&y1==undefined){
                return {top:0,left:0};
            }
            return {top: Math.min(y0,y1),left:Math.min(x0,x1),width:Math.abs(x0-x1),height:Math.abs(y0-y1)}
        },
        calculatePoints : function(sourcePoints){
            var box = this.calculateBox(sourcePoints);
            var points = [];
            for(var i=0;i<sourcePoints.length;i++){
                var lp =sourcePoints[i];
                var x = lp[0]-box.left;
                var y = lp[1]-box.top;
                points.push([x,y]);
            }
            return points;
        },
        formatToWrite:function(element,i){
            var copy = {
                type: element.type,
                position:{
                    top: element.top,
                    left: element.left,
                    width: element.width,
                    height: element.height,
                    rotate: element.rotate
                },
                moveable: !element.locked,
                zIndex: i+1,
                group: element.group,
                data:{}
            };
            if(element.type == 'picture'){
                copy.data={url: element.src};
            }
            if(element.type == 'table'||element.type == 'richtext'){
                copy.data={html:element.html};
            }
            if(element.type == 'shape'){
                copy.data={
                    shapeType: element.shapetype=='line2'?'line':element.shapetype,
                    textStyle: element.shape.getTextStyle(),
                    html: element.html,
                    edgeColor: element.data.edgeColor,
                    fillColor: element.data.fillColor,
                    points: element.data.points
                }
                if(element.shapeGroupId){
                    copy.data.shapeGroupId = element.shapeGroupId;
                }
            }
            return copy;
        },
        formatFromRead:function(element){
            var options = {
                type: element.type,
                top: parseFloat(element.position.top),
                left: parseFloat(element.position.left),
                width: parseFloat(element.position.width),
                height: parseFloat(element.position.height),
                rotate: element.position.rotate||0,
                locked:!element.moveable,
                group:element.group
            };
            if(element.type == 'picture'){
                options.src= element.data.url;
            }
            if(element.type == 'table'||element.type == 'richtext'){
                options.html = element.data.html;
            }
            if(element.type == 'shape'){
                options.shapetype = element.data.shapeType;
                options.html = element.data.html;
                options.data = element.data;
                options.template = this.findTemplate(options.shapetype);
                if(element.data.shapeGroupId){
                    options.shapeGroupId = element.data.shapeGroupId;
                }
            }
            return options;
        },
        fixImageOptions:function(item){
            var href = item.href;
            var width = 200;
            var height = 200;
            var resolution = item.resolution;
            if(resolution) {
                width = resolution.split("*")[0] * 1;
                height = resolution.split("*")[1] * 1;
            }
            var options =  {type:"picture",src:href,width:width,height:height};
            var inBound = function(options,maxWidth,maxHeight){
                if(options.width<maxWidth&&options.height<maxHeight){
                    return;
                }
                var rate = Math.max(options.width/maxWidth,options.height/maxHeight);
                options.width = options.width/rate;
                options.height = options.height/rate;
            }
            inBound(options,200,200);
            return options;
        }
    }
});
