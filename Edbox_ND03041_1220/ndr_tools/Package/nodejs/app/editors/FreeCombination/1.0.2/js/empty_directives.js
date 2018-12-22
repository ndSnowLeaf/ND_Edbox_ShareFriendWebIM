define([
    'jquery',
    'angular',
    'text!./../tpl/html_tools.html'],function(jquery,angular,toolsTemplate){
    var module = angular.module("htmltools",[]);
    module.directive("htmlTools", [function(){
        return {
            restrict:'EA',
            replace:true,
            scope:{

            },
            template:toolsTemplate,
            controller:['$scope',function($scope){

            }],
            link : function($scope, element, attrs) {

            }
        };
    }]);
});

