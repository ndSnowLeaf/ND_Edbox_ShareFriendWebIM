define(['require','question-module'],function(require,module){
	var itemType='textentrymultiple';
	var createResponse=function(identifier,cardinality){
		return {"identifier":identifier,"cardinality":cardinality,"base_type":"multipleString","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcTextentrymultipleItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcTextentrymultipleItem.html',
			controller:['$scope',function($scope){
				var maxInteractionCount = 25;
				$scope.insertTextEntryInteraction=function(){					
					if($scope.corrects.length>=maxInteractionCount){
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
					scope.assessment.response = createResponse('s-'+$identifier.guid(),scope.assessment.cardinality||'multiple');
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem(scope.assessment.response.identifier);
				}
				if(!scope.assessment.feedbackHint){
					scope.assessment.feedbackHint=createFeedbackHint(scope.assessment.response.identifier);
				}
				if(!scope.assessment.feedbackAnswer){
					scope.assessment.feedbackAnswer=createFeedbackAnswer(scope.assessment.response.identifier);
				}
				scope.corrects=[];
				var entrys=angular.element('<div>'+scope.assessment.item.prompt+'</div>').find('textentryinteraction');
				for(var i=0,len=entrys.length;i<len;i++){
					var id=angular.element(entrys[i]).attr('responseidentifier');
					scope.corrects.push({identifier:id,text:scope.assessment.response.corrects[i]});
				}
				scope.$watch('assessment.item.prompt',function(newV){
					var entrys=angular.element('<div>'+newV+'</div>').find('textentryinteraction');
					var temp=scope.corrects;
					scope.corrects=[];
					for(var i=0,len=entrys.length;i<len;i++){
						var id=angular.element(entrys[i]).attr('responseidentifier');
						var f=false;
						for(var j=0;j<temp.length;j++){
							if(temp[j].identifier==id){
								scope.corrects.push(temp[j]);
								f=true;
								break;
							}
						}
						if(!f){
							scope.corrects.push({identifier:id,text:''});
						}
					}
				});
				scope.$watch('corrects',function(newV){
					scope.assessment.response.corrects=[];
					for(var i=0;i<newV.length;i++){
						scope.assessment.response.corrects.push(newV[i].text||'');
					}
				},true);
				scope.assessment.beforeCommit=function(a,errors){
					if(!scope.corrects.length){
						errors.push({message:$i18n('qti.textentry.validate.min.interaction',1)});
						return false;
					}
					scope.assessment.response.corrects=[];
					for(var i=0;i<scope.corrects.length;i++){
						var text=scope.corrects[i].text||'';
						text = text.replace(/<(?!\/?latex)[^>]*>/gmi,'');
						text = text.replace(/(^((&nbsp;)|\s)*)|(((&nbsp;)|\s)*$)/gmi,'');
						if(!text){
							errors.push({message:$i18n('qti.textentry.validate.require.interaction')});
							return false;
						}
						scope.assessment.response.corrects.push(text);
					}
				};
			}
		};
	}]);
});