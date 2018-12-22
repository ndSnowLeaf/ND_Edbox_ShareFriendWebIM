define([
    'jquery',
    'angular','../utils.js','../shape/ShapeCreator.js','../shape/Sevenpiecepuzzle.js'],function(jquery,angular,utils,ShapeCreator,Sevenpiecepuzzle){
    var parseSize = utils.parseSize;
    function getModuleWidth(module){
        return parseSize(module.width,utils.stageSize.width);
    }
    function getModuleHeight(module){
        return parseSize(module.height,utils.stageSize.height);
    }
    function getModuleLeft(module){
        return parseSize(module.left,utils.stageSize.width);
    }
    function getModuleTop(module){
        return parseSize(module.top,utils.stageSize.height);
    }
    function getModuleRotate(module){
        return parseInt(module.rotate)||0;
    }
    function setModuleWidth(module,value){
        module.width=value;
    }
    function setModuleHeight(module,value){
        module.height=value;
    }
    function setModuleLeft(module,value){
        module.left=value;
    }
    function setModuleTop(module,value){
        module.top=value;
    }
    function setModuleRotate(module,value){
        module.rotate=value;
    }
    function calculateCenter(box){
        var width = box.width;
        var height = box.height;
        var top = box.top;
        var left = box.left;
        return {
            x: left+width/2,
            y: top+height/2
        }
    }
    function calculateR(box,center){
        var x = box.width/2;
        var y = box.height/2;
        return Math.sqrt(x*x+y*y);
    }
    function calculateFixPosition(startBox,lastBox,rotate){
        var center0 = calculateCenter(startBox);
        var r0 = calculateR(startBox);


        var r1 = calculateR(lastBox);
        //原角度
        var x = startBox.width/2;
        var y = startBox.height/2;
        var degree = Math.atan(x/y)+rotate/180*Math.PI+(y<0 ? Math.PI : 0);
        var x1 = (r1-r0)* Math.sin(degree);
        var y1 = (r1-r0)*Math.cos(degree);

        return {
            left: x1,
            top: y1
        }
    }
    var Module = {
        changeBoxSize:function(box,source){
            var module = this;
            var last = this.startBox;
            if(!isNaN(box.top)){
                setModuleTop(module,getModuleTop(last)+box.top);
            }
            if(!isNaN(box.left)){
                setModuleLeft(module,getModuleLeft(last)+box.left);
            }
            if(!isNaN(box.width)){
                setModuleWidth(module,getModuleWidth(last)+box.width);
            }
            if(!isNaN(box.height)){
                setModuleHeight(module,getModuleHeight(last)+box.height);
            }
            if(!isNaN(box.rotate)){
                setModuleRotate(module,module.startBox.rotate+box.rotate-source.rotate);
                //console.log("set rotate ",this.id);
            }
        },
        changeSize:function(rate,group){
            var config = this.resizeConfig;
            var last = this.startBox;
            var widthrate = rate.width;
            var heightrate = rate.height;
            if(this.template&&this.template.keep_rate){
                widthrate = heightrate = Math.min(widthrate,heightrate);
            }
            this.width = this.startBox.width * widthrate;
            this.height = this.startBox.height * heightrate;

            this.left = this.startBox.left +config.left*this.startBox.width * (widthrate-1);
            this.top = this.startBox.top +config.top*this.startBox.height * (heightrate-1);

        },
        setBoxValue:function(box){
            var module = this;
            setModuleTop(module,box.top);
            setModuleLeft(module,box.left);
            setModuleWidth(module,box.width);
            setModuleHeight(module,box.height);
            setModuleRotate(module,box.rotate);
        },
        getBoxValue:function(){
            var module = this;
            return {
                top: getModuleTop(module),
                left:getModuleLeft(module),
                width: getModuleWidth(module),
                height: getModuleHeight(module),
                rotate: getModuleRotate(module)

            };
        },
        getSize:function(rate){
            var module = this;
            var width = parseSize(module.width,utils.stageSize.width);
            var height = parseSize(module.height,utils.stageSize.height);
            return {width:width,height:height};
        },
        isSelected:function(){
            if(!this.selected) return false;
            if(this.type == 'group'){
                for(var i=0;i<this.children.length;i++){
                    if(this.children[i].selected) return false;
                }
            }
            return true;
        }

    };
    var noCollision=function(startx,starty,options,modules){
        var space = 5;
        var stageWidth = utils.stageSize.width;
        var stageHeight = utils.stageSize.height;
        var result = true;
        modules.each(function(module){
            if(module.group) return;
            var x = (startx+parseSize(options.width,utils.stageSize.width)<parseFloat(module.left)-space) || (startx>=parseFloat(module.left)+parseFloat(module.width)+space);
            var y = (starty+parseSize(options.height,utils.stageSize.width)<parseFloat(module.top)-space) || (starty>=parseFloat(module.top)+parseFloat(module.height)+space);
            if(!x && !y){
                result = false;
            }
        });
        return result;
    }
    var findEmptySpacePosition = function(options,modules){
        var step = 10;
        var stageWidth = utils.stageSize.width;
        var stageHeight = utils.stageSize.height;
        var startx = 10;
        var starty = 60;

        while(starty+options.height<=stageHeight){
            while(startx+options.width <=stageWidth){
                if(noCollision(startx,starty,options,modules)){
                    options.top = starty;
                    options.left = startx;
                    return;
                }
                startx = startx+step;
            }
            startx = 10;
            starty = starty+step;
        }
        options.top = 10;
        options.left = 10;
    }
    return {
        create:function(options,modules){
            var base = {};
            if(options.type == 'richtext'){
                base.text = "";
                //base.disallowrotation=true;
            }
            if(options.type == 'table'){
                base.html = "<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>";
            }

            if(options.top === undefined && options.left === undefined){
                findEmptySpacePosition(options,modules);
            }
            if(options.type=='shape'&&options.shapetype == 'sevenpiecepuzzle'){
                return Sevenpiecepuzzle.create(options,Module);
            }
            if(options.type == 'shape'){
                var shape = ShapeCreator.create(base,options.shapetype);
                base.shape = shape;
            }
            return angular.extend(base,Module,options);

        },
        createGroup:function(options){
            return angular.extend(options,{type:'group'},Module);
        }
    };
});