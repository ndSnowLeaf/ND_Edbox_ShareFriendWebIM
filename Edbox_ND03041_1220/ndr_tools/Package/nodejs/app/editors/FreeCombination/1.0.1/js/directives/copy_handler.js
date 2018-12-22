define([
    'jquery',
    'angular',
    '../utils.js',
    '../lib/striptags.js',
    '../freecombination.js',
    './../fc_stage.js'],function(jquery,angular,utils,striptags,freecombination){
    var module = angular.module("fcstage");

    module.directive('copyHandler',['$timeout','$document','$rootScope','$prompter',function($timeout,$document,$rootScope,$prompter){
        return {
            restrict:'AE',
            scope:{
                modules: "="
            },
            template:"<textarea></textarea>",
            controller:['$scope','$sce',function($scope,$sce){
                var inCkeditor = function($event){
                    var parent = $($event.target).parents(".slides-html-editor");
                    return parent.length>0;
                }

                var hanlde = function(event,isCut){
                    event.stopPropagation();
                    event.preventDefault();
                    $timeout(function(){
                        executeCopyOrCut(isCut);
                    });
                }

                $($document).find(".freeCombination_content").on("paste",function($event){
                   if(!inCkeditor($event)){
                       $scope.options = {type:2};
                       $scope.paste($event);
                   }
                }).on("copy",function($event){
                    if(!inCkeditor($event)){
                        hanlde($event,false);
                    }
                }).on("cut",function($event){
                    if(!inCkeditor($event)){
                        hanlde($event,true);
                    }
                });
                $rootScope.$on('remotePaste', function ($event,params) {
                    $scope.options = {type:2};
                    $scope.paste(params);
                });
                function dataURItoBlob(dataURI) {
                    // convert base64/URLEncoded data component to raw binary data held in a string
                    var binary = atob(dataURI.split(',')[1]);
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                    var array = [];
                    for(var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], {type: mimeString});
                }
                var getSuffix = function(type){
                    if(type.indexOf("png") !=-1){
                        return "png";
                    }
                    if(type.indexOf("gif")!=-1){
                        return "gif";
                    }
                    if(type.indexOf("bmp")!=-1){
                        return "bmp";
                    }
                    return "jpg";
                }
                $scope.paste =function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    var data =  event.originalEvent.clipboardData;
                    var types = data.types;
                    if(types.indexOf("application/nd.modules")!=-1){
                        console.log("paste modules");
                    }
                    else if(types.indexOf("Files")!=-1){
                        var items = data.items;
                        for(var i=0;i<items.length;i++){
                            if(items[i].kind == 'file'){
                                var input = items[i].getAsFile();
                                var suffix = getSuffix(input.type);
                                var file = new File([input], "filename."+suffix);
                                freecombination.stage.repository.getFileWriter()(file, "resource").then(function(result){
                                    var item = result;
                                    var url = result.tech_info.href.location;
                                    var full = freecombination.stage.repository.getResourceUrl(url);
                                    if(item.tech_info&&item.tech_info.href&&item.tech_info.href.requirements){
                                        var requirement = item.tech_info.href.requirements[0];
                                        if(requirement&&requirement.name=='resolution'){
                                            item.resolution = requirement.value;
                                        }
                                    }
                                    item.href = full;
                                    var options = utils.fixImageOptions(item);
                                    $scope.$emit('addElement',options);
                                    $timeout();
                                });
                                //$scope.handleImage(blobUrl);
                            }
                        }
                    }
                    else if(types.indexOf("text/html")!=-1){
                        var value = data.getData("text/html");
                        $scope.handleText(value,event);
                    }
                    else if(types.indexOf("text/plain")!=-1){
                        var value = data.getData("text/plain");
                        $scope.handleText(value,event);
                    }
                    $timeout();
                }


                var getSelectedModule = function(remove){
                    var array = [];
                    for(var i=$scope.modules.length;i>0;i--){
                        var module = $scope.modules[i-1];
                        if(module.selected){
                            array.push(module);
                            if(remove){
                                $scope.modules.splice(i-1,1);
                            }
                        }
                    }
                    return array;
                };
                var isTextModule = function(){
                    var module = $scope.options ? $scope.options.module : null;
                    return module&&(module.type=='richtext'||module.type=='shape');
                }
                var hasSelectText = function(editor){
                    if(!editor) return false;
                    var selection = editor.getSelection();
                    if(selection){
                        var ranges = selection.getRanges();
                        for(var i=0;i<ranges.length;i++){
                            var range = ranges[i];
                            if(range.startOffset != range.endOffset){
                                return true;
                            }
                        }
                    }
                    return false;
                }
                var formatToWrite = function(modules){
                    var result = [];
                    for(var i=0;i<modules.length;i++){
                        result.push(utils.formatToWrite(modules[i],-1));
                    }
                    return result;
                }
                var executeCopyOrCut = function(isCut){
                    if(isTextModule()){
                        var editor = $scope.options.module.getEditor();
                        if(hasSelectText(editor)){
                            editor.execCommand(isCut ? "cut":"copy");
                            return;
                        }
                    }
                    var selectedModule = getSelectedModule(isCut);
                    var text = JSON.stringify({type:'copymodule',items:formatToWrite(selectedModule)});



                    $scope.element.val(text);
                    $scope.element[0].select();
                    try {
                        var successful = document.execCommand('copy');
                    } catch(err) {
                        console.log('Oops, unable to copy');
                    }
                }
                $rootScope.$on('copy', function ($event,params) {
                    $scope.options = params;
                    executeCopyOrCut(false);
                });
                $rootScope.$on('cut', function ($event,params) {
                    $scope.options = params;
                    executeCopyOrCut(true);
                });
                $rootScope.$on('paste', function ($event,params) {
                    $scope.element[0].select();
                    $scope.options = params;
                    try {
                        // Now that we've selected the anchor text, execute the copy command
                        var successful = document.execCommand('paste');
                        if(!successful){
                            $prompter.message("因浏览器安全限制，请使用ctrl+v粘贴");
                        }
                    } catch(err) {
                        console.log('Oops, unable to copy');
                    }
                });


                $scope.handleImage = function(url){
                    //TODO upload image first
                    var width = 200;
                    var height = 200;
                    $scope.$emit('addElement',{type:"picture",src:url,width:width,height:height});
                    $timeout();
                };
                var strip = function(text,type){
                    var div = $("<div></div>").html(text);
                    if(type == 1){
                        //仅文本，不保留样式
                        return div.text();
                    }
                    else if(type==2){
                        return striptags(text,"<a><div><span><em><img><video><audio><table><tr><td><th><ul><li><ol><strong><u>");
                    }
                    else{
                        return striptags(text,"<a><div><span><em><strong><u>");
                    }
                }

                $scope.handleHtmlText = function(text,event){
                    var width = 200;
                    var height = 200;
                    var type = $scope.options.type;
                    text = strip(text,type);
                    if(isTextModule()){
                        $scope.options.module.insertHtml(text);
                    }
                    else{
                        $scope.$emit('addElement',{type:"richtext",html:text,width:width,height:height});
                    }
                }
                var samePosition = function(top,left){
                    for(var i=0;i<$scope.modules.length;i++){
                        if($scope.modules[i].top == top && $scope.modules[i].left == left){
                            return true;
                        }
                    }
                    return false;
                }
                $scope.handleText = function(text,event){
                    var groupIndex =0;
                    var groups = {};
                    var width = 200;
                    var height = 200;
                    try{
                        var json = JSON.parse(text);
                        //复制的是元素
                        if(json&&json.type=='copymodule'){
                            for(var i=0;i<json.items.length;i++){
                                var item = json.items[i];
                                while(samePosition(item.position.top,item.position.left)){
                                    item.position.top = utils.parseSize(item.position.top,utils.stageSize.height)+50;
                                    item.position.left = utils.parseSize(item.position.left,utils.stageSize.width)+50;
                                }
                                item.showcontextmenu = false;
                                if(item.group){
                                    var newGroup = groups[item.group];
                                    if(!newGroup){
                                        groupIndex++;
                                        newGroup = "G"+new Date().getTime()+groupIndex;
                                        groups[item.group] = newGroup;
                                    }
                                    item.group = newGroup;
                                }
                                if(item.data&&item.data.shapeGroupId){
                                    var newGroup = groups[item.data.shapeGroupId];
                                    if(!newGroup){
                                        groupIndex++;
                                        newGroup = "Shape"+new Date().getTime()+groupIndex;
                                        groups[item.data.shapeGroupId] = newGroup;
                                    }
                                    item.data.shapeGroupId = newGroup;
                                }
                                var options = utils.formatFromRead(item);
                                $scope.$emit('addElement',options);
                            }
                        }
                    }
                    catch(ex){
                        $scope.handleHtmlText(text,event);
                    }
                }
            }],
            link:function($scope, $element, $attr, slidesEditable){
                $scope.element = $($element).find("textarea");
                $scope.element.on("paste",function(event){
                    $scope.paste(event);

                }).on("copy",function(event){
                    if(event.originalEvent.srcElement == $scope.element[0]){
                        //var text = $scope.element.val();
                        //event.originalEvent.clipboardData.items.add(text,"application/nd.modules");
                    }
                    event.stopPropagation();
                    //event.preventDefault();
                }).on("cut",function(event){
                    event.stopPropagation();
                });
            }
        };
    }]);

});


