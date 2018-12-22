define([
    'jquery',
    'angular','../utils.js','../modules/modules_movehandler_creator.js', './../fc_stage.js'],function(jquery,angular,utils,movehandlerCreator){
    var module = angular.module("fcstage");
    module.directive('pageModuleDraggable',['$document','$timeout','$stage',function($document,$timeout,$stage){
        return {
            restrict:'A',
            require:'^coursewareobjectPageStage',
            link:function($scope, $element, $attr, ctrl){
                var movehandler = movehandlerCreator.create($scope.module,$scope.modules);
                var selected = false;
                $scope.onDrag=function($event){
                    if($event.dragType==0){
                        selected = $scope.module.selected
                        if(!selected){
                            $scope.modules.handleSelectEvent($event,$scope.module,true);
                        }
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
                        //点击事件
                        if($event.moveY<2&&$event.moveX<2){
                            if(selected){
                                $scope.modules.handleSelectEvent($event,$scope.module);
                            }
                        }
                    }
                };
            }
        };
    }]);
});

