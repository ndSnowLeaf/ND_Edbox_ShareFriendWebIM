define([
    'jquery',
    'angular',
    'text!./coursewareobject_page_module_box.html','../utils.js', './../fc_stage.js'],function(jquery,angular,template,utils){
    var module = angular.module("fcstage");


    module.directive('coursewareobjectPageModuleBox',['$resourceUrl',function($resourceUrl){
        return {
            restrict:'AE',
            template :template,
            replace:true,
            scope:{
                module : '=coursewareobjectPageModuleBox',
                onDelete:'&'
            },
            require:'^coursewareobjectPageStage',
            link:function($scope, $element, $attr, ctrl){
                $scope.lockModule=function(){
                    $scope.module.locked = !$scope.module.locked;
                }
                $scope.deleteModule=function(){
                    $scope.onDelete({module:$scope.module});
                }
                $scope.changeIndex = function(type){
                    $scope.$emit('changeZindex', {action:type,module:$scope.module});
                }

                $scope.onDrag=function($event){
                    if($event.dragType==0){
                    }else if($event.dragType==1){
                        ctrl.makeProxy({
                            top:utils.zoomSize($event.moveY),
                            left:utils.zoomSize($event.moveX)
                        },'move');
                    }else if($event.dragType==-1){
                        ctrl.cancelProxy();
                    }else if($event.dragType==2){
                        ctrl.applyLastProxy(false);
                    }
                };
                var originalWidth,originalHeight;
                $scope.onResize=function($event,direction){
                    if($event.dragType==0){
                        originalWidth=$element.parent().width();
                        originalHeight=$element.parent().height();
                    }else if($event.dragType==1){
                        var top=0,left=0,width=0,height=0;
                        var lockScale=$event.shiftKey && direction.length==2,
                            lockCenter=$event.ctrlKey;
                        var moveX=utils.zoomSize($event.moveX),
                            moveY=utils.zoomSize($event.moveY);
                        switch(direction){
                            case 'n':
                                top=-1;
                                height=-moveY;
                                break;
                            case 'nw':
                                top=-1;
                                left=-1;
                                height=-moveY;
                                width=-moveX;
                                break;
                            case 'ne':
                                top=-1;
                                height=-moveY;
                                width=moveX;
                                break;
                            case 's':
                                height=moveY;
                                break;
                            case 'sw':
                                left=-1;
                                height=moveY;
                                width=-moveX;
                                break;
                            case 'se':
                                height=moveY;
                                width=moveX;
                                break;
                            case 'w':
                                left=-1;
                                width=-moveX;
                                break;
                            case 'e':
                                width=moveX;
                                break;
                        }

                        if(lockCenter){
                            top=left=-0.5;
                            height*=2;
                            width*=2;
                        }
                        if(originalWidth+width<20){
                            width=20-originalWidth;
                        }
                        if(originalHeight+height<20){
                            height=20-originalHeight;
                        }
                        if(lockScale){
                            if(width>height){
                                var scale=originalHeight/originalWidth;
                                height=Math.round(width*scale);
                            }else{
                                var scale=originalWidth/originalHeight;
                                width=Math.round(height*scale);
                            }
                        }
                        if($scope.module.template&&$scope.module.template.keep_rate){
                            var rate = $scope.module.width/$scope.module.height;
                            width = Math.min(width,height*rate);
                            height = Math.min(height,width/rate);
                        }

                        top=top*height;
                        left=left*width;
                        ctrl.makeResizeProxy({
                            top:top,
                            left:left,
                            width:width,
                            height:height
                        },'crosshair',$scope.module,direction);
                    }else if($event.dragType==-1){
                        ctrl.cancelProxy();
                    }else if($event.dragType==2){
                        ctrl.applyResizeLastProxy(true,$scope.module,direction);
                    }
                };
                $scope.rotateStyle =function(module){
                    if(module.type == 'shape'&&module.template&&module.template.line){
                        var x= module.height;
                        var y= module.width;

                        var x0 = module.data.points[0][0];
                        var y0 = module.data.points[0][1];
                        var x1 = module.data.points[1][0];
                        var y1 = module.data.points[1][1];
                        if(x0>x1){
                            y = y*-1.0;
                        }
                        if(y0>=y1){
                            x = x*-1.0;
                        }
                        var a = Math.atan2(y,x);
                        var rotate = -(Math.atan2(y,x)/Math.PI*180-90);
                        return {
                            top: module.height/2-25*Math.sin(a),
                            left: module.width/2+25*Math.cos(a),
                            transform: 'rotate('+rotate+'deg)'
                        }
                    }
                    return {};
                }
                $scope.onRotate=function($event){
                    if($event.dragType==0){
                    }else if($event.dragType==1){
                        ctrl.makeProxy({
                            rotateX:$event.clientX,
                            rotateY:$event.clientY
                        },'url('+$resourceUrl('rotate.cur')+'),move',$scope.module,'rotate');
                    }else if($event.dragType==-1){
                        ctrl.cancelProxy();
                    }else if($event.dragType==2){
                        ctrl.applyLastProxy(false,$scope.module);
                    }
                };
            }
        };
    }]);

});

