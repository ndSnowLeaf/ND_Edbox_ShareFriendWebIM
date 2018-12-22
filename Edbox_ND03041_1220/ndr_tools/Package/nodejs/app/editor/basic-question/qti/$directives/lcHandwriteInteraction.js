define(['require','question-module'],function(require,module){
	var itemType='handwrite';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"file","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,
			"choices":[],"min_choices":0,"max_choices":1,"object":{"data":"","width":"1000","height":"600"}
		};
	};
	module.directive("lcHandwriteInteraction", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcHandwriteInteraction.html',
			controller:['$scope',function($scope){
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
						return width<=1280&&height<=1600;
					}
				};
				$scope.onImageSelect=function(item){
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
				if(!scope.assessment._width){
					scope.assessment._width=500;
				}
				if(!scope.assessment._height){
					scope.assessment._height=300;
				}
				if(!scope.assessment.response){
					scope.assessment.response=createResponse('s-'+$identifier.guid());
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem(scope.assessment.response.identifier);
				}
				scope.assessment.beforeCommit=function(a,errors){
					a.item.object.width=a._width+'';
					a.item.object.height=a._height+'';
				};
			}
		};
	}]);
});