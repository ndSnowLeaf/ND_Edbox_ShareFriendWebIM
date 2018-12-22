define([
    'jquery',
    'angular',
    'text!./title_attachment.html',
    'i18n!',
    './../fc_stage.js'],function(jquery,angular,template,i18n){
    var module = angular.module("fcstage");

    module.directive('titleAttachment',['$timeout','$prompter','$rootScope',function($timeout,$prompter,$rootScope){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            scope:{
                items : '=titleAttachment'
            },
            controller:['$scope',function($scope){
                $rootScope.$on('addAttachment', function ($event,params) {
                    params.newCreate = true;
                    $scope.items.push(params);
                    $timeout();
                });
                $rootScope.$on('priview', function ($event,params) {
                    $scope.startPreivew = false;
                    $timeout();
                });


                $scope.showattachments= true;
                var resetIndex = function(array){
                    for(var i=0;i<array.length;i++){
                        array[i].index = i;
                    }
                };
                $scope.filterTable=function(html){
                    if(!html||html.indexOf("table")==-1){
                        return html;
                    }
                    var table =$(html);
                    table.width("98%");
                    table.height("98%");
                    return $("<div></div>").append(table).html();
                }
                $scope.setCurrentEditor=function($event,type){
                    $scope.$emit('changeEditableType', {type:type});
                }

                $scope.showAttachment = function(){
                    $scope.showattachments = true;
                }
                $scope.hideAttachment = function(){
                    $scope.showattachments = false;
                    $scope.startPreivew = false;
                    $scope.$emit('changeEditableType', {type:'stage'});
                }
                $scope.currentindex = 0;
                $scope.$watch("items.length",function(){
                    resetIndex($scope.items);
                    var find = false;
                    for(var i=0;i<$scope.items.length;i++){
                        if($scope.items[i].newCreate){
                            $scope.current = $scope.items[i];
                            $scope.startIndex = $scope.current.index;
                            $scope.items[i].newCreate = false;
                        }
                    }
                    $scope.showattachments = true;
                });
                if(!$scope.current&&$scope.items.length>0){
                    $scope.current = $scope.items[0];
                }
                resetIndex($scope.items);
                $scope.select=function(item){
                    $scope.current = item;
                    $scope.startIndex = $scope.current.index;
                };
                $scope.previous =function(){
                    var prevIndex = $scope.startIndex-$scope.maxCount;
                    if(prevIndex>=0){
                        $scope.startIndex = prevIndex;
                        return;
                    }
                    else{
                        $scope.startIndex = 0;
                        return;
                    }
                };
                $scope.next =function(){
                    var nextIndex = $scope.startIndex+$scope.maxCount;
                    if(nextIndex<$scope.items.length){
                        $scope.startIndex = nextIndex;
                    }
                    else{
                        $scope.startIndex = $scope.items.length-1;
                    }
                };
                $scope.hasPrev = function(){
                    return $scope.startIndex>=$scope.maxCount
                }
                $scope.hasNext = function(){
                    var page = Math.floor($scope.startIndex / $scope.maxCount)+1;
                    var index = page*$scope.maxCount;
                    return $scope.items.length > index;
                }
                $scope.deleteItem=function(item){
                    $prompter.confirm(i18n.translate("common.confirm.delete"),function(){
                        var index = $scope.items.indexOf(item);
                        if(index!=-1){
                            var del = $scope.items.splice(index,1);
                            if($scope.current == del[0]){
                                if(index<$scope.items.length){
                                    $scope.current = $scope.items[index];
                                }
                                else if(index-1<$scope.items.length){
                                    $scope.current = $scope.items[index-1];
                                }
                                else{
                                    $scope.current = null;
                                }
                            }
                            resetIndex($scope.items);
                        }
                    });
                };
                $scope.hidePreview = function(){
                    $scope.startPreivew = false;
                }
                $scope.changeStartIndex =function(step){
                    if($scope.startIndex+step>=0&&$scope.startIndex+step<$scope.items.length){
                        $scope.startIndex = $scope.startIndex+step;
                        $scope.current = $scope.items[$scope.startIndex];
                    }
                }
                $scope.preview =function(item){
                    $scope.startPreivew = true;
                };
                $scope.getPreviewUrl=function(){
                    var type = $scope.current.type;
                    var suffix = type=='video' ? 'mp4' : 'mp3';
                    var src = $scope.current.url;
                    if(src.indexOf("?")==-1){
                        src = src+"?."+suffix;
                    }
                    else{
                        src = src+"&."+suffix;
                    }
                    return "/editor/basic-question/player.html?mediaUrl="+encodeURIComponent(src)+"&nospace=true";
                    //return $sce.trustAsResourceUrl("/editor/basic-question/player.html?mediaUrl="+encodeURIComponent(src));
                };
            }],
            link:function($scope, $element, $attr, slidesEditable){
                $($element).on("mousedown",function(event){
                    $scope.$emit('changeEditableType', {type:'title'});
                    event.stopPropagation();
                })
                $scope.startIndex = 0;
                var itemWidth = 192;
                $scope.$watch(function(){
                    return  $($element).width();
                },function(){
                    $timeout(function(){
                        $scope.changeElementWidth();
                    });
                });
                $scope.changeElementWidth = function(){
                    var width = $($element).width();
                    $scope.maxCount = Math.floor(width/itemWidth);
                    return $scope.maxCount;
                }
                $scope.inRange = function(item){
                    var page = Math.floor($scope.startIndex / $scope.maxCount)+1;
                    var index = item.index;
                    var max = Math.min($scope.items.length,page*$scope.maxCount);
                    if(index>=max-$scope.maxCount&&index<max){
                        return true;
                    }
                    return false;
                }
                $timeout(function(){
                    $scope.changeElementWidth();
                });
            }
        };
    }]);

});

