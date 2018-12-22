define([
    'jquery',
    'angular',
    'text!./shape_module.html',
    'snap',
    '../utils.js',
    './ckeditor_copyable.js',
    '../shape/Sevenpiecepuzzle.js',
    './../fc_stage.js'],function(jquery,angular,template,snap,utils,ckeditor_copyable,Sevenpiecepuzzle){
    var module = angular.module("fcstage");
    module.directive('shapeModule',['$timeout',function($timeout){
        return {
            restrict:'AE',
            template:template,
            replace:true,
            require:'?slidesEditable',
            scope:{
                module : '=shapeModule',
                modules: '='
            },
            controller:['$scope','$rootScope',function($scope,$rootScope){
                var calculatePosition = function(box,type){
                    var seq = parseInt(type.substring('sevenpiece_sub'.length));
                    var size = Sevenpiecepuzzle.getSize(box.width,seq);
                    var base = Sevenpiecepuzzle.getBasePosition(box.top,box.left,size,seq);
                    var currentseq = parseInt($scope.module.shapetype.substring('sevenpiece_sub'.length));
                    var position = Sevenpiecepuzzle.getPosition(base,size,currentseq);
                    return position;
                }
                var isOriginalPosition = function(box,type){
                    var position = calculatePosition(box,type);
                    if(Math.abs(position.left-parseFloat($scope.module.left))<=2&&Math.abs(position.top-parseFloat($scope.module.top))<=2){
                        return true;
                    }
                    return false;
                }
                $rootScope.$on("sevenpiece_position_change",function($event,params){
                    if($scope.module&&$scope.module.type=='shape'&&$scope.module.shapetype.indexOf('sevenpiece_sub')!=-1){
                        var isSame = isOriginalPosition(params.oldbox,params.type);
                        if(isSame){
                            var position = calculatePosition(params.newbox,params.type);
                            $scope.module.top = position.top;
                            $scope.module.left = position.left;
                        }
                    }
                });
                $rootScope.$on('changeShapeColor', function ($event,params) {
                    var isSelected = false;
                    if(params.module){
                        isSelected = params.module==$scope.module;
                    }
                    else if($scope.module.isSelected()){
                        isSelected = true;
                    }
                    else if($scope.module.group&&$scope.module.group.isSelected()){
                        isSelected = true;
                    }
                    if(isSelected){
                        if(params.type == 'shape_border'){
                            $scope.module.data.edgeColor = params.color;
                        }
                        else{
                            $scope.module.data.fillColor = params.color;
                        }
                    }
                });
                var copy = function(target,source){
                    for(var i=0;i<source.length;i++){
                        target[i][0] = source[i][0];
                        target[i][1] = source[i][1];
                    }
                }

                //直线部分需要重绘
                $scope.drawShape =function(){
                    if(!$scope.module.template.line){
                        return;
                    }
                    var box = utils.calculateBox($scope.module.data.points);
                    copy($scope.module.data.points,utils.calculatePoints($scope.module.data.points));
                    $scope.module.width = box.width;
                    $scope.module.height = box.height;
                    $scope.module.left = $scope.module.left + box.left;
                    $scope.module.top = $scope.module.top + box.top;
                    $scope.$emit("shape_point_change",box);
                }
                this.getModule=function(){
                    return $scope.module;
                };
                $scope.setCurrentEditorIfNoText = function($event,type){
                    if($scope.module&&$scope.module.template&&$scope.module.template.disable_text){
                        $scope.setCurrentEditor($event,type);
                    }
                }
                $scope.setCurrentEditor = function($event,type){
                    $scope.$emit('changeEditableType', {type:type});
                };
                ckeditor_copyable($scope);
                $scope.needConfirmToFix = function(){
                    if($scope.module&&$scope.module.width*2>utils.stageSize.width&&$scope.module.height*2>utils.stageSize.height&&!$scope.module.locked){
                        return true;
                    }
                    return false;
                }



            }],
            link:function($scope, $element, $attr, slidesEditable){

            }
        };
    }]);
});

