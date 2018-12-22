define(['require','question-module'],function(require,module){
	var itemType='subjectivebase';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"string","corrects":[""]};
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
	var toHtml = function(object,textclass){
		if(!textclass){
			textclass = "subjectivebase_text";
		}
		var div = $("<div></div>");
		$("<div></div>").addClass(textclass).html(object.text).appendTo(div);
		var root = $("<div></div>").addClass("subjectivebase_asset").appendTo(div);
		for(var i=0;i<object.assets.length;i++){
			var assetDiv = $("<div></div>").addClass("asset");
			var asset = object.assets[i];
			assetDiv.attr("data-type",asset.type);
			assetDiv.attr("data-poster",asset.poster);
			assetDiv.attr("data-src",asset.src);
			assetDiv.attr("width",asset.width);
			assetDiv.attr("height",asset.height);
			assetDiv.appendTo(root);
		}
		return div.html();
	};
	var parseHtml = function(text,textclass){
		if(!textclass){
			textclass = "subjectivebase_text";
		}
		var div = $("<div></div>").html(text);
		var text = div.find("."+textclass).html() || '';
		var assetElements = div.find(".subjectivebase_asset .asset");
		var assets = [];
		for(var i=0;i<assetElements.length;i++){
			var element = $(assetElements[i]);
			var type = element.data("type");
			var width = element.attr("width");
			var height = element.data("height");
			var poster = element.data("poster");
			var src = element.data("src");
			if(type&&src){
				assets.push({
					type: type,
					width:width,
					height:height,
					poster:poster,
					src:src
				});
			}
		}
		return {
			text:text,
			assets: assets
		}
	}
	module.directive("lcSubjectiveBase", ['$identifier','$console',function($identifier,$console){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcSubjectiveBase.html',
			controller:['$scope',function($scope){
				$scope.getAssets =function(type){
					if(type=='prompt'){
						return $scope.prompt.assets;
					} 
					else if(type == 'response'){
						 return $scope.response.assets;
					}
					else if(type == 'hint'){
						 return $scope.hint.assets;
					}
					else if(type == 'answer'){
						 return $scope.answer.assets;
					}
				}
				$scope.setCkeditor=function(name,ckeditor,type){
					if(!window.ckeditorHandlers){
						window.ckeditorHandlers = {};
					}
					window.ckeditorHandlers[name] = {
						insertResource:function(resourceType,src,width,height,poster){
							var array = $scope.getAssets(type);
							if(array.length>=10){
								$console.message($i18n("qti.subjectivebase.asset.max",10));
								return;
							}
							array.push({
								type:resourceType,
								src:src,
								width:width,
								height:height,
								poster:poster,
								newCreate:true
							})
						}
					};
				}
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
				scope.prompt = parseHtml(scope.assessment.item.prompt||'');
				scope.response = parseHtml(scope.assessment.response.corrects[0]||'','response_text');
				scope.hint = parseHtml(scope.assessment.feedbackHint.content||'');
				scope.answer = parseHtml(scope.assessment.feedbackAnswer.content||'');
				scope.assessment.beforeCommit=function(a,errors){
					scope.assessment.item.prompt = toHtml(scope.prompt);
					scope.assessment.response.corrects[0] = toHtml(scope.response,'response_text')
					scope.assessment.feedbackHint.content = toHtml(scope.hint);
					scope.assessment.feedbackAnswer.content = toHtml(scope.answer);
					
				}
				
			}
		};
	}]);
});