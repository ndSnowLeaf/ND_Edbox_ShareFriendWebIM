define([
    'jquery',
    'angular',
     './../fc_stage.js'],function(jquery,angular){
    var module = angular.module("fcstage");

    module.directive('bindContextMenu',['$timeout','$document','$parse',function($timeout,$document,$parse){
        return {
            restrict:'AE',
            scope:false,
            link:function($scope, $element, $attr, slidesEditable){
                $($element).on("contextmenu",function(event){
                    var module = $parse($attr['bindContextMenu'])($scope);
                    if(module.type == 'group') return;
                    $scope.$emit('cancelAllContextMenu',{});
                    $scope.$emit('checkClipboardStatus',{});
                    module.showcontextmenu = true;
                    event.stopPropagation();
                    event.preventDefault();
                    $timeout();
                });
            }
        };
    }]);

});


