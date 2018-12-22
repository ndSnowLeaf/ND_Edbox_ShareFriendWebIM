define(['require','question-module'],function(require,module){
    var itemType='handwrite';
    var createResponse=function(identifier){
        return {"identifier":identifier,"cardinality":"single","base_type":"multipleString","corrects":[""]};
    };
    var createItemResponse=function(identifier){
        return {"identifier":identifier,"cardinality":"single","base_type":"file","corrects":[]};
    };
    var createItem=function(responseIdentifier){
        return {
            "identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,
            "choices":[],"min_choices":0,"max_choices":1,"object":{"data":"","width":"960","height":"640"}
        };
    };
    var createFeedbackHint=function(){
        return {"identifier":"showHint","outcomeIdentifier":null,"show_hide":"show","content":""};
    };
    var createFeedbackAnswer=function(){
        return {"identifier":"showAnswer","outcomeIdentifier":null,"show_hide":"show","content":""};
    };
    module.directive("lcHandwriteItemOld", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                assessment:'=',
                responses:'=',
                defaultKeyword:'='
            },
            templateUrl:'qti/$directives/lcHandwriteItemOld.html',
            controller:['$scope',function($scope){
                $scope.insertTextEntryInteraction=function(){
                    if($scope.assessment.response.length>=25){
                        $console.alert($i18n('qti.textentry.validate.max.interaction',25));
                        return;
                    }
                    var editor=CKEDITOR.instances[$scope.editorName];
                    if(editor){
                        try{
                            editor.execCommand('textEntryInteraction');
                        }catch(e){
                            editor.execCommand('textEntryInteraction');
                        }
                    }
                };
                $scope.setPromptEditorName=function(name){
                    $scope.editorName=name;
                };

                $scope.removeAnswer=function(deleteEntry){
                    $console.confirm($i18n('common.hint.delete'),function(){
                        var el = angular.element('<div>'+$scope.assessment.item.prompt+'</div>');
                        var entrys=el.find('textentryinteraction');
                        for(var i=0;i<entrys.length;i++){
                            var entry=entrys[i];
                            if(angular.element(entry).attr('responseidentifier')==deleteEntry.identifier){
                                angular.element(entry).remove();
                                break;
                            };
                        }
                        $scope.assessment.item.prompt=el.html();
                    });
                };

                var currentWidth,currentHeight;
                $scope.onResizeStart=function(){
                    currentWidth = parseInt($scope.assessment.item.object.width);
                    currentHeight = parseInt($scope.assessment.item.object.height);
                };
                $scope.onResize=function($event){
                    $scope.assessment.item.object.width = Math.min(Math.max(100,currentWidth + $event.incrementX),1620)+'';
                    $scope.assessment.item.object.height =Math.min(Math.max(100,currentHeight + $event.incrementY)+'',1350);
                };

                $scope.setBackground=function(){
                    $scope.imageDialog.open().openPromise.then(function(){
                        $scope.imageSelector.refresh();
                    });
                    return;
                };
                var isCorrectResolution = function(text){
                    if(!text){
                        return false;
                    }
                    else{
                        var width = text.split("*")[0];
                        var height = text.split("*")[1];
                        return width<=1620&&height<=1350;
                    }
                };
                $scope.onImageSelect=function(item){
                    if(item.tech_info.href && item.tech_info.href.format && item.tech_info.href.format.indexOf('gif')!=-1){
                        $console.error('不能将GIF图片设为背景');
                        return;
                    }
                    var resolution = item.resolution;
                    if(!isCorrectResolution(resolution)){
                        $console.error('分辨率不能超过1620*1350.');
                        return;
                    }

                    var href=item.actualHref;
                    $scope.assessment.item.object.data=href;
                    $scope.assessment.item.object.type=item.tech_info.href.format;
                    $scope.imageDialog.close();
                };
                $scope.cancelBackground=function(){
                    $scope.assessment.item.object.data='';
                    $scope.assessment.item.object.type='';
                };
            }],
            link : function(scope, iElement, iAttrs) {
                if(!scope.assessment){
                    scope.assessment={type:itemType};
                };
                if(!scope.assessment.item){
                    scope.assessment.item=createItem('s-'+$identifier.guid());
                }else if(scope.assessment.item.prompt=='<p/>'){
                    scope.assessment.item.prompt='';
                }
                scope.assessment.response = [];
                var responses=scope.responses||[];
                for(var i=0;i<responses.length;i++){
                    var r=responses[i];
                    if(r.identifier==scope.assessment.item.response_identifier){
                        scope.itemResponse=r;
                    }else{
                        scope.assessment.response.push(r);
                    }
                }
                if(!scope.itemResponse){
                    scope.itemResponse=createItemResponse(scope.assessment.item.response_identifier);
                }
                if(!scope.assessment.feedbackHint){
                    scope.assessment.feedbackHint=createFeedbackHint();
                }
                if(!scope.assessment.feedbackAnswer){
                    scope.assessment.feedbackAnswer=createFeedbackAnswer();
                }

                for(var i=0;i<scope.assessment.response.length;i++){
                    var r=scope.assessment.response[i];
                    r._text='<p>'+(r.corrects[0]||'')+'</p>';
                }
                scope.$watch('assessment.item.prompt',function(newV){
                    var div = angular.element('<div>'+(newV||'')+'</div>');
                    var entrys=div.find('textentryinteraction');
                    var temp=scope.assessment.response;
                    scope.assessment.response=[];

                    for(var i=0,len=entrys.length;i<len;i++){
                        var id=angular.element(entrys[i]).attr('responseidentifier');
                        var f=false;
                        for(var j=0;j<temp.length;j++){
                            if(temp[j].identifier==id){
                                scope.assessment.response.push(temp[j]);
                                f=true;
                                break;
                            }
                        }
                        if(!f){
                            scope.assessment.response.push(createResponse(id,'latex'));
                        }
                    }
                });
                scope.assessment.beforeCommit=function(a,errors){
                    var responses=scope.assessment.response;
                    for(var i=0;i<responses.length;i++){
                        var text=responses[i]._text||'';
                        text = text.replace(/<(?!\/?latex)[^>]*>/gmi,'');
                        text = text.replace(/(^((&nbsp;)|\s)*)|(((&nbsp;)|\s)*$)/gmi,'');
                        if(!text){
                            errors.push({message:$i18n('qti.textentry.validate.require.interaction')});
                            return false;
                        }
                        responses[i].corrects[0]=text;
                    }
                    var result = angular.extend({},scope.assessment);
                    result.response=[scope.itemResponse].concat(scope.assessment.response);
                    return result;
                };
            }
        };
    }]);
});