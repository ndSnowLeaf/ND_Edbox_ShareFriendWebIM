define([
    'jquery',
    'angular',
    './../utils.js',
    '../lib/ShapeBuilder.js',
    './../fc_stage.js'],function(jquery,angular,utils){
    var module = angular.module("fcstage");
    module.directive('drawShape',[function(){
        return {
            restrict:'AE',
            replace:false,
            require:'?slidesEditable',
            scope:{
                module : '=drawShape'
            },
            controller:['$scope',function($scope){
                var formatType = function(type){
                    if(type=='line2'){
                        return "line";
                    }
                    return type;
                }
                var  drawShape = function(){
                    try{
                        if(!$scope.module||$scope.module.width<0||$scope.module.height<0){
                            return;
                        }
                        var template = utils.findTemplate($scope.module.shapetype);
                        var shape = $scope.shape.setSize(parseFloat($scope.module.width),parseFloat($scope.module.height))
                            .setShape(formatType($scope.module.shapetype))
                            .fill($scope.module.data.fillColor||"#fff")
                            .stroke($scope.module.data.edgeColor ||"#000");
                        if(template.line == true){
                            var points = $scope.module.data.points;
                            var x0 = points[0][0];
                            var y0 = points[0][1];
                            var x1 = points[1][0];
                            var y1 = points[1][1];
                            shape.line(x0,y0,x1,y1);
                        }
                    }catch(ex){
                        //console.log(ex);
                    }
                };
                $scope.$watch("module",function(newModule,oldModule){
                    drawShape();
                });
                $scope.$watchGroup(["module.width","module.height","module.data.edgeColor","module.data.fillColor","module.sequence"],function(){
                    drawShape();
                });

            }],
            link:function($scope, $element, $attr, slidesEditable){
                $scope.shape = new ShapeBuilder($($element)[0]);
            }
        };
    }]);
});

