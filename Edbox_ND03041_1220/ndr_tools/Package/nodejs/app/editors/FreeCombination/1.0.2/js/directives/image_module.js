define([
    'jquery',
    'angular',
    'text!./image_module.html',
    './../fc_stage.js','../utils.js'],function(jquery,angular,template,stage,utils){
    var module = angular.module("fcstage");
    module.directive('imageModule',[function(){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            require:'?slidesEditable',
            scope:{
                module : '=imageModule',
                modules:'='
            },
            controller:['$scope',function($scope){
                this.getModule=function(){
                    return $scope.module;
                };
                $scope.setCurrentEditor = function($event,type){
                    $event.hasChangeType = true;
                    $scope.$emit('changeEditableType', {type:type});
                };
                $scope.needConfirmToFix = function(){
                    if($scope.module&&$scope.module.width*2>utils.stageSize.width&&$scope.module.height*2>utils.stageSize.height&&!$scope.module.locked){
                        return true;
                    }
                    return false;
                }

            }],
            link:function($scope, $element, $attr, slidesEditable){
            }
        };
    }]);
});

