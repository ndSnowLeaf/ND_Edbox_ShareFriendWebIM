define([
    'jquery',
    'angular',
    'text!./coursewareobject_page_module_box.html',
    '../utils.js',
    './../fc_stage.js',
    '../modules/modules_movehandler_creator.js',
    '../modules/modules_resizehandler_creator.js',
    '../modules/modules_rotatehandler_creator.js'],function(jquery,angular,template,utils,state,movehandlerCreator,resizehandlerCreator,rotatehandlerCreator){
    var module = angular.module("fcstage");


    module.directive('coursewareobjectPageModuleBox',['$resourceUrl','$stage',function($resourceUrl,$stage){
        return {
            restrict:'AE',
            template :template,
            replace:true,
            scope:{
                module : '=coursewareobjectPageModuleBox',
                modules:'=',
                onDelete:'&'
            },
            require:'^coursewareobjectPageStage',
            link:function($scope, $element, $attr, ctrl){
                $scope.stopPropagation = function($event){
                    $event.stopPropagation();
                }
                $scope.lockModule=function($event){
                    $scope.module.locked = !$scope.module.locked;
                    if($scope.module.type=='group'){
                        for(var i=0;i<$scope.module.children.length;i++){
                            var child = $scope.module.children[i];
                            child.locked = $scope.module.locked;
                        }
                    }
                    $event.stopPropagation();
                }
                $scope.deleteModule=function(){
                    $scope.modules.removeItem($scope.module);
                }
                $scope.changeIndex = function(type){
                    $scope.$emit('changeZindex', {action:type,module:$scope.module});
                }

                var movehandler = movehandlerCreator.create($scope.module,$scope.modules);
                var resizehandler = resizehandlerCreator.create($scope.module,$scope.modules);
                var rotatehandler = rotatehandlerCreator.create($scope.module,$scope.modules,ctrl.$element,$stage);
                //移动
                $scope.onDrag=function($event){
                    if($event.dragType==0){
                    }else if($event.dragType==1){
                        $scope.$emit('cancelAllContextMenu',{});
                        movehandler.change({
                            top:$event.moveY,
                            left:$event.moveX
                        });
                    }else if($event.dragType==-1){
                        movehandler.finish();
                    }else if($event.dragType==2){
                        movehandler.finish();
                    }
                };
                //旋转
                $scope.onRotate=function($event){
                    if($event.dragType==0){
                    }else if($event.dragType==1){
                        $scope.$emit('cancelAllContextMenu',{});
                        rotatehandler.change({
                            rotateX:$event.clientX+17,
                            rotateY:$event.clientY
                        });
                    }else if($event.dragType==-1){
                        rotatehandler.finish();
                    }else if($event.dragType==2){
                        rotatehandler.finish();
                    }
                };
                //大小变更
                var originalWidth,originalHeight;
                $scope.onResize=function($event,direction){
                    if($event.dragType==0){
                        originalWidth=$scope.module.width;
                        originalHeight=$scope.module.height;
                    }else if($event.dragType==1){
                        $scope.$emit('cancelAllContextMenu',{});
                        var lockScale=($event.shiftKey && direction.length==2)|| ($scope.module.template&&$scope.module.template.keep_rate==1);
                        resizehandler.change({moveX:$event.moveX,moveY:$event.moveY,lockScale:lockScale},direction,$scope.module);

                    }else if($event.dragType==-1){
                        resizehandler.finish();
                    }else if($event.dragType==2){
                        resizehandler.finish();
                    }
                }

                //线段旋转，重新计算旋转图标
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

            }
        };
    }]);

});

