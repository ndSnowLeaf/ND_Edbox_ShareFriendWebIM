define(['require','question-module'],function(require,module){	 
	module.directive("resourcePreview", ['$identifier','$config','$sce','$console',function($identifier,$config,$sce,$console){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				items:'=',
				current:'='
			},
			templateUrl:'qti/other/tpl/resource-preview.html',
			controller:['$scope',function($scope){
				$scope.getPreviewUrl=function(){
					var type = $scope.current.type;
					var suffix = type=='video' ? 'mp4' : 'mp3';
					var src = $scope.current.src;
					if(src.indexOf("?")==-1){
						src = src+"?."+suffix;
					}
					else{
						src = src+"&."+suffix;
					}		
					return $sce.trustAsResourceUrl("/editor/basic-question/player.html?mediaUrl="+encodeURIComponent(src));
				};
				$scope.changePreview=function(item){
					$scope.current = item;
				}
				
			}],
			link : function($scope, iElement, iAttrs) { 
				$scope.select = $scope.current;
			}
		};
	}]);
});