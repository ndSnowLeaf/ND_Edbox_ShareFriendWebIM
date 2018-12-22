define([
    'jquery',
    'angular',
    '../utils.js',
    '../lib/striptags.js',
    './../fc_stage.js'],function(jquery,angular,utils,striptags){
    var module = angular.module("fcstage");

    module.directive('checkClipboardstatus',['$timeout','$document','$rootScope','$prompter','$pasteStatus',function($timeout,$document,$rootScope,$prompter,$pasteStatus){
        return {
            restrict:'AE',
            scope:{
                modules: "="
            },
            template:"<textarea></textarea>",
            controller:['$scope','$sce',function($scope,$sce){
                $rootScope.$on('checkClipboardStatus', function ($event,params) {
                    $scope.element[0].select();
                    try {
                        var successful = document.execCommand('paste');
                    } catch(err) {
                        console.log('Oops, unable to copy');
                    }
                });
            }],
            link:function($scope, $element, $attr){
                $scope.element = $($element).find("textarea");
                $scope.element.on("paste",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    var data =  event.originalEvent.clipboardData;
                    var types = data.types;
                    if(types.indexOf("Files")!=-1){
                        $pasteStatus.type = "image";
                        $pasteStatus.disabled = false;
                    }
                    else if(types.indexOf("text/html")!=-1){
                        $pasteStatus.type = "text";
                        $pasteStatus.disabled = false;
                    }
                    else if(types.indexOf("text/plain")!=-1){
                        var value = data.getData("text/plain");
                        try{
                            var json = JSON.parse(value);
                            //复制的是元素
                            if(json&&json.type=='copymodule'){
                                $pasteStatus.type = "image";
                            }
                            else{
                                $pasteStatus.type = "text";
                            }
                        }
                        catch(ex){
                            $pasteStatus.type = "text";
                        }
                        $pasteStatus.disabled = false;
                    }
                    else{
                        $pasteStatus.disabled = true;
                    }
                })
            }
        };
    }]);

});


