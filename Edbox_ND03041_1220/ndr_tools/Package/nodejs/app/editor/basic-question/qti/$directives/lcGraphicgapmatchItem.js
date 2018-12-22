define(['require','question-module','jquery'],function(require,module){
	var $=require('jquery');
	var itemType='graphicgapmatch';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"multiple","base_type":"directedPair","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,"choices":[],
			"object":{"data":""},"rows":3,"columns":2
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcGraphicgapmatchItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				defaultKeyword:'='
			},
			templateUrl:'qti/$directives/lcGraphicgapmatchItem.html',
			controller:['$scope',function($scope){

				$scope.selectImage=function(index){
					$scope.currentIndex=index;
					$scope.imageDialog.open().openPromise.then(function(){
						$scope.imageSelector.refresh();
					});
					return;
				} 
				function getParam(name,location) {
					if(!location){
						return "";
					}
					if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location))
						return decodeURIComponent(name[1]);
					return "";
				}
				var findSuffix = function(item){
					var title = item.title;
					if(title.indexOf(".")!=-1){
						return title.substring(title.lastIndexOf(".")+1).toLowerCase()
					}
					var href = item.tech_info&&item.tech_info.href ? item.tech_info.href.location : '';
					var location = getParam("url",href);
					if(location&&location.indexOf("?")!=-1){
						location = location.substring(0,location.indexOf("?"));
					}
					if(location&&location.lastIndexOf(".")!=-1){
						return location.substring(location.lastIndexOf(".")+1).toLowerCase()
					}
					return "";
					
				}
				$scope.onImageSelect=function(item){					
					var title = item.title;
					var suffix = findSuffix(item);
					//if(suffix=='gif'||suffix=='bmp'){
					//	$console.message("离线版拼图题不支持gif或bmp格式的图片。");
					//	return;
					//}
					var href=item.href;
					$scope.assessment.item.object.data=href;
					$scope.imageDialog.close();
				};
				$scope.rowOptions=[];
				$scope.columnOptions=[];
				for(var i=1;i<=9;i++){
					$scope.rowOptions.push({value:i,label:$i18n('qti.graphicgapmatch.label.row',i)});
					$scope.columnOptions.push({value:i,label:$i18n('qti.graphicgapmatch.label.column',i)});
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
				if(!scope.assessment.item.object){
					scope.assessment.item.object = {};
				}
				if(!scope.assessment.item.object.params){
					scope.assessment.item.object.params = {};
				}
				if(scope.assessment.item.object.params.blankImage){
					scope.assessment.item.object.data = scope.assessment.item.object.params.originalImage;
				}
				scope.lastObject = {
					href: scope.assessment.item.object.params.originalImage,
					rows : scope.assessment.item.rows,
					columns : scope.assessment.item.columns
				};
				scope.assessment.beforeCommit=function(a,errors){
					if(scope.assessment.item.object.data!=scope.lastObject.href||
							scope.assessment.item.rows!=scope.lastObject.rows||
							scope.assessment.item.columns!=scope.lastObject.columns){
						scope.assessment.item.graphchange = true;
					}
					else{
						scope.assessment.item.graphchange = false;
					}
				}
				scope.assessment.afterSave = function(data){
					scope.lastObject = {
						href: scope.assessment.item.object.data,
						rows : scope.assessment.item.rows,
						columns : scope.assessment.item.columns
					};
					var find = function(items,id,field){
						for(var i=0;i<items.length;i++){
							if(items[i][field] == id){
								return items[i];
							}
						}
						throw "保存习题错误";
					}
					
					scope.assessment.item = find(data.items,scope.assessment.item.response_identifier,'response_identifier');
					scope.assessment.response = find(data.responses,scope.assessment.item.response_identifier,'identifier');
				}
				scope.onImageLoad=function(){
					scope.imageHeight=$(iElement).find('.qti-ed-graphic-image img').height();
				};
				var toRefpath = function(path){
					var key = "/static";
					if(path&&path.indexOf(key)!=-1){
						path = "${ref-path}"+path.substring(path.indexOf(key)+key.length);
					}
					return path;
				}
				if(scope.assessment.item.object.data){
					scope.assessment.item.object.data = toRefpath(scope.assessment.item.object.data);
				}
			
			}
		};
	}]);
});