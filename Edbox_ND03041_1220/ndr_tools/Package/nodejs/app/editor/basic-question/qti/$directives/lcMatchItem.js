define(['require','question-module','jquery'],function(require,module){
	var $=require('jquery');
	var itemType='match';
	var choiceIdentifiers=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var groups=["group_1","group_2","group_3"];
	var createChoice=function(identifier,group){
		return {"identifier":identifier,"text":"","fixed":false,"group_id":group,"match_max":1};
	};
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"multiple","base_type":"pair","corrects":["A B","C D"]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":true,
			"choices":[createChoice(choiceIdentifiers[0],groups[0]),createChoice(choiceIdentifiers[1],groups[1]), createChoice(choiceIdentifiers[2],groups[0]),createChoice(choiceIdentifiers[3],groups[1])],
			"min_choices":0,"max_choices":1
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcMatchItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				defaultKeyword:'='
			},
			templateUrl:'qti/$directives/lcMatchItem.html',
			controller:['$scope',function($scope){
				$scope.selectImage=function(choice){
					$scope.currentChoice=choice;
					$scope.imageDialog.open().openPromise.then(function(){
						$scope.imageSelector.refresh();
					});
					return;
				};
				$scope.onImageSelect=function(item){
					var href=item.actualHref;
					$scope.currentChoice._image=href;
					$scope.imageDialog.close();
				};
				$scope.deleteImage=function(choice){
					delete choice._image;
				};
				$scope.addChoiceRow=function(){
					var row=[],len=$scope.columnCount*$scope.choiceRows.length;
					if(len + $scope.columnCount > choiceIdentifiers.length){
						$console.alert($i18n('qti.match.validate.max.row',$scope.choiceRows.length));
						return;
					}
					for(var i=0;i<$scope.columnCount;i++){
						row.push(createChoice(choiceIdentifiers[len++],$scope.choiceRows[0]?$scope.choiceRows[0][i].group_id:groups[i]));
					}
					$scope.choiceRows.push(row);
				};
				$scope.removeChoiceRow=function(index){
					$console.confirm($i18n('qti.match.hint.delete.choice_row'),function(){
						$scope.choiceRows.splice(index,1);
						for(var i=0,len=$scope.choiceRows.length;i<len;i++){
							var row=$scope.choiceRows[i];
							for(var j=0;j<$scope.columnCount;j++){
								row[j].identifier=choiceIdentifiers[i*$scope.columnCount+j];
							}
						}
					});
				};
				$scope.$watch('columnCount',function(newV,oldV){
					for(var i=0,len=$scope.choiceRows.length;i<len;i++){
						var row=$scope.choiceRows[i];
						for(var j=0;j<$scope.columnCount;j++){
							if(!row[j]){
								row[j]=createChoice('',i==0?groups[j]:$scope.choiceRows[0][j].group_id);
							}
							row[j].identifier=choiceIdentifiers[i*$scope.columnCount+j];
						}
					}
				});
			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				if(!scope.assessment.response){
					scope.assessment.response=createResponse('s-'+$identifier.guid());
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
				
				scope.disableEditor=function(name){
					//console.log(name);
				};
				
				var a = scope.assessment, rows = scope.choiceRows=[];
				var groupIndex={},column=0;
				for(var i=0,len=a.item.choices.length;i<len;i++){
					var c=a.item.choices[i];
					var index=groupIndex[c.group_id];
					if(!index){
						groupIndex[c.group_id]=index=[0,column++];
					}
					var row = rows[index[0]];
					if(!row){
						rows[index[0]] = row = [];
					}
					index[0]=index[0]+1;
					row[index[1]]=c;
					
					if(c.text){
						var el=angular.element('<div>'+c.text+'</div>');
						c._image=el.find('img').attr('src');
						c._text=el.find('p').prop('outerHTML');
					} 
				}
				scope.columnCount=column;
				scope.$watchCollection('choiceRows',function(){
					scope.assessment.item.choices=[];
					scope.assessment.response.corrects=[];
					for(var i=0,len=scope.choiceRows.length;i<len;i++){
						var row=scope.choiceRows[i];
						for(var j=0;j<scope.columnCount;j++){
							scope.assessment.item.choices.push(row[j]);
							if(j+1<scope.columnCount){
								scope.assessment.response.corrects.push(row[j].identifier+' '+row[j+1].identifier);
							}
						}
					}
				});
				scope.assessment.beforeCommit=function(a,errors){
					if(scope.choiceRows.length<2){
						errors.push({message:$i18n('qti.match.validate.min.row',2)});
						return false;
					}
					var imgs = iElement.find('img');
					for(var i=0,len=a.item.choices.length;i<len;i++){
						var c=a.item.choices[i];
						var text='';
						if(c._image){
							var rawWidth,rawHeight;
							for(var j=0;j<imgs.length;j++){
								var img=$(imgs[j]);
								if(img.attr('src')==c._image){
									var imgObj=new Image();
									imgObj.src=c._image;
									rawWidth=imgObj.width;
									rawHeight=imgObj.height;
									break;
								}
							}
							text+='<img src="'+c._image+'"';
							if(rawWidth){
								text+=' width="'+rawWidth+'"';
							}
							if(rawHeight){
								text+=' height="'+rawHeight+'"';
							}
							text+='/>';
						}
						if(c._text){
							var startP = c._text.trim().indexOf("<p")==0;
							text+=startP ? c._text : "<p>"+c._text+"</p>";
						}
						if(!text){
							errors.push({message:$i18n('qti.match.validate.require.choice')});
							return false;
						}
						c.text=text;
					}
					return a;
				};
			}
		};
	}]);
});