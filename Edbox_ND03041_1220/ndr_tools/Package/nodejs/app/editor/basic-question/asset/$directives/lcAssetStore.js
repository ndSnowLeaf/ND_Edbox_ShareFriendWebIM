define(['require','question-module','jquery','plupload'],function(require,module){
	var $=require('jquery');	
	module.directive("lcAssetStore", ['$asset','$i18n','$context','$console','$timeout','$document',
			'$filter','$config','$stateParams',
			function($asset,$i18n,$context,$console,$timeout,$document,$filter,$config,$stateParams){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				category:'@',
				onSelect:'&',
				multiSelect:'@',
				coverage:'@',
				defaultKeyword:'=',
				searchAction:"&",
				loading:'='
			},
			templateUrl:'asset/$directives/lcAssetStore.html',
			controller:['$scope',function($scope){				
				var filters = {};
				var category = $scope.category ||'image';
				var assetType = category=='image'?"$RA0101":(category=='video'?"$RA0103":"$RA0102");
				if(category=='image'){
					filters = {
						max_file_size : $config.maxfilesize.image,
						mime_types: [
							{title : $i18n('resource.label.file_type.image'), extensions : "jpg,jpeg,gif,png,bmp"} 
						]
					};
				}else if(category=='audio'){
					filters = {
						max_file_size : $config.maxfilesize.audio,
						mime_types: [
							{title : $i18n('resource.label.file_type.audio'), extensions : "mp3"}
						]
					};
				}else{
					filters = {
						max_file_size :$config.maxfilesize.video,
						mime_types: [
							{title : $i18n('resource.label.file_type.video'), extensions : "mp4"}								
						]
					};
				}
				//过滤首尾空格
				//过滤数字+空格
				//过滤 （文字）
				var filterKeyword = function(str){
					var isEmpty = function(value){
						return !value.trim();
					}
					var isSkip = function(value){
						value = value.trim();
						//数字开头 
						if(value.match(/^[0123456789\.]*$/gi)!=null){
							return true;
						}
						//实验：
						if(value.match(/^实验：$/gi)!=null){
							return true;
						}
						//章、节、课：
						if(value.match(/^第.*?(章|节|课)$/gi)!=null){
							return true;
						}
						if(value.match(/^(附录|问题研究)/gi)!=null){
							return true;
						}
						return false;
					}
					if(!str) return str;
					str = str.trim();
					var values = str.split(" ");
					var fvalues = [];
					var first = true;
					for(var i=0;i<values.length;i++){
						if(!first){
							fvalues.push(values[i].trim());
						}
						else{
							if(!isEmpty(values[i])&&!isSkip(values[i])){
								fvalues.push(values[i].trim());
								first = false;
							}
						}
					}
					var value = fvalues.join(" ");
					value = value.replace(/\(.*?\)/gi,"");
					value = value.replace(/（.*?）/gi,"");
					return value.trim();
				}
				$scope.pagination={page:1,size:24};
				$scope.keyword = filterKeyword($scope.defautlKeyword||$stateParams.chapter_name||'');

				$scope.$watch("defaultKeyword",function(newValue,oldValue){
					if($scope.defaultKeyword){
						if($scope.keyword==''||$scope.keyword2==''){
							if($scope.keyword==''){
								$scope.keyword = filterKeyword($scope.defaultKeyword);
							}
							if($scope.keyword2==''){
								$scope.keyword2 = filterKeyword($scope.defaultKeyword);
							}	
							$scope.search();
						}
					}
				});
				var multiSelect=$scope.multiSelect==='true';

				/**
				 * 针对趣味习题(is_interaction=interaction)，做特殊处理
				 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
				 * @type {string}
				 */
				function identifyInteraction(item, category) {
					if(!!$stateParams.is_interaction) {
						var extra_params = '&from_ref_base=true&is_interaction=' + ($stateParams.is_interaction || '');

						!!item.thumbHref && (item.thumbHref += extra_params);
						!!item.actualHref && (item.actualHref += extra_params);

						if(!!item.previewHref) {
							if(category === 'video' || category === 'audio') {
								item.previewHref += '%26from_ref_base=true%26is_interaction=' + ($stateParams.is_interaction || '')
							} else {
								item.previewHref += '&from_ref_base=true&is_interaction=' + ($stateParams.is_interaction || '')
							}
						}
					}
				}
				
				$scope.search=function(){
					$scope.minePagination.page=1;
					$scope.doSearch();
				};
				$scope.refresh=function(){
					$scope.doSearch();
				};

				$scope.doSearch=function(){
					var category=$scope.category||'image';
					delete $scope.selected;
					$scope.mineItems=[];
					$scope.loading = true;
					$scope.searchAction(category,
							$scope.minePagination.page,
							$scope.minePagination.size,
							$scope.keyword||'',
							$context.coverage.user
					).success(function(data){
						var items=data.items;
						for(var i=0;i<items.length;i++){
							$asset.processItem(items[i],category);
							identifyInteraction(items[i], category);
						}
						$scope.items=items;
						$scope.pagination.totalItems=data.total_count;
						$scope.loading=false;
					}).finally($console.wait($i18n('common.wait.load'),false));
				};
				if($scope.firstLoad==='true'){
					$scope.search();
				}
				
				$scope.remove=function(item){
					$console.confirm($i18n('common.hint.delete'),function(){
						if(item==$scope.selected){
							delete $scope.selected;
						}
						$asset.deleteAsset(item).success(function(){
							if($scope.mineItems.length<=1){
								$scope.search();
								return;
							}
							var deleteIndex=-1;
							for(var i=0;i<$scope.mineItems.length;i++){
								if(item==$scope.mineItems[i]){
									deleteIndex=i;
									break;
								}
							}
							if(deleteIndex!=-1){
								$scope.mineItems.splice(deleteIndex,1);
							}
						}).finally($console.wait($i18n('common.wait.delete')));;
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
					var i = item.title.lastIndexOf('.');
					var suffix = i==-1? '':item.title.substring(i+1);
					if(item.shortTitle.length+suffix.length>=100){
						$console.error($i18n("resource.error.title.maxlength"));
						return;
					}
					if(!item.title){
						item.title=item.shortTitle;
					}					
					item.title=i==-1?item.shortTitle:item.shortTitle+'.'+suffix;
					$asset.updateAsset(item).success(function(){
						$console.message($i18n('common.hint.rename.success'));
					});
				};

				$scope.select=function(item){
					if(multiSelect){
						item._selected=!item._selected;
					}else{
						$scope.selected=item;
					}
				};
				$scope.doSelect=function(){
					if(multiSelect){
						var items=$scope.items;
						var selecteds=[];
						if(items && items.length){
							for(var i=0;i<items.length;i++){
								if(items[i]._selected){
									selecteds.push(items[i]);
								}
							}
						}
						if(!selecteds.length){
							$console.message($i18n('asset.validate.require.select','asset.label.'+$scope.category,true));
						}else{
							$scope.onSelect({items:selecteds});
						}
					}else{
						if(!$scope.selected){							
							$console.message($i18n('asset.validate.require.select','asset.label.'+$scope.category,true));
						}else{
							var size = $scope.selected.tech_info.href.size;
							if(size&&size> filters.max_file_size*1.0){
								$console.message($i18n('asset.maxsize.select',[$i18n('asset.label.'+$scope.category),plupload.formatSize(filters.max_file_size)]));
								return;
							}
							$scope.onSelect({item:$scope.selected,items:[$scope.selected]});
						}
					}
				};
				$scope.gotoStore=function(name){
					if($scope.loading) return;
					$scope.store=name;
					$scope.refresh();
				};
				
				$scope.creator=$context.currentCreator();				 
				$scope.creatorName=$context.currentUser().nickName;
				$scope.cancelUpload=function(uploadItems,item){
					$console.confirm($i18n('common.hint.cancel'),function(){
						uploadItems.removeItem(item);
					});
				};
				
				$scope.onItemCreated=function(item){
					$scope.items.unshift($asset.processItem(item,$scope.category));

					/**
					 * 针对趣味习题(is_interaction=interaction)，做特殊处理
					 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
					 * @type {string}
					 */
					identifyInteraction(item, $scope.category);

					$scope.select(item);
				};
			}],
			link : function($scope, iElement, iAttrs) {

			}
		};
	}]);
});