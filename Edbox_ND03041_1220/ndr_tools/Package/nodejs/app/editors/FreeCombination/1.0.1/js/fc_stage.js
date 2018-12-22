define([
    'jquery',
    'angular',
    './drawingHandler.js',
    './lineDrawingHandler.js',
    './elementHandler.js',
    'text!./../templates/fc_stage.html','./utils.js','./FcContext.js'],function(jquery,angular,drawingHandlerCreator,lineDrawingHandlerCreator,elementHandlerCreator,template,utils,context){
    var module = angular.module("fcstage",[]);

    module.directive("fcStage", ['$rootScope',function($rootScope){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                modules:"="
            },
            template:template,
            controller:['$scope','$document','$filter','$timeout',function($scope,$document,$filter,$timeout){
                var elementHandler = elementHandlerCreator($scope,$document);
                var drawingHandler = drawingHandlerCreator($scope,$document,elementHandler,$timeout);
                var lineDrawingHandler = lineDrawingHandlerCreator($scope,$document,elementHandler);
                var hasLastSelect=false;
                var cancelMousedownBubble=false;
                var cancelCreateElement = function(){
                    context.clean();
                    drawingHandler.cancelDraw();
                    return;
                }
                $rootScope.$on('cancel_create_element', function ($event,params) {
                    cancelCreateElement();
                    $scope.$emit("cancel_tool_bar");
                });
                $rootScope.$on('create_element', function ($event,params) {
                    if(context.isDrawing(params.type)){
                        cancelCreateElement();
                        return;
                    }
                    context.drawing = true;
                    context.drawshape = params.type == 'shape';
                    context.drawtext = params.type != 'shape';
                    if(params.type == 'shape'){
                        var template = utils.findTemplate(params.shapetype);
                        if(template.line){
                            lineDrawingHandler.startDraw(params,template);
                            return;
                        }
                        params.keepRate = template.keep_rate;
                    }
                    drawingHandler.startDraw(params);
                });


                $rootScope.$on('addElement', function ($event,params) {
                    elementHandler.addNewElement(params);
                });


                var applyToSelectModule = function(handle){
                    for(var i=0;i<$scope.modules.length;i++){
                        var module = $scope.modules[i];
                        if(module.selected){
                            handle(module);
                        }
                    }
                }
                var getUniqueName = function(){
                    var name = "Group"+new Date().getTime();
                    return name;
                }
                $rootScope.$on('group', function ($event,params) {
                    var groupName = getUniqueName();
                    applyToSelectModule(function(module){
                        module.group = groupName;
                    });
                });
                $rootScope.$on('ungroup', function ($event,params) {
                    applyToSelectModule(function(module){
                        module.group = '';
                    });
                });
                $rootScope.$on('changeZindex', function ($event,params) {
                    var module = params.module;
                    var action = params.action;
                    if(!module) return;
                    var index = $scope.modules.indexOf(module);
                    if(index == -1){
                        return;
                    }
                    if(action == 'down'){
                        if(index>0){
                            $scope.modules.splice(index,1);
                            $scope.modules.splice(index-1,0,module);
                        }
                    }
                    if(action == 'downlast'){
                        if(index>0){
                            $scope.modules.splice(index,1);
                            $scope.modules.splice(0,0,module);
                        }
                    }
                    if(action == 'up'){
                        if(index<$scope.modules.length-1){
                            $scope.modules.splice(index,1);
                            $scope.modules.splice(index+1,0,module);
                        }
                    }
                    if(action == 'upfirst'){
                        if(index<$scope.modules.length-1){
                            $scope.modules.splice(index,1);
                            $scope.modules.push(module);
                        }
                    }
                });
                var cancelAllContextMenu = function(){
                    for(var i=0;i<$scope.modules.length;i++){
                        $scope.modules[i].showcontextmenu = false;
                    }
                }
                $($document).on('mousedown', function click($event) {
                    $scope.$emit('cancelAllContextMenu',{});
                }).on("keydown", function($event){
                    if($event.keyCode==46){
                        var changed = false;
                        for(var i=$scope.modules.length-1;i>=0;i--){
                            if($scope.modules[i].selected){
                                $scope.modules.splice(i,1);
                                changed = true;
                            }
                        }
                        if(changed){
                            $timeout();
                        }
                    }
                });
                $rootScope.$on('cancelAllContextMenu', function ($event,params) {
                    cancelAllContextMenu();
                });
                $scope.deleteModule = function(module){
                    var index = $scope.modules.indexOf(module);
                    if(index!=-1){
                        $scope.modules.splice(index,1);
                    }
                }
                $scope.lockModule = function(module){
                    module.locked = !module.locked;
                }
                $scope.mousedownModule=function(module,$event){
                    var keep = $event.ctrlKey || $event.shiftKey;
                    var left = $event.button === 0;
                    if(left){
                        $scope.$emit('cancelAllContextMenu',{});
                    }
                    if(keep&&module.selected){
                        selectModule(module,false);
                    }
                    else{
                        if(!keep&&left&&!module.selected){
                            $scope.unselectAllModule();
                        }
                        selectModule(module,true);
                    }
                    $event.stopPropagation();
                };
                var selectModule = function(module,select){
                    module.selected = select;
                    if(module.group){
                        for(var i=0;i<$scope.modules.length;i++){
                            if($scope.modules[i].group == module.group){
                                $scope.modules[i].selected = select;
                            }
                        }
                    }
                }

                $scope.unselectAllModule = function(){
                    for(var i=0;i<$scope.modules.length;i++){
                        $scope.modules[i].selected=false;
                    }
                }

                $scope.onMousedown=function($event){
                    if(!cancelMousedownBubble){
                        $scope.unselectAllModule();
                    }
                    cancelMousedownBubble=false;


                };

                $scope.isSelectedModule=function(module){
                    return module.selected;
                };

                $scope.hasSelectedModule=function(){
                    for(var i=0;i<$scope.modules.length;i++){
                        if($scope.modules[i].selected) return true;
                    }
                    return false;
                };

                $scope.calculateModuleStyle=function(module,$index){
                    //ng-style="{}"
                    var base = '';//module.getShowStyle() || '';
                    if(base){
                        base = base+";";
                    }
                    if(module.top){
                        base= base+'top:'+$filter('csSize')(module.top+"")+';';
                    }
                    if(module.left){
                        base= base+'left:'+$filter('csSize')(module.left+"")+';';
                    }

                    base= base+'width:'+(!module.width||module.width<8 ? 8 : module.width)+'px;';
                    base= base+'height:'+(!module.height||module.height<8 ? 8 : module.height)+'px;';

                    if(module.rotate){
                        //base = base +'transform:rotate('+module.rotate+'deg);';
                    }
                    return base;
                }
                $scope.rotateStyle = function(module,$index){
                    var base="width:100%;height:100%;";
                    if(module.rotate){
                        base = base +'transform:rotate('+module.rotate+'deg);';
                    }
                    return base;
                }
                var selectBox = $scope.selectBox ={start:{},end:{},draging:false};
                var resetBoxValue = function(){
                    selectBox.start.x = undefined;
                    selectBox.start.y = undefined;
                    selectBox.end.x = undefined;
                    selectBox.end.y = undefined;
                    selectBox.draging = false;
                }
                var isPointInBox = function(point,box){
                    var xInRange = (point[0]>=box.start.x&&point[0]<=box.end.x) ||(point[0]>=box.end.x&&point[0]<=box.start.x);
                    var yInRange = (point[1]>=box.start.y&&point[1]<=box.end.y) ||(point[1]>=box.end.y&&point[1]<=box.start.y);
                    return xInRange && yInRange;
                }
                var inBox = function(module,box){
                    var points = [
                        [module.left,module.top],
                        [module.left+module.width,module.top],
                        [module.left,module.top+module.height],
                        [module.left+module.width,module.top+module.height]
                    ]
                    for(var i=0;i<points.length;i++){
                        if(isPointInBox(points[i],box)){
                            return true;
                        }
                    }
                    return false;
                }

                $scope.getSelectBoxStyle = function(){
                    if(selectBox.start.x == undefined ||selectBox.start.y == undefined ||selectBox.end.x == undefined ||selectBox.end.y == undefined ){
                        return {};
                    }
                    var top = Math.min(selectBox.start.y,selectBox.end.y);
                    var left = Math.min(selectBox.start.x,selectBox.end.x);
                    var width = Math.abs(selectBox.start.x-selectBox.end.x);
                    var height = Math.abs(selectBox.start.y-selectBox.end.y);
                    return {top:top,left:left,width:width,height:height};
                }

                $scope.onDragSelectModule = function($event){
                    $scope.$emit('cancelAllContextMenu',{});
                    var isSource=function($event){
                        return $event.toElement == $event.currentTarget;
                    }
                    if(isSource($event)){
                        $scope.$emit('changeEditableType', {type:'stage'});

                    }
                    if(!$event.ctrlKey && !$event.shiftKey){
                        $scope.unselectAllModule();
                    }else{
                        return;
                    }


                    $event.preventDefault();
                    $event.stopPropagation();
                    if($event.dragType==0){
                        resetBoxValue();
                        selectBox.draging = true;
                        selectBox.start.y=$event.offsetY;
                        selectBox.start.x=$event.offsetX;
                    }else if($event.dragType==1){
                        var x=utils.zoomSize($event.moveX);
                        var y=utils.zoomSize($event.moveY);
                        selectBox.end.x = x+selectBox.start.x;
                        selectBox.end.y = y+selectBox.start.y;
                    }else if($event.dragType==-1){
                        resetBoxValue();
                    }else if($event.dragType==2){
                        for(var i=0;i<$scope.modules.length;i++){
                            if(inBox($scope.modules[i],selectBox)){
                                selectModule($scope.modules[i],true);
                            }
                        }
                        resetBoxValue();
                    }
                }

            }],
            link : function($scope, element, attrs) {
                $scope.lineelement = $(element).find("._drawing-line-canvas");
            }
        };
    }]);


    module.filter('csSize',function(){
        return function(value,minValue){
            if(!value){
                return '';
            }
            if(typeof value !=='string'||value.indexOf("%")!=-1){
                return value;
            }
            return value+"px";
        };
    });

    module.factory("$resourceUrl",[function(){
        return function(key){
            return key;
        }
    }]);

    module.factory("$pasteStatus",[function(){
        return {type:'text'};
    }]);










});

