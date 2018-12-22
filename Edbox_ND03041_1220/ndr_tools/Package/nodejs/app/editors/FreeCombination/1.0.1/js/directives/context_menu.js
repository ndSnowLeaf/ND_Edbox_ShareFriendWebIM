define([
    'jquery',
    'angular',
    'text!./context_menu.html',
    '../utils.js',
    './../fc_stage.js'],function(jquery,angular,template,utils){
    var module = angular.module("fcstage");

    module.directive('contextMenu',['$timeout','$stage',function($timeout,$stage){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            scope:{
                module : '=module',
                modules:'=',
                type:'@'
            },
            controller:['$scope','$document','$rootScope','$pasteStatus',function($scope,$document,$rootScope,$pasteStatus){
                $scope.lessThanOne = function(){
                    var count = 0;
                    for(var i=0;$scope.modules&&i<$scope.modules.length;i++){
                        if($scope.modules[i].selected){
                            count++;
                        }
                    }
                    return count<=1;
                }
                $scope.canGroup = function(){
                    var count = 0;
                    var lockCount = 0;
                    var unLockCount = 0;
                    for(var i=0;$scope.modules&&i<$scope.modules.length;i++){
                        if($scope.modules[i].selected){
                            count++;
                            if($scope.modules[i].locked){
                                lockCount++;
                            }
                            else{
                                unLockCount++;
                            }
                        }
                    }
                    return count>1&&!(lockCount>0&&unLockCount>0);
                }

                $scope.canGroupIntern = function(){                    ;
                    var lastGroup = null;
                    for(var i=0;$scope.modules&&i<$scope.modules.length;i++){
                        if($scope.modules[i].selected){
                            if(!$scope.modules[i].group){
                                return true;
                            }
                            if(lastGroup&&$scope.modules[i].group!=lastGroup){
                                return true;
                            }
                            else{
                                lastGroup = $scope.modules[i].group;
                            }
                        }
                    }
                    return false;
                }
                $scope.cantGroupIntern = function(){
                    var lastGroup = null;
                    for(var i=0;$scope.modules&&i<$scope.modules.length;i++){
                        if($scope.modules[i].selected){
                            if($scope.modules[i].group){
                                return true;
                            }
                        }
                    }
                    return false;
                }
                $scope.pastestatus = $pasteStatus;
                var hideContextMenu = function(){
                    if($scope.module){
                        $scope.module.showcontextmenu = false;
                    }
                    $scope.show = false;
                }
                $rootScope.$on('cancelAllContextMenu', function ($event,params) {
                   $scope.show = false;
                    $timeout();
                });
                $scope.colors1 = [1,2,3,4,5,6,7,8,9,10];
                $scope.colors2 = [11,12,13,14,15,16,17,18,19,20];

                $scope.selectColor=function($event,type){
                    var color =  $($event.currentTarget).css("background-color");
                    $scope.$emit('changeShapeColor', {type:type,color:color,module:$scope.module});
                    hideContextMenu();
                }
                $scope.cut = function(){
                    $scope.$emit('cut', {module:$scope.module});
                    hideContextMenu();
                }
                $scope.copy = function(){
                    $scope.$emit('copy', {module:$scope.module});
                    hideContextMenu();
                }

                $scope.paste = function(type,$event){
                    $scope.$emit('paste', {module:$scope.module,type:type});
                    hideContextMenu();
                    $event.stopPropagation();
                    $event.preventDefault();
                }

                $scope.group = function(){
                    $scope.$emit('group', {module:$scope.module});
                    hideContextMenu();
                }

                $scope.ungroup = function(){
                    $scope.$emit('ungroup', {module:$scope.module});
                    hideContextMenu();
                }
                $scope.changeZindex = function(type){
                    $scope.$emit('changeZindex', {module:$scope.module,action:type});
                    hideContextMenu();
                }
                $scope.wrapperStyle = function(){
                    if($scope.type == 'container'){
                        return $scope.containerStyle;
                    }
                    var left = $scope.module.width+$scope.module.left+5;//utils.stageSize.width-$scope.module.left-$scope.module.width
                    var top = $scope.module.top;
                    return $scope.fix(top,left)
                };
                $scope.fix = function(top,left){
                    var full = {
                        width: 1200,
                        height: 600
                    }
                    var menu = $scope.module&&$scope.module.type == 'shape' ?{width:508,height:486}:!$scope.module ? {width:220,height:120}:{width:426,height:379};
                    left = Math.min(left,full.width-menu.width);
                    top = Math.min(top,full.height-menu.height);
                    if($scope.module){
                        top = top-$scope.module.top;
                        left = left -$scope.module.left;
                    }
                    if($scope.module&&$scope.module.type == 'shape'){
                        top = top+96;
                    }

                    return {top:top+"px",left:left+"px"};
                }


            }],
            link:function($scope, $element, $attr, slidesEditable){
                $($element).on("mousedown",function(event){
                    event.stopPropagation();
                });
                $($element).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                });
                if($scope.type == 'container'){
                    $($element).parent("._stage").on("contextmenu",function(event){
                        $scope.$emit('cancelAllContextMenu',{});
                        $scope.$emit('checkClipboardStatus',{});
                        event.stopPropagation();
                        event.preventDefault();
                        $scope.show = true;
                        $stage.fixScale(event);
                        var clientx = event.clientX+5;
                        var clienty = event.clientY;
                        var x = $($element).parent("._stage").offset().left;
                        var y = $($element).parent("._stage").offset().top;
                        var top = clienty-y;
                        var left =clientx-x;

                        $scope.containerStyle =  $scope.fix(top,left);
                        $timeout();
                    });

                }
            }
        };
    }]);

});

