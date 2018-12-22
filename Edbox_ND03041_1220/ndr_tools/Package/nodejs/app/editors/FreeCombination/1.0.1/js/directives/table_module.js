define([
    'jquery',
    'angular',
    'text!./table_module.html',
    './../fc_stage.js'],function(jquery,angular,template){
    var module = angular.module("fcstage");
    module.directive('tableModule',[function(){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            require:'?slidesEditable',
            scope:{
                module : '=tableModule'
            },
            controller:['$scope',function($scope){
                this.getModule=function(){
                    return $scope.module;
                };
                $scope.setCurrentEditor = function($event,type){
                    $scope.$emit('changeEditableType', {type:type});

                };
            }],
            link:function($scope, $element, $attr, slidesEditable){

            }
        };
    }]);
});

