define([
    'jquery',
    'angular',
    'slides',
    'i18n!',
    'text!./../templates/fc_toolbar.html',
    './shape/shapes.js'
    ,'./FcContext.js','./utils.js'],function(jquery,angular,slides,i18n,template,shapeTemplates,context,utils){
    var module = angular.module("fctools",[]);
    module.directive("fcTools", ['$document','$q','$prompter',function($document,$q,$prompter){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                question:"=",
                modules:"="
            },
            template:template,
            controller:['$scope','$rootScope',function($scope,$rootScope){
                $scope.context = context;
                $rootScope.$on('htmlEditorFocus', function ($event,editor) {
                    $scope.editor = editor;
                });
                $rootScope.$on('htmlEditorCreator', function ($event,editor) {
                    if(!$scope.editor){
                        $scope.editor = editor;
                    }
                });
                $rootScope.$on('cancel_tool_bar', function ($event,editor) {
                    hideAllSubMenu();
                });

                $rootScope.$on('changeEditableType', function ($event,options) {
                    $scope.type = options.type;
                    if(options.type=='image'||options.type=='stage'||options.type=='shape'){
                        $scope.element.focus();
                    }
                });

                $scope.fontsizes = [8,9,10,11,12,14,16,18,20,22,24,26,28];
                $scope.colors1 = [1,2,3,4,5,6,7,8,9,10];
                $scope.colors2 = [11,12,13,14,15,16,17,18,19,20];
                $scope.shapes1=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
                $scope.shapes2=[18,19,20,21,22,23];
                $scope.shapes3=[24,25,26,27,28];
                $scope.shapes4=[29,30,31,32,33,34,35,36,37,38,39];
                $scope.shapes5=[40,41,42,43,44];




                $scope.isDisabled = function(button){
                    var type =$scope.type;
                    if(!type){
                        type="title";
                    }
                    var settings = {
                        title:{
                            shape: true,
                            shape_color:true,
                            shape_border: true,
                            text:true,
                            bold:true,
                            italic:true,
                            underline:true,
                            fontsize:true,
                            color:true,
                            removeFormat:true
                        },
                        text:{
                            shape: true,
                            shape_color:true,
                            shape_border: true,
                            text:true,
                            image:true,
                            video:true,
                            audio:true,
                            table:true
                        },
                        shape_text:{
                            shape: true,
                            text:true,
                            image:true,
                            video:true,
                            audio:true,
                            table:true
                        },
                        shape:{
                            shape: true,
                            text:true,
                            image:true,
                            video:true,
                            audio:true,
                            table:true,
                            bold:true,
                            italic:true,
                            underline:true,
                            fontsize:true,
                            color:true,
                            removeFormat:true
                        },
                        image:{
                            shape: true,
                            shape_color:true,
                            shape_border: true,
                            text:true,
                            image:true,
                            video:true,
                            audio:true,
                            table:true,
                            bold:true,
                            italic:true,
                            underline:true,
                            fontsize:true,
                            color:true,
                            removeFormat:true
                        },
                        table_text:{
                            shape: true,
                            shape_color:true,
                            shape_border: true,
                            text:true,
                            image:true,
                            video:true,
                            audio:true,
                            table:true
                        },
                        stage:{
                            shape_color:true,
                            shape_border: true,
                            bold:true,
                            italic:true,
                            underline:true,
                            fontsize:true,
                            color:true,
                            removeFormat:true,
                            video:true,
                            audio:true
                        }
                    };
                    var result = settings[type][button]===true;
                    if(!result&&button == 'shape_color'){
                        for(var i=0;i<$scope.modules.length;i++){
                            var module = $scope.modules[i];
                            if(module.selected){
                                var template = utils.findTemplate(module.shapetype);
                                if(!template.line){
                                    return false;
                                }
                            }
                        }
                        return true;
                    }

                    return result;
                }

                $scope.status = {
                    bold:false,
                    italic: false,
                    underline:false
                };
                $scope.command = function(name,params,$event){
                    if($scope.editor){
                        $scope.editor.execCommand(name,params);
                    }
                    else{
                        console.log("not select editor ");
                    }
                };
                var hideAllSubMenu = function(){
                    $(".ui_btn_open").removeClass("ui_btn_open");
                }
                $scope.openMenu = function($event){
                    $scope.$emit('cancel_create_element', {});
                    hideAllSubMenu();
                    if($scope.editor){
                        $scope.editor.ckeditor.lockSelection();
                    }
                    $($scope.element).focus();
                    $($event.currentTarget).addClass("ui_btn_open");
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                $scope.clearColor=function(){
                    $scope.command('color','');
                }
                $scope.selectColor=function($event,type){
                    var color =  $($event.currentTarget).find("span").css("background-color");
                    if(type == 'color'){
                        $scope.command('color',color);
                    }
                    else{
                        $scope.$emit('changeShapeColor', {type:type,color:color});
                    }

                }
                $document.on("click",function(){
                    hideAllSubMenu();
                });
                $scope.getShapeName = function(index){
                    var template = shapeTemplates[index+""];
                    if(!template || !template.type){
                        return "";
                    }
                    return template.name;
                }
                $scope.isValidShape=function(index){
                    var template = shapeTemplates[index+""];
                    if(!template || !template.type){
                        return false;
                    }
                    return true;
                }

                $scope.addText=function($event){
                    $scope.$emit('create_element', {type:"richtext"});
                    hideAllSubMenu();
                    $event.preventDefault();
                    $event.stopPropagation();
                };

                $scope.addTable=function($event){
                    $scope.$emit('showTableConfig', {type:"table"});
                    $event.preventDefault();
                    $event.stopPropagation();
                };
                $scope.createTable=function(html,width,height){
                    if($scope.type == 'stage'){
                        $scope.$emit('cancel_create_element', {});
                        $scope.$emit('addElement',{type:'table',html:html,width:width+20,height:height+20});
                    }
                    else{
                        $scope.$emit('addAttachment', {type:'table',html:html});
                    }
                }
                $scope.isChangeIndexDisabled=function(){
                    var count = 0;
                    for(var i=0;i<$scope.modules.length;i++) {
                        var module = $scope.modules[i];
                        if (module.selected) {
                            count++;
                        }
                    }
                    return count != 1;
                }
                $scope.changeIndex = function(type){
                    if($scope.isChangeIndexDisabled(type)){
                        return;
                    }
                    var selected = [];
                    for(var i=0;i<$scope.modules.length;i++){
                        var module = $scope.modules[i];
                        if(module.selected){
                            $scope.$emit('changeZindex', {action:type,module:module});
                            return;
                        }
                    }


                }
                $scope.addShape=function($event,sequence){
                    $event.preventDefault();
                    $event.stopPropagation();
                    if(!$scope.isValidShape(sequence)){
                        $prompter.message("未支持的形状");
                        return;
                    }
                    hideAllSubMenu();
                    var type = shapeTemplates[sequence+""].type;
                    $scope.$emit('create_element', {type:"shape",shapetype:type,data:{"edgeColor": "#385d8a", "fillColor": "#4f81bd"}});

                };

                $scope.selectImage = function($event){
                    $scope.$emit('cancel_create_element', {});
                    $q.proxy( $scope.question.stage.selectResource({multiSelect: true,maxSelect:8}, {
                        check: function (result, success, items) {
                            if(!success) return true;

                            if(items.length == 0){
                                $scope.question.stage.prompter.message('未选择图片');
                                return false;
                            }
                            if(items.length > 8){
                                $scope.question.stage.prompter.message('最多选择 8 张图片');
                                return false;
                            }
                            for(var i=0;i<items.length;i++){
                                var item = items[i];
                                var format = item.format ||  '';
                                var href = item.href;
                                if(href.indexOf("?")==-1){
                                    href = href+"?size=480";
                                }
                                else{
                                    href = href+"&size=480";
                                }
                                item.href = href;
                            }
                        }
                    })).then(function (items) {
                        for(var i=0;i<items.length;i++){
                            var item = items[i];
                            var href = item.href;
                            if($scope.type == 'stage'){
                                var options = utils.fixImageOptions(item);
                                $scope.$emit('addElement',options);
                            }
                            else{
                                $scope.$emit('addAttachment', {type:'picture',url:href});
                            }
                        }

                    });
                }

                $scope.selectVideo = function($event){
                    $scope.$emit('cancel_create_element', {});
                    $q.proxy( $scope.question.stage.selectResource({ type: '$RA0103',multiSelect: true,maxSelect:8}, {
                        check: function (result, success, items) {
                            if(!success) return true;
                            if(items.length == 0){
                                $scope.question.stage.prompter.message('未选择图片');
                                return false;
                            }
                            if(items.length > 8){
                                $scope.question.stage.prompter.message('最多选择 8 张图片');
                                return false;
                            }
                        }
                    })).then(function (items) {
                        for(var i=0;i<items.length;i++){
                            var item = items[i];
                            var href = item.href;
                            console.log("item",item);
                            var width = 200;
                            var height = 200;
                            $scope.$emit('addAttachment', {type:"video",url:href,top:100,left:100,width:width,height:height});
                        }

                    });
                }

                $scope.selectAudio = function($event){
                    $scope.$emit('cancel_create_element', {});
                    $q.proxy( $scope.question.stage.selectResource({ type: '$RA0102',multiSelect: true,maxSelect:8}, {
                        check: function (result, success, items) {
                            if(!success) return true;
                            if(items.length == 0){
                                $scope.question.stage.prompter.message('未选择图片');
                                return false;
                            }
                            if(items.length > 8){
                                $scope.question.stage.prompter.message('最多选择 8 张图片');
                                return false;
                            }
                        }
                    })).then(function (items) {
                        for(var i=0;i<items.length;i++){
                            var item = items[i];
                            var href = item.href;
                            var width = 200;
                            var height = 200;
                            $scope.$emit('addAttachment', {type:"audio",url:href,top:100,left:100,width:width,height:height});
                        }
                    });
                }

                window.setButtonStatus=function(commandName,status){
                    for(var key in $scope.status){
                        if(key==commandName.toLowerCase()){
                           $scope.status[key] = status == 1;
                        }
                    };
                };

            }],
            link : function($scope, element, attrs) {
                $scope.element = $(element).find(".textarea_wrapper textarea");
                $scope.element.on("copy",function($event){
                    $scope.$emit("copy",{});
                }).on("cut",function($event){
                    $scope.$emit("cut",{});
                }).on("paste",function($event){
                    $scope.$emit("remotePaste",$event);
                    $event.stopPropagation();
                });
            }
        };
    }]);
});
