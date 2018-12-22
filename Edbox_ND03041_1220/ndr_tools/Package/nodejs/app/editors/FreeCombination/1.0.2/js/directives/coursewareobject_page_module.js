define([
    'jquery',
    'angular',
    'text!./coursewareobject_page_module.html', './../fc_stage.js'],function(jquery,angular,template){
    var module = angular.module("fcstage");

    module.directive('coursewareobjectPageModule',function(){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            require:'?slidesEditable',
            scope:{
                module : '=coursewareobjectPageModule',
                modules:'='
            },
            controller:['$scope',function($scope){
                this.getModule=function(){
                    return $scope.module;
                };
            }],
            link:function($scope, $element, $attr, slidesEditable){
                if(slidesEditable){
                    slidesEditable.bind('module',$scope.module);
                    slidesEditable.onFocus(function(){
                        $scope.editable=true;
                        $scope.module.focusModule();
                    });
                    slidesEditable.onBlur(function(){
                        $scope.editable=false;
                        $scope.module.unfocus();
                    });
                }
            }
        };
    });

});

