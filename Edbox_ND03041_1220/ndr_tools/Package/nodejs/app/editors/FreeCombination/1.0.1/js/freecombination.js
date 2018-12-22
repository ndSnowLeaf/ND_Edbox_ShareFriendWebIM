define(['./utils.js', './elementHandler.js',],function(utils,elementHandlerCreator){
    var $scope,module,stage,config,element,editorType;
    return {
        init:function(_$scope,_module,_stage,_config,_element){
            $scope = _$scope;
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

            var elementHandler = elementHandlerCreator($scope);
            $scope.question = this;
            $scope.panelTitle = module.getPropertyValue("StemContent");
            $scope.attachments = module.getPropertyValue("StemAttachment")||[];
            $scope.modules = [];
            var elements = module.getPropertyValue("StageElements")||[];
            for(var i=0;i<elements.length;i++){
                var element = elements[i];
                var options = utils.formatFromRead(element);
                elementHandler.addNewElement(options);
            }
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
        },
        save:function(){
            //保存标题
            var title = $scope.panelTitle;
            var length = $scope.titleLength();
            if(length == 0){
                return "请输入标题";
            }
            else if(length>70){
                return "标题最多允许输入70个字符。";
            }
            if($scope.modules.length == 0){
                return "当前未添加任何元素，请添加元素后再保存/插入";
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
            var elements = $scope.modules;
            var saveElements = [];
            for(var i=0;i<elements.length;i++){
                var element = elements[i];
                copy = utils.formatToWrite(element,i);
                saveElements.push(copy);
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