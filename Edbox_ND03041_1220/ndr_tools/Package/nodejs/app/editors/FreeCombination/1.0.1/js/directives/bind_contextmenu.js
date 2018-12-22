define([
    'jquery',
    'angular',
     './../fc_stage.js'],function(jquery,angular){
    var module = angular.module("fcstage");

    module.directive('bindContextMenu',['$timeout','$document',function($timeout,$document){
        return {
            restrict:'AE',
            scope:false,
            link:function($scope, $element, $attr, slidesEditable){
                $($element).on("contextmenu",function(event){
                    $scope.$emit('cancelAllContextMenu',{});
                    $scope.$emit('checkClipboardStatus',{});
                    $scope.module.showcontextmenu = true;
                    event.stopPropagation();
                    event.preventDefault();
                    $timeout();
                });
            }
        };
    }]);

});


