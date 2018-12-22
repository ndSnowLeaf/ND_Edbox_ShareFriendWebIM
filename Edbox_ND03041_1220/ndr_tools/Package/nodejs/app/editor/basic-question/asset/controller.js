define(function(require){
	var $=require('jquery');
	return ['$scope','$i18n','$asset','$requestInfo','$console','$context','$timeout',function($scope,$i18n,$asset,$requestInfo,$console,$context,$timeout){
		$scope.pagination={page:1,size:28};
		$scope.category=$requestInfo.params.category||'image';
		$scope.items=[];
		$scope.keyword='';
		
		$scope.search=function(){
			$scope.pagination.page=1;
			$scope.doSearch();
		};
		$scope.doSearch=function(){
			var category=$scope.category;
			$asset.loadAssets(category,$scope.pagination.page,$scope.pagination.size,$scope.keyword||'',$context.coverage.common).success(function(data){
				var items=data.items;
				for(var i=0;i<items.length;i++){
					$asset.processItem(items[i],category);
				}
				$scope.items=items;
				$scope.pagination.totalItems=data.total_count;
			}).finally($console.wait($i18n('common.wait.load'),false));
		};
		$scope.search();

		$scope.remove=function(item){
			$console.confirm($i18n('common.hint.delete'),function(){
				if(item==$scope.selected){
					delete $scope.selected;
				}
				$asset.deleteAsset(item).success(function(){
					if($scope.items.length<=1){
						$scope.search();
						return;
					}
					var deleteIndex=-1;
					for(var i=0;i<$scope.items.length;i++){
						if(item==$scope.items[i]){
							deleteIndex=i;
							break;
						}
					}
					if(deleteIndex!=-1){
						$scope.items.splice(deleteIndex,1);
					}
				}).finally($console.wait($i18n('asset.wait.delete')));
			});
		};
		
		var getShortTitle=function(title){
			if(!title) return title;
			var i=title.lastIndexOf('.');
			return i==-1?title:title.substring(0,i);
		}
		$scope.beginEditTitle=function(item,$event){
			item.titleEditing=true;
			item.shortTitle=getShortTitle(item.title);
			var el=angular.element($event.target).parent().find('input');
			$timeout(function(){
				$(el).focus();
			},100);
		};
		$scope.cancelEditTitle=function(item){
			item.titleEditing=false;
		};
		$scope.updateTitle=function(item){
			$scope.cancelEditTitle(item);
			if(!item.shortTitle){
				return;
			}
			if(!item.title){
				item.title=item.shortTitle;
			}
			var i = item.title.lastIndexOf('.');
			item.title=i==-1?item.shortTitle:item.shortTitle+'.'+item.title.substring(i+1);
			if(item.language && item.language.indexOf('-')>=0) item.language=item.language.replace('-','_');
			$asset.updateAsset(item).success(function(){
				$console.message($i18n('common.hint.rename.success'));
			});
		};
		
		$scope.creator=$context.currentCreator();
		
		$scope.onItemCreated=function(item){
			$scope.items.unshift($asset.processItem(item,$scope.category));
		};

		$scope.upload=function(){
			$console.modal({
				template:'<div lc-asset-upload-single="{{category}}" asset-publisher="NetDragon" asset-creator="{{creator}}" asset-coverage="common" on-item-created="onItemCreated(item)"></div>',
				scope:$scope,
				size:'md'
			});
		};
	}];
});