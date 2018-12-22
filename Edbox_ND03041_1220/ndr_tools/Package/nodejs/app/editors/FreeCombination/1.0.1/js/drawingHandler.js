define([
    'jquery',
    'angular','./utils.js','./shape/Sevenpiecepuzzle.js','./FcContext.js'],function(jquery,angular,utils,Sevenpiecepuzzle,context){



    return function($scope,$document,elementHandler,$timeout){
        var drawingStartLeft,drawingStartTop;
        $scope.drawing=false;
        var drawingModuleTemplate,drawingDefaultConfigs;
        function cleanDraw(){
            drawingModuleTemplate=null;
            drawingDefaultConfigs=null;
            $scope.drawing=false;
            $scope.drawingBox=null;
            $document.off('.drawModule');
            context.clean();
        }
        var fixInStageX = function(x){
            var position = drawingStartLeft +x;
            position = Math.min(Math.max(0,position),utils.stageSize.width);
            return position - drawingStartLeft;
        }
        var fixInStageY = function(y){
            var position = drawingStartTop +y;
            position = Math.min(Math.max(0,position),utils.stageSize.height);
            return position - drawingStartTop;
        }
        var applyOne = function(module,box){
            module.setBoxValue(angular.extend({rotate:0},box));
        }
        var applyDrawingBox = function(){
            if($scope.module){
                if($scope.module.length>0){
                    for(var i=0;i<$scope.module.length;i++){
                        if($scope.params&&$scope.params.shapetype=='sevenpiecepuzzle'){
                            var seq = Sevenpiecepuzzle.getSequence($scope.module[i].shapetype);
                            var box = Sevenpiecepuzzle.getBox($scope.drawingBox,seq);
                            applyOne($scope.module[i],box);
                        }
                        else{
                            applyOne($scope.module[i],$scope.drawingBox);
                        }
                    }

                }
                else{
                    applyOne($scope.module,$scope.drawingBox);
                }
            }
        }
        $scope.onDrawing=function($event){
            $event.preventDefault();
            $event.stopPropagation();
            if($event.dragType==0){
                $scope.drawingBox={
                    top:drawingStartTop=$event.offsetY,
                    left:drawingStartLeft=$event.offsetX,
                    width:0,
                    height:0
                };
                $scope.module = elementHandler.addNewElement(angular.extend($scope.params,$scope.drawingBox,{newCreate:true}));
                $timeout();
            }else if($event.dragType==1){
                var x=fixInStageX($event.moveX);
                var y=fixInStageY($event.moveY);
                if($scope.params.keepRate){
                    x = y = Math.max(x,y);
                }
                $scope.drawingBox.left=x<0?drawingStartLeft+x:drawingStartLeft;
                $scope.drawingBox.top=y<0?drawingStartTop+y:drawingStartTop;
                $scope.drawingBox.width=Math.abs(x);
                $scope.drawingBox.height=Math.abs(y);
                applyDrawingBox();
            }else if($event.dragType==-1){
                cleanDraw();
            }else if($event.dragType==2){
                if($scope.drawingBox.width<=0){
                    $scope.drawingBox.width = 200;
                }
                if($scope.drawingBox.height<=0){
                    $scope.drawingBox.height = 200;
                }
                applyDrawingBox();
                $scope.module = null;
                cleanDraw();
            }
        };
        return {
            startDraw:function(params){
                $scope.params = params;
                $scope.drawing=true;
                $document.on('keydown.drawModule',function(event){
                    if(event.keyCode==27){
                        event.preventDefault();
                        event.stopPropagation();
                        $scope.$apply(cleanDraw);
                    }
                });
            },
            cancelDraw:function(){
                cleanDraw();
            }
        }
    };
});

