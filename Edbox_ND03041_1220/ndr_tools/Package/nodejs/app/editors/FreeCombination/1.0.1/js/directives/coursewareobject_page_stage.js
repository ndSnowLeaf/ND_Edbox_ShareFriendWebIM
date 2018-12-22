define([
    'jquery',
    'angular','../utils.js', '../shape/Sevenpiecepuzzle.js', './../fc_stage.js'],function(jquery,angular,utils,Sevenpiecepuzzle){
    var module = angular.module("fcstage");
    var stageScale = 100;
    module.directive('coursewareobjectPageStage',['$document','$stage',function($document,$stage){
        return {
            restrict:'A',
            require:'coursewareobjectPageStage',
            controller:['$scope',function($scope){
            }],
            link:function($scope, $element, $attr, ctrl){
                /*if(!stageScale){
                    var backgroundEL = $element.parent(),
                        wrapEl = $element.parents('._stage-wrap');

                    var width=$element.width()+80,
                        height=$element.height()+40,
                        cWidth=wrapEl.innerWidth(),
                        cHeight=wrapEl.innerHeight();
                    var scale = Math.min(cWidth/width,cHeight/height)*100;
                    for(var i=whellScales.length-1;i>=0;i--){
                        if(scale>=whellScales[i]){
                            stageScale=whellScales[i];
                            break;
                        }
                    }
                }*/

                var proxys=[];
                var backdrop=angular.element('<div class="_coursewareobject-page-module-proxy-backdrop"><div class="_drop-box"></div></div>');
                function cancelProxy(){
                    for(var i=0;i<proxys.length;i++){
                        delete proxys[i].startBox;
                    }
                    proxys.length=0;
                    changeableProxys.length = 0;

                }
                var fixMoveBox = function(box){
                    var maxWidth = utils.stageSize.width-5;
                    var maxHeight = utils.stageSize.height-5;
                    var width = box.left;
                    var height = box.top;
                    for(var i=0;i<proxys.length;i++){
                        var proxy = proxys[i];
                        var startBox = proxy.startBox;
                        if(width>0){
                            var position = startBox.left+startBox.width+width;
                            if(position>maxWidth){
                                width = width - position+maxWidth;
                            }
                        }
                        else if(width<0){
                            var position = startBox.left+width;
                            if(position<0){
                                width = -1.0*startBox.left
                            }
                        }
                        if(height>0){
                            var position = startBox.top+startBox.height+height;
                            if(position>maxHeight){
                                height = height - position+maxHeight;
                            }
                        }
                        else if(box.top<0){
                            var position = startBox.top+height;
                            if(position<0){
                                height = startBox.top*-1.0;
                            }
                        }
                        box.left = width;
                        box.top = height;
                    }
                }

                function makeProxy(box,cursor){
                    if(!proxys.length){
                        for(var i=0;i<$scope.modules.length;i++){
                            if($scope.modules[i].selected){
                                var module = $scope.modules[i];
                                module.startBox=module.getBoxValue();
                                proxys.push($scope.modules[i]);
                            }
                        }
                    }
                    fixMoveBox(box);
                    for(var i=0;i<proxys.length;i++){
                        var proxy = proxys[i];
                        if(!isNaN(box.rotateX) && !isNaN(box.rotateY)){
                            var offset = $element.offset();
                            var rotateCenterX=Math.round(offset.left+proxy.startBox.left+(proxy.startBox.width/2));
                            var rotateCenterY=Math.round(offset.top+proxy.startBox.top+(proxy.startBox.height/2));
                            var x=box.rotateX-rotateCenterX;
                            var y=-(box.rotateY-rotateCenterY);
                            var degree = -(Math.atan2(y,x)/Math.PI*180-90);
                            box.rotate=degree;
                        }
                        proxy.changeBoxSize(box,proxy.startBox);
                    }
                }

                var lastBox;
                ctrl.makeProxy=function(box,cursor){
                    makeProxy(box,cursor);
                    lastBox=box;
                };
                ctrl.cancelProxy=function(){
                    cancelProxy();
                    lastBox=null;
                };
                var isTopChange = function(action){
                    if(action == 'move' || action=='n'||action=='nw'||action=='ne'){
                        return true;
                    }
                    return false;
                }
                var isLeftChange = function(action){
                    if(action == 'move' || action=='w'||action=='nw'||action=='sw'){
                        return true;
                    }
                    return false;
                }
                var isKeepRate = function(module){
                    return module&&module.template&&module.template.keep_rate
                }
                var calculageMaxBox = function(rate,module){
                    var ratewidth = rate.width;
                    var rateheight = rate.height;
                    if(isKeepRate(module)){
                        ratewidth = rateheight = Math.min(ratewidth,rateheight);
                    }
                    if(module.shapeGroupId){
                        var source = groupIds[module.shapeGroupId];
                        if(source==module) {
                            var seq = Sevenpiecepuzzle.getSequence(module.shapetype);
                            size  =  Sevenpiecepuzzle.getSize(module.startBox.width,seq);
                            var top = module.startBox.top + (1-rateheight)*rate.top* module.startBox.height;
                            var left = module.startBox.left + (1-ratewidth)*rate.left* module.startBox.width;
                            var position = Sevenpiecepuzzle.getBasePosition(top,left,size*ratewidth,seq);
                            /*console.log("base position ",JSON.stringify(position));*/
                            var shaperate =Sevenpiecepuzzle.getShapeRate(seq,rate.top,rate.left);
                            var box = {width:size*ratewidth,height:size*rateheight,top:position.top,left:position.left,basewidth:size,baseheight:size,shaperate:shaperate};
                            return box;
                        }
                    }
                    var width = module.startBox.width * ratewidth;
                    var height = module.startBox.height * rateheight;
                    var top = module.startBox.top + (1-rateheight)*rate.top* module.startBox.height;
                    var left = module.startBox.left + (1-ratewidth)*rate.left* module.startBox.width;

                    var box = {width:width,height:height,top:top,left:left,basewidth:module.startBox.width,baseheight: module.startBox.height,shaperate:{top:1,left:1,bottom:1,right:1}};
                    return box;
                }
                var getFullWidth = function(module,width){
                    if(module.shapeGroupId&&module.shapetype.indexOf("sevenpiece_sub")!=-1){
                        var seq = parseInt(module.shapetype.substring('sevenpiece_sub'.length));
                        var size = Sevenpiecepuzzle.getSize(width,seq);
                        return size;
                    }
                    return width;
                }
                var getFullHeight = function(module,height){
                    if(module.shapeGroupId&&module.shapetype.indexOf("sevenpiece_sub")!=-1){
                        var seq = parseInt(module.shapetype.substring('sevenpiece_sub'.length));
                        var size = Sevenpiecepuzzle.getSizeByHeight(height,seq);
                        return size;
                    }
                    return height;
                }
                //TODO 七巧板。。。。
                var fixResizeBox = function(box){
                    var rate = box;
                    var maxWidth = utils.stageSize.width-5;
                    var maxHeight = utils.stageSize.height-5;
                    for(var i=0;i<changeableProxys.length;i++){
                        var module = changeableProxys[i];
                        if(module.shapeGroupId) {
                            var source = groupIds[module.shapeGroupId];
                            if (source != module) {
                                var isSame = isOriginalPosition(source, module);
                                if (isSame) {
                                    //console.log("calculate seven shape in default position")
                                    continue;
                                }
                            }
                        }
                        var maxBox = calculageMaxBox(rate,module);
                        if(maxBox.left<0){
                            var width = isKeepRate(module) ? Math.min(box.width,box.height):box.width;
                            box.width = width+maxBox.left*maxBox.shaperate.left/maxBox.basewidth;
                         /*   if(module.shapeGroupId){
                                console.log("change width rate ",box.width,module.shapetype);
                            }*/
                            maxBox = calculageMaxBox(rate,module);
                        }
                        if(maxBox.left+maxBox.width>maxWidth){
                            /*if(module.shapeGroupId){
                                //console.log("change width rate ",module.shapetype);
                            }*/
                            var width = isKeepRate(module) ? Math.min(box.width,box.height):box.width;
                            box.width = width+(maxWidth-maxBox.left-maxBox.width)*maxBox.shaperate.right/maxBox.basewidth;
                            maxBox = calculageMaxBox(rate,module);
                        }
                        if(maxBox.top<0){
                          /*  if(module.shapeGroupId){
                                console.log("before change height rate ",box.height,box.width,module.shapetype);
                            }*/
                            var height = isKeepRate(module) ? Math.min(box.width,box.height):box.height;
                            box.height = height+maxBox.top*maxBox.shaperate.top/maxBox.baseheight;
                            maxBox = calculageMaxBox(rate,module);

                            /*if(module.shapeGroupId){
                                console.log("change height rate ",box.height,box.width,module.shapetype);
                            }*/
                        }
                        if(maxBox.top+maxBox.height>maxHeight){
                            var last = box.height;
                            var height = isKeepRate(module) ? Math.min(box.width,box.height):box.height;
                            box.height = height+(maxHeight-maxBox.top-maxBox.height)*maxBox.shaperate.bottom/maxBox.baseheight;
                            /*if(module.shapeGroupId){
                                //console.log("max box  ",JSON.stringify(maxBox));
                                //console.log("change height rate 2 ",JSON.stringify(box),fullheight);
                            }*/
                            maxBox = calculageMaxBox(rate,module);
                        }
                    }
                  /*  if(box.width<0||box.height<0){
                        console.log("box ",box.width,box.height);
                    }*/
                }
                var groupIds = {};
                var changeableProxys = [];
                function makeResizeProxy(box,cursor,sourcemodule,action){
                    if(!proxys.length){
                        groupIds = {};
                        if(sourcemodule){
                            if(sourcemodule.shapeGroupId){
                                if(!groupIds[sourcemodule.shapeGroupId]){
                                    proxys.push(sourcemodule);
                                    groupIds[sourcemodule.shapeGroupId]=sourcemodule;
                                }

                            }
                        }
                        for(var i=0;i<$scope.modules.length;i++){
                            if($scope.modules[i].selected){
                                var module = $scope.modules[i];
                                module.startBox=module.getBoxValue();
                                changeableProxys.push(module);
                                if(module.shapeGroupId){
                                    if(!groupIds[module.shapeGroupId]){
                                        proxys.push(module);
                                        groupIds[module.shapeGroupId]=module;
                                    }
                                }
                                else{
                                    proxys.push(module);
                                }
                            }
                        }
                        for(var i=0;i<$scope.modules.length;i++){
                            var module = $scope.modules[i];
                            if(module.shapeGroupId&&groupIds[module.shapeGroupId]){
                                module.startBox=module.getBoxValue();
                                changeableProxys.push(module);
                            }
                        }
                    }
                    var module = sourcemodule;
                    var rate = {
                        top:isTopChange(action) ? 1: 0,
                        left: isLeftChange(action) ?1 :0,
                        width: 1+box.width/module.startBox.width ,
                        height: 1+ box.height/module.startBox.height
                    };
                    if(rate.width<0){
                        rate.width = 20/module.startBox.width;
                    }
                    if(rate.height<0){
                        rate.height = 20/module.startBox.height;
                    }
                    fixResizeBox(rate);
                    for(var i=0;i<proxys.length;i++){
                        var proxy = proxys[i];
                        var ratewidth = rate.width;
                        var rateheight = rate.height;
                        if(proxy.template&&proxy.template.keep_rate){
                            ratewidth = rateheight = Math.min(ratewidth,rateheight);
                        }
                        var width = proxy.startBox.width *ratewidth;
                        var height = proxy.startBox.height * rateheight;
                        var top = proxy.startBox.top + (1-rateheight)*rate.top* proxy.startBox.height;
                        var left = proxy.startBox.left + (1-ratewidth)*rate.left* proxy.startBox.width;
                        //七巧板特殊处理
                        var _box = {top:top,left:left,width:width,height:height,rotate:module.rotate};
                        proxy.setBoxValue(_box);
                    }
                    for(var gid in groupIds){
                        var source = groupIds[gid];
                        fixSevenpiece($scope.modules,source,rate);
                    }
                    return rate;
                }

                var calculatePosition = function(box,type,module){
                    var seq = parseInt(type.substring('sevenpiece_sub'.length));
                    var size = Sevenpiecepuzzle.getSize(box.width,seq);
                    var base = Sevenpiecepuzzle.getBasePosition(box.top,box.left,size,seq);
                    var currentseq = parseInt(module.shapetype.substring('sevenpiece_sub'.length));
                    var position = Sevenpiecepuzzle.getPosition(base,size,currentseq);
                    //console.log("calculate posotion",JSON.stringify(base),JSON.stringify(size),"seq ",currentseq,"pos ",JSON.stringify(position));
                    return position;
                }
                var isOriginalPosition = function(source,module){
                    var box  = source.startBox;
                    var type = source.shapetype;
                    var position = calculatePosition(box,type,module);
                    if(Math.abs(position.left-parseFloat(module.startBox.left))<=2&&Math.abs(position.top-parseFloat(module.startBox.top))<=2){
                        return true;
                    }
                    return false;
                }


                var fixSevenpiece = function(modules,source,rate){
                    var newBox = source.getBoxValue();
                    for(var i=0;i<modules.length;i++){
                        var module = modules[i];
                        if(module.shapeGroupId == source.shapeGroupId && module!=source){
                            var isSame = isOriginalPosition(source,module);
                            if(isSame){
                                var position = calculatePosition(newBox,source.shapetype,module);
                                module.top = position.top;
                                module.left = position.left;
                            }
                            var ratenumber = Math.min(rate.width,rate.height);
                            module.width = module.startBox.width*ratenumber;
                            module.height = module.startBox.height*ratenumber;
                        }
                    }
                }



                var lastRate = null;
                ctrl.makeResizeProxy=function(box,cursor,module,action){
                    lastRate = makeResizeProxy(box,cursor,module,action);
                    lastBox=box;
                };
                var isSevenpiece =function(module){
                    return module.type == 'shape'&&module.shapetype&&module.shapetype.indexOf('sevenpiece_sub')!=-1;
                }
                ctrl.applyResizeLastProxy=function(resize,module,action){
                    cancelProxy();
                    lastRate = null;
                    lastBox=null;
                    groupIds={};
                };


                ctrl.applyLastProxy=function(resize,module){
                    if(lastBox){
                        var groupIds = [];
                        if(resize){
                            for(var i=0;i<$scope.modules.length;i++){
                                var module = $scope.modules[i];
                                if(module.selected&&module.shapeGroupId){
                                    groupIds.push(module.shapeGroupId);
                                }
                            }
                        }
                       var handledShapeGroup = {};
                       for(var i=0;i< $scope.modules.length;i++){
                           var module = $scope.modules[i];
                           if(module.selected||(module.shapeGroupId&&groupIds.indexOf(module.shapeGroupId)!=-1)){
                               module.changeBoxSize(lastBox,module.startBox);
                           }
                       }
                    }
                    cancelProxy();
                    lastBox=null;
                };
            }
        };
    }]);

});

