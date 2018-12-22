define([
    'jquery',
    'angular','./utils.js','./FcContext.js','../js/lib/ShapeBuilder.js'],function(jquery,angular,utils,context){



    return function($scope,$document,elementHandler){
        var drawingStartLeft,drawingStartTop;
        $scope.drawingline=false;
        $scope.linePoints= [];
        function cleanDraw(){
            $scope.drawingline=false;
            $scope.linePoints= [];
            $document.off('.lineDrawModule');
            context.clean();
        }

        var drawLine = function(){
            var box = utils.calculateBox($scope.linePoints);
            var points = utils.calculatePoints($scope.linePoints);
            var x0 = points[0][0];
            var y0 = points[0][1];
            var x1 = points[1][0];
            var y1 = points[1][1];
            $scope.lineshape.setShape($scope.shapetemplate.type=='line2' ? "line":$scope.shapetemplate.type)
                .fill("#fff")
                .stroke("#000")
                .line(x0,y0,x1,y1);
        }

        $scope.lineWrapperStyle = function(){
            var box = utils.calculateBox($scope.linePoints);
            return box;
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
        var fixLinePoints = function(target,source,shapetype){
            var x = source[0];
            var y = source[1];
            x = x+70;
            target[0]=x;
            target[1] =y;
        }
        var drawingStartLeft,drawingStartTop;
        $scope.onLineDrawing=function($event){
            $event.preventDefault();
            $event.stopPropagation();
            if($event.dragType==0){
                drawingStartTop=$event.offsetY,
                drawingStartLeft=$event.offsetX,
                $scope.linePoints.push([$event.offsetX,$event.offsetY]);
                $scope.linePoints.push([]);
            }else if($event.dragType==1){
                var x = fixInStageX($event.moveX);
                var y = fixInStageY($event.moveY);
                var lastPoint =$scope.linePoints[$scope.linePoints.length-1];
                $scope.linePoints[$scope.linePoints.length-1] = [drawingStartLeft+x,drawingStartTop+y];
                drawLine();
            }else if($event.dragType==-1){
                cleanDraw();
            }else if($event.dragType==2){
                if($scope.linePoints.length == 0 ||($scope.shapetemplate.maxpoints && $scope.shapetemplate.maxpoints > $scope.linePoints.length)){
                    if($scope.linePoints.length==0){
                        $scope.linePoints.push([$event.offsetX,$event.offsetY]);
                    }
                    $scope.linePoints.push([]);
                }
                else{
                    if($scope.linePoints[1].length ==0){
                        fixLinePoints($scope.linePoints[1],$scope.linePoints[0],$scope.params.shapetype);
                    }
                    var box = utils.calculateBox($scope.linePoints);
                    var points = utils.calculatePoints($scope.linePoints);
                    elementHandler.addNewElement(angular.extend($scope.params,box,{data:{points:points,"edgeColor": "#000", "fillColor": "#fff"}}));
                    cleanDraw();
                }
            }
        };
        return {
            startDraw:function(params,template){
                $scope.lineelement.find(".lineWrapper div").html("");
                $scope.lineshape = new ShapeBuilder($scope.lineelement.find(".lineWrapper div")[0]);
                $scope.params = params;
                $scope.drawingline=true;
                $scope.shapetemplate = template;
                $document.on('keydown.drawModule',function(event){
                    if(event.keyCode==27){
                        event.preventDefault();
                        event.stopPropagation();
                        $scope.$apply(cleanDraw);
                    }
                });
            }
        }
    };
});

