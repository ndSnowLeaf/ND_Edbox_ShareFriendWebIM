define(['require','question-module'],function(require,module){	 
	 var resetIndex = function(array){
		for(var i=0;i<array.length;i++){
			array[i].index = i;
		}
	 }	
	module.directive("resourceNavigator", ['$identifier','$modal','$console','$timeout','$i18n',function($identifier,$modal,$console,$timeout,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				items:'=',
				current:'=?',
				showPreview:'@',
				onSelect:'&?'
			},
			templateUrl:'qti/other/tpl/resource-navigator.html',
			controller:['$scope',function($scope){
				 $scope.currentindex = 0;  
				 $scope.$watch("items.length",function(){
					resetIndex($scope.items);	
					var find = false;
					for(var i=0;i<$scope.items.length;i++){
						if($scope.items[i].newCreate){
							$scope.current = $scope.items[i];
							$scope.startIndex = $scope.current.index;
							$scope.items[i].newCreate = false;							
						}
					}					
				 });				
				 if(!$scope.current&&$scope.items.length>0){
					 $scope.current = $scope.items[0];
				 }
				 resetIndex($scope.items);
				 $scope.select=function(item){
					 $scope.current = item;		
					 $scope.startIndex = $scope.current.index;
					 if($scope.onSelect){
						 $scope.onSelect({item:item})
					 }
				 };
				 $scope.hasPrev = function(){
					return $scope.startIndex>=$scope.maxCount
				 }
				 $scope.previous =function(){					
					 var prevIndex = $scope.startIndex-$scope.maxCount;
					 if(prevIndex>=0){
						 $scope.startIndex = prevIndex;
						 return;
					 }
					 else{								  
						 $scope.startIndex = 0;
						return;
					 }	
				 };
				 $scope.next =function(){
					 var nextIndex = $scope.startIndex+$scope.maxCount;							 
					 if(nextIndex<$scope.items.length){
						 $scope.startIndex = nextIndex;
					 }
					 else{
						 $scope.startIndex = $scope.items.length-1;
					 }	 
					
									 
				 };
				 $scope.hasNext = function(){
					var page = Math.floor($scope.startIndex / $scope.maxCount)+1;
					var index = page*$scope.maxCount;
					return $scope.items.length > index;
				 }
				 $scope.deleteItem=function(item){
					 $console.confirm($i18n("common.confirm.delete"),function(){
						 var index = $scope.items.indexOf(item);
						 if(index!=-1){
							 var del = $scope.items.splice(index,1);						 
							 if($scope.current == del[0]){
								 if(index<$scope.items.length){
									 $scope.current = $scope.items[index];
								 }
								 else if(index-1<$scope.items.length){
									  $scope.current = $scope.items[index-1];
								 }
								 else{
									 $scope.current = null;
								 }
							 }						 
							 resetIndex($scope.items);
						 }
					 });
				 };
				 $scope.preview =function(item){
					 if(!$scope.showPreview) return;
					 var dialog = $modal.open({
							templateUrl:'qti/other/tpl/resource-dialog.html',							
							size:'lg',						
							title:$i18n("resource.asset.preview"),
							backdrop:false,
							controller:['$scope','$resolver',function(_scope,$resolver){
								_scope.current = item;
								_scope.items = $scope.items;
								_scope.deleteCurrent=function(){									
									$console.confirm($i18n("common.confirm.delete"),function(){
										var item = _scope.current;
										var index = _scope.items.indexOf(item);
										if(index!=-1){
											 var del = _scope.items.splice(index,1);						 
											 if(_scope.current == del[0]){
												 if(index<_scope.items.length){
													 _scope.current = _scope.items[index];
												 }
												 else if(index-1<_scope.items.length){
													  _scope.current = _scope.items[index-1];
												 }
												 else{
													 _scope.current = null;
												 }
											 }						 
											 resetIndex(_scope.items);											 
											 if(del[0] == $scope.current){
												 $scope.current = _scope.current;
											 }
										 }
										if(_scope.items.length == 0){
											dialog.close();
										}
									 });
								}
							}]
					});    				
				 };
				 
			}],
			link : function($scope, element, iAttrs) {
				$scope.startIndex = $scope.current.index;
				var itemWidth = 153;
				
				$(window).resize(function(){
					$timeout(function(){
						$scope.changeElementWidth();
					});
				})
				$scope.changeElementWidth = function(){
					 var width = $(element).width();
					 $scope.maxCount = Math.floor(width/itemWidth);
					 return $scope.maxCount;
				}				
				$scope.inRange = function(item){
					var page = Math.floor($scope.startIndex / $scope.maxCount)+1;
					var index = item.index;
					var max = Math.min($scope.items.length,page*$scope.maxCount);					
					if(index>=max-$scope.maxCount&&index<max){
						return true;
					}
					return false;
				}
				$timeout(function(){
					$scope.changeElementWidth();
				});
			}
		};
	}]);
});