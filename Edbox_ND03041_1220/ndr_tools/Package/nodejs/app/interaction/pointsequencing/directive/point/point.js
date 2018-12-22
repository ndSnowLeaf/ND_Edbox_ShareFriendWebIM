/**
 * Created by px on 2015/6/9.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('point', [ "$filter",'$timeout', function ($filter,$timeout) {
        return {
            restrict:'AE',
            replace:true,
            templateUrl:'interaction/pointsequencing/directive/point/point.html',
            scope: {
                opt:'=',
                panel:'=',
                errorModel:'=',
                panelEvent:'='
            },
            controller:['$scope','$element','$compile','$timeout',function($scope,$element,$compile,$timeout){

                $('div.point',$element).draggable({
                    containment: "#pointsequencing-img",
                    start:function(event,ui){
                        $scope.$apply(function(){
                            $scope.info.opacity = 0.65;
                            $scope.info.lastPosition.x = $scope.opt.x;
                            $scope.info.lastPosition.y = $scope.opt.y;
                            $scope.panel.display = 'none';
                            $scope.exec.stopOtherPointEdit();
                        });
                    },
                    stop:function(event,ui){
                        $scope.$apply(function(){
                            $scope.info.opacity = 0.65;
                            $scope.opt.x = ui.position.left - $scope.panel.position.left;
                            $scope.opt.y = ui.position.top  - $scope.panel.position.top;
                            $scope.panelEvent.checkPointEdge($scope.opt);
                            $scope.panel.display = 'inline-block';
                            if($scope.panelEvent.checkPointOverlay($scope.opt)){
                                $timeout(function(){
                                    $scope.opt.x = $scope.info.lastPosition.x;
                                    $scope.opt.y = $scope.info.lastPosition.y;
                                },100);
                                return;
                            }
                            $scope.panelEvent.checkPointLegal();
                        });
                    }
                });

                $scope.opt.stopEdit = function(){
                    $scope.info.opacity = 0.65;
                    $scope.opt.contentEditable = false;
                    var $input = $('input.point-editor',$element);
                    if($input.length > 0){
                        $scope.opt.value = $input.val();
                        $input.remove();
                    }
                    $scope.panelEvent.updateShowValue();
                };
                $scope.info = {
                    opacity:0.65,
                    lastPosition:{
                        x:0,
                        y:0
                    }
                };
                $scope.exec = {};

                var lastValue = $scope.opt.value;

                $scope.exec.stopOtherPointEdit = function(){
                    $timeout(function(){
                        var i,len;
                        for(i=0,len=$scope.panel.points.length; i<len; i++){
                            if($scope.panel.points[i].contentEditable === true){
                                $scope.panel.points[i].stopEdit();
                            }
                        }
                    });
                };

                $scope.exec.mouseenter = function(){
                    $scope.panel.enterPoint = true;
                };

                $scope.exec.mouseleave = function(){
                    $scope.panel.enterPoint = false;
                };

                $scope.exec.select = function(event){
                    $scope.panelEvent.selectPoint($scope.opt);
                    event.stopPropagation();
                };

                $scope.exec.editValue = function(){
//                    console.log('editValue');
                    $scope.info.opacity = 1;
                    $scope.panelEvent.startEditPoint($scope.opt);
                    var value = $scope.opt.value;
                    var $input = $('<input class="point-editor" ng-model="opt.value" type="text" ng-style="{lineHeight:panel.pointSize.height+\'px\'}"'+
                    'style="position:relative;color: #bd1300;font-weight: 700;width: 100%;height: 100%;text-align: center;background-color: transparent;border: 0px"/>');
                    //$input.appendTo($('div.point',$element));

                    $compile($input)($scope).appendTo($('div.point',$element));

                    $input.get(0).addEventListener('change',function(){
                        var value = $input.val();
                        if(checkDuplicate(value)){
                            $input.val(lastValue);
                            $scope.errorModel.errorText = $filter('translate')('pointsequencing.pointvalue_duplicate');
                            $scope.errorModel.dismissErrorTip(1000);
                            $scope.$apply();
                            return;
                        }

                        if(checkNum(value)){//不能超过3个数字
                            if(value.length>3){
                                $input.val(lastValue);
                                $scope.errorModel.errorText = $filter('translate')('pointsequencing.input.error');
                                $scope.errorModel.dismissErrorTip(1000);
                                $scope.panelEvent.clearStatus();
                                $scope.$apply();
                                return;
                            }
                        }else if(checkChar(value)){//字母不能超过1个
                            if(value.length>1){
                                $input.val(value.substring(0,1));
                                $scope.errorModel.errorText = $filter('translate')('pointsequencing.input.error');
                                $scope.errorModel.dismissErrorTip(1000);
                                $scope.panelEvent.clearStatus();
                                $scope.$apply();
                                return;
                            }
                        }else if(checkChinese(value)){//汉字不能超过1个
                            if(value.length>1){
                                $input.val(lastValue);
                                $scope.errorModel.errorText = $filter('translate')('pointsequencing.input.error');
                                $scope.errorModel.dismissErrorTip(1000);
                                $scope.panelEvent.clearStatus();
                                $scope.$apply();
                                return;
                            }
                        }else{
                            if(value.length > 0){
                                $input.val(lastValue);
                                $scope.errorModel.errorText = $filter('translate')('pointsequencing.input.error');
                                $scope.errorModel.dismissErrorTip(1000);
                                $scope.panelEvent.clearStatus();
                                $scope.$apply();
                                return;
                            }
                        }

                        lastValue = value;
                    });

                    $input.bind('keypress',function(event){//监听回车键
                        if(event.keyCode == "13"){
                            $timeout(function(){
                                $scope.panelEvent.clearStatus();
                            });
                        }
                    });

                    //判断正整数
                    function checkNum(input) {
                        var re = /^[0-9]*$/;
                        return re.test(input);
                    }

                    function checkChar(input) {
                        var re = /^[A-Za-z]*$/;
                        return re.test(input);
                    }

                    function checkChinese(input){
                        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                        return reg.test(input);
                    }

                    function checkDuplicate(input){
                        var i,len;
                        for(i=0,len=$scope.panel.points.length; i<len; i++){
                            if($scope.panel.points[i] != $scope.opt && $scope.panel.points[i].value === input){
                                return true;
                            }
                        }
                        return false;
                    }


                    $input.focus();
                    //$input.val(value);
                };
            }]
        };
    }])

});