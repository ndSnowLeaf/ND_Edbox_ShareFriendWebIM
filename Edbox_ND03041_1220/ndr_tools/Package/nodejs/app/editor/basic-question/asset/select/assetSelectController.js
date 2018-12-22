define(['require','question-module'],function(require,module){
	 
    module.controller("assetSelectController",['$scope','$requestInfo','$messenger',
		function($scope,$requestInfo,$messenger){
    	console.log("init controller ",assetSelectController);
	    	$scope.category=$requestInfo.params.category||'image';
			$scope.multiSelect=$requestInfo.params.select_type=='multiple';
	
			$scope.onAssetSelect=function(items){
				var hrefs=[],actualHrefs=[],ids=[];
				console.log(items);
				for(var i=0;i<items.length;i++){
					hrefs.push(items[i].href);
					actualHrefs.push(items[i].actualHref);
					ids.push(items[i].identifier);
				}
				$messenger.send({message:'AssetsSelected', data:hrefs,actualHrefs:actualHrefs,identifiers:ids});
			};
    	}
    ]);
});