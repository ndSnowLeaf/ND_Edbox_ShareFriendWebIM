define(['./utils.js', './elementHandler.js', './modules/modules_creator.js'],function(utils,elementHandlerCreator,modulesCreator){
    var $scope,module,stage,config,element,editorType;
    var i18n;
    return {
        init:function(_$scope,_module,_stage,_config,_element,_i18n){
            i18n = _i18n;
            $scope = _$scope;
            $scope.placeholder = i18n.translate('freecombination.title.prompt');
            module=_module;
            stage = this.stage=$scope.stage=_stage;
            stage.on('preview', function () {
                $scope.$emit("priview");
            });
            config=_config;
            element=_element;
            var isSource=function($event){
                return $event.toElement == $event.currentTarget;
            }
            $scope.setCurrentEditor = function($event,type){
                if(type!='stage'||isSource($event)){
                    if(type!='stage'){
                        $scope.$emit('cancel_create_element', {});
                    }
                    $scope.$emit('changeEditableType', {type:type});
                }
                //$event.preventDefault();
                //$event.stopPropagation();
            };
            $scope.hideClickEvent = function($event){
                $event.preventDefault();
                $event.stopPropagation();
            }
            /**
             * [{element},[group:'',children:[]}]
             */
            var elementHandler = elementHandlerCreator($scope);
            $scope.question = this;
            $scope.panelTitle = module.getPropertyValue("StemContent");
            $scope.attachments = module.getPropertyValue("StemAttachment")||[];
            $scope.modules = modulesCreator.create();
            var groups = {};
            var elements = module.getPropertyValue("StageElements")||[];
            for(var i=0;i<elements.length;i++){
                var element = elements[i];
                var options = utils.formatFromRead(element);
                if(element.group){
                    var group = null;
                    if(typeof element.group == 'string'){
                        group = {id:element.group,lazy:true,left:10000,right:0,top:10000,bottom:0,rotate:0};
                        options.group = group;
                    }
                    else{
                        group = element.group;
                        $scope.modules.applyGroupStyle(group,options);
                    }
                    if(!groups[group.id]){
                        groups[group.id] = group;
                        group.children = [];
                        group.type = 'group';
                    }
                    else{
                        group = groups[group.id];
                    }
                    elementHandler.addNewElement(options,group);
                }
                else{
                    elementHandler.addNewElement(options);
                }
            }
            for(key in groups){
                var group = groups[key];
                if(group.lazy){
                    $scope.modules.calculateGroupSize(group);
                }
            }
            $scope.modules.afterLoadData();
            $scope.titleLength = function(){
                var text = $("<div></div>").html($scope.panelTitle).text();
                return text.trim().length
            }
            $scope.titleTooLong = function(){
                var disable =  $scope.titleLength()>70;
                return disable;
            }
            $scope.setTitleEditor=function(editor){
                $scope.titleEditor = editor;
            }
            $scope.cancelToolbar =function(){
                $scope.$emit("cancel_tool_bar");
            }
            $scope.handleTitleKey = function($event){
                var code = $event.keyCode;
                if(code == 13){
                    $event.preventDefault();
                }
            }
            $scope.onBlur = function($event){
                $($event.target).attr("placeholder",$scope.placeholder);
            }
        },
        save:function(){
            //保存标题
            var title = $scope.panelTitle;
            var length = $scope.titleLength();
            if(length == 0){
                return i18n.translate("freecombination.title.empty");
            }
            else if(length>70){
                return i18n.translate("freecombination.title.maxlength");
            }
            if($scope.modules.items.length == 0){
                return i18n.translate("freecombination.content.empty");
            }
            module.setPropertyValue("StemContent",title);
            //保存附件
            var attachments = $scope.attachments;
            var saveAttachments = [];
            for(var i=0;i<attachments.length;i++){
                var attachment = attachments[i];
                saveAttachments.push({
                    type: attachment.type,
                    url: attachment.url,
                    html: attachment.html
                });
            }
            module.setPropertyValue("StemAttachment",saveAttachments);
            var elements = $scope.modules.all;
            var saveElements = [];
            var sequence = 0;
            for(var i=0;i<elements.length;i++){
                var element = elements[i];
                if(element.type != 'group'){
                    copy = utils.formatToWrite(element,sequence);
                    if(element.group){
                        $scope.modules.fixPosition(element.group,copy.position);
                    }
                    saveElements.push(copy);
                    sequence++;
                }
            }
            module.setPropertyValue("StageElements",saveElements);
            module.setPropertyValue("StageWidth",utils.stageSize.width);
            module.setPropertyValue("StageHeight",utils.stageSize.height);
            module.setPropertyValue("QuestionId",stage.coursewareobjectId);
        },
        getEditorType:function(){
            return editorType;
        }
    };
});