define(['require','question-module','jquery','plupload'],function(require,module){
	var $=require('jquery');	
	module.directive("lcAssetSelect", ['$asset','$i18n','$context','$console','$timeout','$document','$filter'
		,'$config','$stateParams',function($asset,$i18n,$context,$console,$timeout,$document,$filter,$config,$stateParams){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				handler:'@',
				firstLoad:'@',
				category:'@',
				onSelect:'&',
				multiSelect:'@',
				assetSpace:'@',
				chapterIds:'=',
				defaultKeyword:'='
			},
			templateUrl:'asset/$directives/lcAssetSelect.html',
			controller:['$scope',function($scope){
				var maxSizeParam = $stateParams.max_size || $config.maxfilesize.image;
				var getDefaultPreview = function(type){
					if(type=='image'){
						return '/editor/basic-question/asset/images/default_image.png';
					}
					if(type=='video'){
						return '/editor/basic-question/asset/images/default_video.png';
					}
					if(type=='audio'){
						return '/editor/basic-question/asset/images/default_music.png';
					}
				}
				$scope.defaultPreview = getDefaultPreview($scope.category);
				$scope.currentuser = $context.currentUser().userId;
				var filters = {};
				var category = $scope.category ||'image';
				var assetType = category=='image'?"$RA0101":(category=='video'?"$RA0103":"$RA0102");
				if(category=='image'){
					filters = {
						max_file_size : $config.maxfilesize.image*100,
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

				$scope.lang = $context.getLang();




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
				$scope.isPersonal=($scope.assetSpace||$context.resourceSpace)=='personal';
				$scope.store='local';
				$scope.localPagination={page:1,size:24};
				$scope.minePagination={page:1,size:24};
				$scope.ndChapterPagination={page:1,size:24};
				$scope.ndPagination={page:1,size:24};
				$scope.bdPagination={page:1,size:24};
				$scope.mineKeyword = '';
				$scope.keyword = filterKeyword($scope.defautlKeyword||$stateParams.chapter_name||'');
				$scope.keyword2 =filterKeyword($scope.defautlKeyword||$stateParams.chapter_name||'');


				$scope.$watch("defaultKeyword",function(newValue,oldValue){
					if($scope.defaultKeyword){
						if($scope.keyword==''||$scope.keyword2==''){
							if($scope.keyword==''){
								$scope.keyword = filterKeyword($scope.defaultKeyword);
							}
							if($scope.keyword2==''){
								$scope.keyword2 = filterKeyword($scope.defaultKeyword);
							}
							//if($scope.mineKeyword==''){
							//	$scope.mineKeyword = filterKeyword($scope.defaultKeyword);
							//}
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
				function join(url,params){
					if(url){
						if(url.indexOf("?")==-1){
							url = url+"?size=1200&";
						}
						return url + params;
					}
				}
				function identifyInteraction(item, category) {
					if(!!$stateParams.is_interaction) {
						var extra_params = '&from_ref_base=true&is_interaction=' + ($stateParams.is_interaction || '');

						item.thumbHref = join(item.thumbHref,extra_params);
						item.actualHref = join(item.actualHref,extra_params);

						if(!!item.previewHref) {
							if(category === 'video' || category === 'audio') {
								item.previewHref = join(item.previewHref ,'%26from_ref_base=true%26is_interaction=' + ($stateParams.is_interaction || ''));
							} else {
								item.previewHref = join(item.previewHref,'&from_ref_base=true&is_interaction=' + ($stateParams.is_interaction || ''));
							}
						}
					}
				}
				
				$scope.search=function(){
					if($scope.store=='local'){
						$scope.localPagination.page=1;
						$scope.doSearchLocal();
					}
					else if($scope.store=='mine'){
						$scope.minePagination.page=1;
						$scope.doSearchMine();
					}else if($scope.store=='ndChapter'){
						$scope.ndChapterPagination.page=1;
						$scope.doSearchNdChapter();
					}else if($scope.store=='nd'){
						$scope.ndPagination.page=1;
						$scope.doSearchNd();
					}else if($scope.store=='baidu'){
						$scope.doSearchBaidu();
					}
				};
				$scope.refresh=function(){
					if($scope.store=='local'){
						$scope.doSearchLocal();
					}
					else if($scope.store=='mine'){
						$scope.doSearchMine();
					}else if($scope.store=='ndChapter'){
						$scope.doSearchNdChapter();
					}else if($scope.store=='nd'){
						$scope.doSearchNd();
					}
					else if($scope.store=='baidu'){
						$scope.doSearchBaidu();
					}
				};
				function finishLoad (){
					var callback = $console.wait($i18n('common.wait.load'),false);
					return function(result){
						callback(result);
						$scope.loading=false;
					}
				}
				$scope.doSearchLocal=function(){
					var category=$scope.category||'image';
					delete $scope.selected;
					$scope.localItems=[];
					$scope.loading = true;
					$asset.loadAssets(category,
							$scope.minePagination.page,
							$scope.minePagination.size,
							'',
							'local'
					).success(function(data){
						var items=data.items;
						for(var i=0;i<items.length;i++){
							$asset.processItem(items[i],category);
							identifyInteraction(items[i], category);
						}
						$scope.localItems=items;
						$scope.localPagination.totalItems=data.total_count;

					}).finally(finishLoad());
				};

				$scope.doSearchMine=function(){
					var category=$scope.category||'image';
					delete $scope.selected;
					$scope.mineItems=[];
					$scope.loading = true;
					$asset.loadAssets(category,
							$scope.minePagination.page,
							$scope.minePagination.size,
							$scope.mineKeyword||'',
							$context.coverage.user,
							'',
							maxSizeParam
					).success(function(data){
						var items=data.items;
						for(var i=0;i<items.length;i++){
							$asset.processItem(items[i],category);

							/**
							 * 针对趣味习题(is_interaction=interaction)，做特殊处理
							 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
							 * @type {string}
							 */
							identifyInteraction(items[i], category);
						}
						$scope.mineItems=items;
						$scope.minePagination.totalItems=data.total_count;
						$scope.loading=false;
					}).finally(finishLoad());
				};
				$scope.doSearchNdChapter=function(page,size){
					var category=$scope.category||'image';
					delete $scope.selected;
					$scope.ndChapterItems=[];
					$scope.loading = true;
					$asset.loadAssets(category,
							$scope.ndChapterPagination.page,
							$scope.ndChapterPagination.size,
							$scope.keyword||'',
							$context.coverage.common,
							$scope.chapterIds && $scope.chapterIds[0],
							maxSizeParam
					).success(function(data){
						var items=data.items;
						for(var i=0;i<items.length;i++){
							$asset.processItem(items[i],category);

							/**
							 * 针对趣味习题(is_interaction=interaction)，做特殊处理
							 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
							 * @type {string}
							 */
							identifyInteraction(items[i], category);
						}
						$scope.ndChapterItems=items;
						$scope.ndChapterPagination.totalItems=data.total_count;
						$scope.loading=false;
					}).finally(finishLoad());
				};
				$scope.doSearchNd=function(page,size){
					var category=$scope.category||'image';
					delete $scope.selected;
					$scope.ndItems=[];
					$scope.loading = true;
					$asset.loadAssets(category,
							$scope.ndPagination.page,
							$scope.ndPagination.size,
							$scope.keyword||'',
							$context.coverage.common,
							'',
							maxSizeParam
					).success(function(data){
						var items=data.items;
						for(var i=0;i<items.length;i++){
							$asset.processItem(items[i],category);

							/**
							 * 针对趣味习题(is_interaction=interaction)，做特殊处理
							 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
							 * @type {string}
							 */
							identifyInteraction(items[i], category);
						}
						$scope.ndItems=items;
						$scope.ndPagination.totalItems=data.total_count;
						$scope.loading=false;
					}).finally(finishLoad());
				};
				$scope.doSearchBaidu=function(page,size){	 
					var category='image';
					delete $scope.selected;
					$scope.bdItems=[];
					$scope.loading = true;
					$asset.loadAssets(category,
							$scope.bdPagination.page,
							$scope.bdPagination.size,
							$scope.keyword2||'',
							$context.coverage.baidu,
							'',
							maxSizeParam
					).success(function(data){
						var items=data.items;
						for(var i=0;i<items.length;i++){
							$asset.processItem(items[i],category);

							/**
							 * 针对趣味习题(is_interaction=interaction)，做特殊处理
							 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
							 * @type {string}
							 */
							identifyInteraction(items[i], category);
						}
						$scope.bdItems=items;
						$scope.bdPagination.totalItems=data.total_count;
						$scope.loading=false;
					}).finally(finishLoad());
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
						var items= $scope.store=='local'? $scope.localItems :($scope.store=='mine'?$scope.mineItems:($scope.store=='ndChapter'?$scope.ndChapterItems:$scope.ndItems));
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
				$scope.onLocalItemCreated=function(item){
					$scope.localItems.unshift($asset.processItem(item,$scope.category));

					/**
					 * 针对趣味习题(is_interaction=interaction)，做特殊处理
					 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
					 * @type {string}
					 */
					identifyInteraction(item, $scope.category);
					$scope.select(item);
				};
				$scope.onMineItemCreated=function(item){
					$scope.mineItems.unshift($asset.processItem(item,$scope.category));

					/**
					 * 针对趣味习题(is_interaction=interaction)，做特殊处理
					 * 传送参数is_interaction，后端根据该参数判断是否为趣味习题
					 * @type {string}
					 */
					identifyInteraction(item, $scope.category);

					$scope.select(item);
				};
				
				$scope.onNdChapterItemCreated=function(item){
					$scope.ndChapterItems.unshift($asset.processItem(item,$scope.category));
				};
				
				$scope.onNdItemCreated=function(item){
					$scope.ndItems.unshift($asset.processItem(item,$scope.category));
				};
			}],
			link : function($scope, iElement, iAttrs) {
				$asset.check_net().then(function(result){
					$scope.net = true;
					result.handle = true;
				},function(result){
					$scope.net = false;
					result.handle = true;
				});
				
				if($scope.handler){
					$scope.$parent.$eval(function(s){
						s[$scope.handler]={
							refresh:$scope.refresh
						};
					});
				}
			}
		};
	}]);
});