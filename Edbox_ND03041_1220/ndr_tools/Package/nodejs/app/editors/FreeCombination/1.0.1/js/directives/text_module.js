define([
    'jquery',
    'angular',
    'text!./text_module.html',
    './ckeditor_copyable.js',
    './../fc_stage.js'
    ],function(jquery,angular,template,ckeditor_copyable){
    var module = angular.module("fcstage");
    module.directive('textModule',[function(){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            require:'?slidesEditable',
            scope:{
                module : '=textModule'
            },
            controller:['$scope',function($scope){
                this.getModule=function(){
                    return $scope.module;
                };
                $scope.setCurrentEditor = function($event,type){
                    $scope.$emit('changeEditableType', {type:type});
                };
                ckeditor_copyable($scope);

            }],
            link:function($scope, $element, $attr, slidesEditable){

            }
        };
    }]);
});

