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

    var Module = {
        changeBoxSize:function(box,source){
            var module = this;
            var last = source ? source : this.getBoxValue();
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
                setModuleRotate(module,box.rotate);
            }
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
        }

    };
    var noCollision=function(startx,starty,options,modules){
        var space = 5;
        var stageWidth = utils.stageSize.width;
        var stageHeight = utils.stageSize.height;
        for(var i=0;i<modules.length;i++){
            var module = modules[i];
            var x = (startx+parseSize(options.width,utils.stageSize.width)<parseFloat(module.left)-space) || (startx>=parseFloat(module.left)+parseFloat(module.width)+space);
            var y = (starty+parseSize(options.height,utils.stageSize.width)<parseFloat(module.top)-space) || (starty>=parseFloat(module.top)+parseFloat(module.height)+space);
            if(!x && !y){
                return false;
            }
        }
        return true;
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

        }
    };
});