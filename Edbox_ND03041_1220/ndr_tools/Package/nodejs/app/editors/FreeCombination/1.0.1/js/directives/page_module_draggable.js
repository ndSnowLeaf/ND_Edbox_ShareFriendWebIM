define([
    'jquery',
    'angular','../utils.js', './../fc_stage.js'],function(jquery,angular,utils){
    var module = angular.module("fcstage");
    module.directive('pageModuleDraggable',['$document','$timeout','$stage',function($document,$timeout,$stage){
        return {
            restrict:'A',
            require:'^coursewareobjectPageStage',
            link:function($scope, $element, $attr, ctrl){
                var x,y,startX,startY,startMove;
                function handleEvent(event,dragType){
                    event.startX=startX;
                    event.startY=startY;
                    event.moveX=event.clientX-startX;
                    event.moveY=event.clientY-startY;
                    event.incrementX=event.clientX-x;
                    event.incrementY=event.clientY-y;
                    event.dragType=dragType;
                    if(dragType==0){
                        startMove=true;
                    }else if(dragType==1){
                        if(startMove && Math.abs(event.moveX)<2 && Math.abs(event.moveY)<2){
                            return;
                        }
                        startMove=false;
                        ctrl.makeProxy({
                            top:event.moveY,
                            left:event.moveX
                        },'move');
                    }else if(dragType==-1){
                        ctrl.cancelProxy();
                    }else if(dragType==2){
                        ctrl.applyLastProxy();
                    }
                    $timeout();
                }
                $element.on('mousedown',function(event){
                    var stage = $stage.getStage();

                    $stage.fixScale(event);
                    if(event.button!=0){
                        return;
                    }
                    x=startX=event.clientX;
                    y=startY=event.clientY;
                    handleEvent(event,0);
                    $($document).on('mousemove.move',function(event){
                        $stage.fixScale(event);
                        if(event.button!=0){
                            $document.off('.move');
                            handleEvent(event,-1);
                            return;
                        }
                        handleEvent(event,1);
                        x=event.clientX;
                        y=event.clientY;
                        event.preventDefault();
                        event.stopPropagation();
                    }).on('mouseup.move',function(event){
                        $stage.fixScale(event);
                        $($document).off('.move');
                        handleEvent(event,2);
                        event.preventDefault();
                        event.stopPropagation();
                    }).on('keydown.move',function(event){
                        $stage.fixScale(event);
                        if(event.keyCode==27){
                            $($document).off('.move');
                            handleEvent(event,-1);
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    });
                });
            }
        };
    }]);
});

