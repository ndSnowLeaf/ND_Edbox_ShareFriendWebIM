define([
    'jquery',
    'angular',
    'text!./shape_point.html',
    'snap',
    '../utils.js',
    './ckeditor_copyable.js',
    './../fc_stage.js'],function(jquery,angular,template,snap,utils,ckeditor_copyable){
    var module = angular.module("fcstage");
    module.directive('shapePoint',[function(){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            scope:{
                point : '=shapePoint',
                module:'=',
                draw:"&"
            },
            controller:['$scope','$rootScope',function($scope,$rootScope){
                var drawingStartLeft,drawingStartTop;
                var lastx,lasty;
                var draw = function(){
                    drawingStartLeft = drawingStartTop = null;
                    lastx = lasty = null;
                    $scope.draw();
                    //console.log(JSON.stringify($scope.point));
                }
                $rootScope.$on('shape_point_change', function ($event,box) {
                    lastx = lastx-box.left;
                    lasty = lasty-box.top;
                    drawingStartLeft = drawingStartLeft-box.left;
                    drawingStartTop = drawingStartTop-box.top;
                });
                $scope.drag=function($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    if($event.dragType==0){
                        lastx = $scope.point[0];
                        lasty = $scope.point[1];
                        drawingStartTop=lasty;
                        drawingStartLeft=lastx;
                    }else if($event.dragType==1){
                        var x=utils.zoomSize($event.moveX);
                        var y=utils.zoomSize($event.moveY);
                        $scope.point[0] = drawingStartLeft+x;
                        $scope.point[1] = drawingStartTop+y;
                        $scope.draw();
                    }else if($event.dragType==-1){
                        $scope.point[0] = lastx;
                        $scope.point[1] = lasty;
                        draw();
                    }else if($event.dragType==2){
                        draw();

                    }
                };
                $scope.pointStyle =function(){
                    return {
                        top: $scope.point[1]-5,
                        left: $scope.point[0]-5
                    }
                }
            }],
            link:function($scope, $element, $attr, slidesEditable){

            }
        };
    }]);
});

