define(['require','question-module'],function(require,module){
	var itemType='textentry';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"multipleString","corrects":[""]};
	};
	var createItem=function(){
		return {
			"identifier":null,"type":itemType,"response_identifier":null,"prompt":"","shuffle":false,
			"choices":[],"min_choices":0,"max_choices":1
		};
	};
	module.directive("lcTextentryInteraction", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				responses:'='
			},
			templateUrl:'qti/$directives/lcTextentryInteraction.html',
			controller:['$scope',function($scope){
				$scope.setPromptEditorName=function(name){
					$scope.editorName=name;
					$scope.assessment._defaultEditorName=name;
				};
				$scope.toggleInteraction=function(){
					var editor=CKEDITOR.instances[$scope.editorName];
					if(editor){
						try{
				            editor.execCommand('insertpre');
						}catch(e){
							if(e=='no_text'){
								$console.message($i18n('qti.textentry.validate.require.select.text'));
							}else{
								try{
									editor.execCommand('insertpre');
								}catch(e){
									if(e=='no_text'){
										$console.message($i18n('qti.textentry.validate.require.select.text'));
									}
								}
							}
						}
					}
				};
			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				scope.assessment._editable=true;
				if(!scope.assessment._width){
					scope.assessment._width=500;
				}
				if(!scope.assessment._height){
					scope.assessment._height=300;
				}
				if(!scope.assessment.response){
					scope.assessment.response = scope.responses||[];
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem();
				}else if(scope.assessment.item.prompt=='<p/>'){
					scope.assessment.item.prompt='';
				}
				
				scope.prompt = scope.assessment.item.prompt.replace(/<textentryinteraction responseidentifier="([^\"]+)" ([^>].*?)><\/textentryinteraction>/gm,function(text,identifier){
					var responseText='';
					for(var i=0;i<scope.assessment.response.length;i++){
						var r=scope.assessment.response[i];
						if(r.identifier==identifier){
							responseText=r.corrects[0]||'';
							break;
						}
					}
					return '<span class="textentryinline">'+responseText+'</span>';
				});
				scope.assessment.beforeCommit=function(a,errors){
					var responses=[];
					a.item.prompt=scope.prompt.replace(/<span class=\"textentryinline\">((<span[^>]*>(<span[^>]*>(<span[^>]*>.*?<\/span>|.|\s)*?<\/span>|.|\s)*?<\/span>|.|\s)*?)<\/span>/gm
					,function(text,content){
						content = content.replace(/<(?!\/?latex)[^>]*>/gmi,'');
						if(!content){
							return '';
						}
						if(!content.replace(/((&nbsp;)|\s)*/gmi,'')){
							errors.push({message:$i18n('qti.textentry.validate.require.interaction')});
							return '';
						}
						var r = createResponse('s-'+$identifier.guid());
						r.corrects[0]=content;
						responses.push(r);
						return '<textentryinteraction responseidentifier="'+r.identifier+'"><\/textentryinteraction>';
					});
					a.response=responses;
				};
			}
		};
	}]);
});