define(['require','question-module'],function(require,module){	
    module.controller("assetSelectController",['$scope','$requestInfo','$messenger',
		function($scope,$requestInfo,$messenger){
	    	$scope.category=$requestInfo.params.category||'image';
			$scope.multiSelect=$requestInfo.params.select_type=='multiple';
	
			$scope.onAssetSelect=function(items){
				var hrefs=[],actualHrefs=[],ids=[],titles=[];
				for(var i=0;i<items.length;i++){
					hrefs.push(items[i].href);
					actualHrefs.push(items[i].actualHref);
					ids.push(items[i].identifier);
					titles.push(items[i].title);
				}
				$messenger.send({message:'AssetsSelected', data:hrefs,actualHrefs:actualHrefs,identifiers:ids,titles:titles});
			};
    	}
    ]);
});