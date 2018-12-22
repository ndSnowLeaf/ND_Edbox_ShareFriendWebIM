define(['require','question-module'],function(require,module){
	var itemType='handwrite';
	var MAX_WIDTH = 1620;
	var MAX_HEIGHT = 1350;
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"multipleString","corrects":[""]};
	};
	var createItemResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"file","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,
			"choices":[],"min_choices":0,"max_choices":1,"object":{"data":"",type: 1,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,width:MAX_WIDTH,height:MAX_HEIGHT
			}
		};
	};
	var createFeedbackHint=function(){
		return {"identifier":"showHint","outcomeIdentifier":null,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(){
		return {"identifier":"showAnswer","outcomeIdentifier":null,"show_hide":"show","content":""};
	};

	module.directive("lcHandwriteItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				responses:'=',
				defaultKeyword:'='
			},
			templateUrl:'qti/$directives/lcHandwriteItem.html',
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

				var calculateWidthAndHeight = function(){
					$scope.background.width = MAX_WIDTH - $scope.background.right-$scope.background.left;
					$scope.background.height =MAX_HEIGHT - $scope.background.bottom-$scope.background.top;

				}
				var cureentBackground = {};
				$scope.onResizeStart=function(){
					cureentBackground.top = parseInt($scope.background.top);
					cureentBackground.bottom = parseInt($scope.background.bottom);
					cureentBackground.left = parseInt($scope.background.left);
					cureentBackground.right = parseInt($scope.background.right);
				};
				var calculatePosition = function(value,min,max){
					if(value<=min){
						return min;
					}
					if(value>=max){
						return max;
					}
					return value;
				}
				$scope.onResize=function($event,type){
					if(type == 'right-bottom'){
						$scope.background.right = calculatePosition(cureentBackground.right - $event.incrementX,0,MAX_WIDTH-$scope.background.left-100);
						$scope.background.bottom =calculatePosition(cureentBackground.bottom - $event.incrementY,0,MAX_HEIGHT-$scope.background.top-100);
					}
					else if(type == 'right-top'){
						$scope.background.right = calculatePosition(cureentBackground.right - $event.incrementX,0,MAX_WIDTH-$scope.background.left-100);
						$scope.background.top =calculatePosition(cureentBackground.top + $event.incrementY,0,MAX_HEIGHT-$scope.background.bottom-100);
					}
					else if(type == 'left-bottom'){
						$scope.background.left =calculatePosition(cureentBackground.left + $event.incrementX,0,MAX_WIDTH-$scope.background.right-100);
						$scope.background.bottom = calculatePosition(cureentBackground.bottom - $event.incrementY,0,MAX_HEIGHT-$scope.background.top-100);
					}
					else if(type == 'left-top'){
						$scope.background.left =calculatePosition(cureentBackground.left + $event.incrementX,0,MAX_WIDTH-$scope.background.right-100);
						$scope.background.top =calculatePosition(cureentBackground.top + $event.incrementY,0,MAX_HEIGHT-$scope.background.bottom-100);
					}
					else if(type == 'move'){
						$scope.background.left = calculatePosition(cureentBackground.left + $event.incrementX,0,MAX_WIDTH - $scope.background.width);
						$scope.background.top = calculatePosition(cureentBackground.top + $event.incrementY,0,MAX_HEIGHT-$scope.background.height);
						$scope.background.right =MAX_WIDTH - $scope.background.left -  $scope.background.width;
						$scope.background.bottom = MAX_HEIGHT - $scope.background.top -  $scope.background.height;
					}
					calculateWidthAndHeight();
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
					var resolution = item.resolution;
					if(resolution){
						var width = resolution.split("*")[0]*1.0;
						var height = resolution.split("*")[1]*1.0;
						var bg = $scope.background;
						if(bg.left+bg.right+width> MAX_WIDTH){
							bg.right = Math.max(0,MAX_WIDTH-bg.left-width);
						}
						if(bg.left+bg.right+width> MAX_WIDTH){
							bg.left = Math.max(0,MAX_WIDTH-width);
						}
						if(bg.top+bg.bottom+height> MAX_HEIGHT){
							bg.bottom = Math.max(0,MAX_HEIGHT-bg.top-height);
						}
						if(bg.top+bg.bottom+height> MAX_HEIGHT){
							bg.top = Math.max(0,MAX_HEIGHT-height);
						}
						if(bg.left+bg.right+width<MAX_WIDTH){
							var differ = MAX_WIDTH - bg.left-bg.right-width;
							bg.left = bg.left+differ/2.0;
							bg.right = bg.right +differ/2.0;
						}
						if(bg.top+bg.bottom+height<MAX_HEIGHT){
							var differ = MAX_HEIGHT - bg.top-bg.bottom-height;
							bg.top = bg.top+differ/2.0;
							bg.bottom = bg.bottom +differ/2.0;
						}
					}
					var href=item.actualHref;
					$scope.background.url=href;
					$scope.background.type=2;
					$scope.imageDialog.close();
					calculateWidthAndHeight();
				};
				$scope.cancelBackground=function(){
					$scope.background.url='';
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
				try{
					scope.background = JSON.parse(scope.assessment.item.object.data);
				}
				catch(e){
					var item = scope.assessment.item;
					scope.background = {
						url: item.object.data||'',
							type: 1,
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							width: item.object.width,
							height: item.object.height
					};
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
					scope.assessment.item.object.data = JSON.stringify(scope.background);
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