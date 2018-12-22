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
                ctrl.$element =$element;
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

                function makeProxy(box,cursor,module){
                    if(!proxys.length){
                        if(module&&module.group){
                            module.startBox=module.getBoxValue();
                            proxys.push(module);
                        }
                        else{
                            $scope.modules.each(function(m){
                                if(m.selected&& !m.group){
                                    m.startBox=m.getBoxValue();
                                    proxys.push(m);
                                }
                            });
                        }
                    }
                    //fixMoveBox(box);
                    if(!isNaN(box.rotateX) && !isNaN(box.rotateY)){
                        var offset = $element.offset();
                        var center = {x:0,y:0};
                        if(sourceModule.group){
                            center.x = sourceModule.group.left;
                            center.y = sourceModule.group.top;
                        }
                        var rotateCenterX=Math.round($stage.transform(offset.left,true)+sourceModule.startBox.left+(sourceModule.startBox.width/2+center.x));
                        var rotateCenterY=Math.round($stage.transform(offset.top,false)+sourceModule.startBox.top+(sourceModule.startBox.height/2+center.y));
                        var x=box.rotateX-rotateCenterX;
                        var y=-(box.rotateY-rotateCenterY);
                        var degree = -(Math.atan2(y,x)/Math.PI*180-90);
                        box.rotate=degree;
                    }
                    for(var i=0;i<proxys.length;i++){
                        var proxy = proxys[i];
                        proxy.changeBoxSize(box,sourceModule.startBox);
                    }
                }

                var lastBox;
                var sourceModule;
                ctrl.makeProxy=function(box,cursor,module){
                    if(module){
                        sourceModule = module;
                    }
                    makeProxy(box,cursor,module);
                    lastBox=box;
                };
                ctrl.cancelProxy=function(){
                    cancelProxy();
                    sourceModule = null;
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
                            maxBox = calculageMaxBox(rate,module);
                        }
                        if(maxBox.left+maxBox.width>maxWidth){
                            var width = isKeepRate(module) ? Math.min(box.width,box.height):box.width;
                            box.width = width+(maxWidth-maxBox.left-maxBox.width)*maxBox.shaperate.right/maxBox.basewidth;
                            maxBox = calculageMaxBox(rate,module);
                        }
                        if(maxBox.top<0){
                            var height = isKeepRate(module) ? Math.min(box.width,box.height):box.height;
                            box.height = height+maxBox.top*maxBox.shaperate.top/maxBox.baseheight;
                            maxBox = calculageMaxBox(rate,module);
                        }
                        if(maxBox.top+maxBox.height>maxHeight){
                            var last = box.height;
                            var height = isKeepRate(module) ? Math.min(box.width,box.height):box.height;
                            box.height = height+(maxHeight-maxBox.top-maxBox.height)*maxBox.shaperate.bottom/maxBox.baseheight;
                            maxBox = calculageMaxBox(rate,module);
                        }
                    }
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
                        if(sourcemodule.group){
                            sourcemodule.startBox=sourcemodule.getBoxValue();
                            proxys.push(sourcemodule);
                        }
                        else{
                            $scope.modules.each(function(module){
                                if(module.selected&&!module.group){
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
                            });
                            $scope.modules.each(function(module){
                                if(module.shapeGroupId&&groupIds[module.shapeGroupId]){
                                    module.startBox=module.getBoxValue();
                                    changeableProxys.push(module);
                                }
                            });
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
                    modules.each(function(module){
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
                    });
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
                            $scope.modules.each(function(module){
                                if(module.selected&&module.shapeGroupId){
                                    groupIds.push(module.shapeGroupId);
                                }
                            });
                        }
                        var handledShapeGroup = {};
                        for(var i=0;i<proxys.length;i++){
                            var m = proxys[i];
                            m.changeBoxSize(lastBox,module.startBox);
                        }
                    }
                    cancelProxy();
                    lastBox=null;
                };
            }
        };
    }]);

});

