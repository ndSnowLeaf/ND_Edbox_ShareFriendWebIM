define(['require','question-module'],function(require,module){
	var itemType='textentry';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"multipleString","corrects":[""]};
	};
	var createItem=function(){
		return {
			"identifier":null,"type":itemType,"response_identifier":null,"prompt":"<p><textEntryInteraction responseidentifier=\"1\"></textEntryInteraction><textEntryInteraction responseidentifier=\"2\"></textEntryInteraction></p>","shuffle":false,
			"choices":[],"min_choices":0,"max_choices":1
		};
	};
	var createFeedbackHint=function(){
		return {"identifier":"showHint","outcomeIdentifier":null,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(){
		return {"identifier":"showAnswer","outcomeIdentifier":null,"show_hide":"show","content":""};
	};
	module.directive("lcTextentryItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				responses:'='
			},
			templateUrl:'qti/$directives/lcTextentryItem.html',
			controller:['$scope',function($scope){
				var maxInteractionCount = 25;
				$scope.insertTextEntryInteraction=function(){
					if($scope.assessment.response.length>=maxInteractionCount){
						$console.alert($i18n('qti.textentry.validate.max.interaction',maxInteractionCount));
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
				var calculateCkeditorCount = function(html){					
					var div =  $("<div></div>").html(html);
					return div.find("img.cke_textEntryInteraction").length+div.find('textentryinteraction').length;
				};
				$scope.setPromptEditorName=function(name){
					$scope.editorName=name;
					var editor=CKEDITOR.instances[$scope.editorName];
					if(editor){
						editor.on('paste',function(event){
							var type = event.data.type;
							var value = event.data.dataValue;
							var pasteCount = calculateCkeditorCount(value); 
							var allCount = calculateCkeditorCount(editor.getData());
							var selectCount = 0;
							var selection = editor.getSelection().getNative();
							if(selection){
								var container = document.createElement("div");
								for (var i = 0, len = selection.rangeCount; i < len; ++i) {
							        container.appendChild(selection.getRangeAt(i).cloneContents());
							    }
							    var text = container.innerHTML;							  
								selectCount = calculateCkeditorCount(text);
							}							
							if(allCount-selectCount+pasteCount>maxInteractionCount){
								$console.alert($i18n('qti.textentry.validate.max.interaction',maxInteractionCount));
								event.data.dataValue = '';
								event.stop();
							}
						});
					}
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
			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				if(!scope.assessment.response){
					scope.assessment.response = scope.responses||[];
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem();
				}else{
					if(scope.assessment.item.prompt=='<p/>'){
						scope.assessment.item.prompt='';
					}
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
				scope.$watch('assessment.item.prompt',function(newV,oldV){			 
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
					if(!responses || !responses.length){
						errors.push({message:$i18n('qti.textentry.validate.min.interaction',1)});
						return false;
					}
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
				};
			}
		};
	}]);
});