define(['require','question-module'],function(require,module){	
	function parseResolutionToSize(resolution){
		if(resolution && resolution.indexOf("*")!=-1){
			var parts = resolution.split("*");
			if(parts.length == 2){
				return {width:parseInt(parts[0]),height:parseInt(parts[1])};
			}
		}
	};
	module.factory("$asset",['$http','$url','$stateParams','$config','$auth','$context',function($http,$url,$stateParams,$config,$auth,$context){
		var version = function(){
			if($stateParams.is_interaction){
				return "v1.3";
			}
			return "v2.0"
		}
		return {
			version: function(){
				return version();
			},
			loadAssets:function(category,page,size,keyword,coverage,chapterId,maxSize){
				var type = (category=='video'?'$RA0103':(category=='audio'?'$RA0102':'$RA0101'));
				return $http.get($url.slides('/'+version()+'/assets',{
					type:type,
					coverage:coverage,
					page:page,
					size:size,
					words:keyword,
					chapter_id:chapterId,
					slideServer:$config.slideServer2,
					csserver:$config.csServer2,
					main_type:$stateParams.main_type,
					question_id:$stateParams.id,
					question_base:$stateParams.question_base || '',
					is_interaction:$stateParams.is_interaction || '',
					file_path: $url.getFilePath(),
					max_size:maxSize
				}));
			},
			getUploadInfo:function(space){
				return $http.get($url.portal('/v0.9/resources/assets/upload_info'+$url.getExtraInfo(),{space:space}));
			},
			createAsset:function(metadata){
				return $http.post($url.portal('/'+version()+'/assets'+$url.getExtraInfo()),metadata);
			},
			deleteAsset:function(metadata){
				return $http['delete']($url.portal('/'+version()+'/assets/{0}'+$url.getExtraInfo(),metadata.identifier));
			},
			updateAsset:function(metadata){
				return $http.put($url.portal('/'+version()+'/assets/{0}'+$url.getExtraInfo(),metadata.identifier),metadata);
			},
			check_net:function(){
				return $http.get($config.checkUrl+"?version="+new Date().getTime());
			},
			processItem:function(item,category){ 
				if(!item.tech_info||!item.tech_info.href){
					return item;
				}
				item.href=item.tech_info.href.location;
				var thumbHref;
				
				if(category!='video'&&category!='audio'&&item.preview){
					for(var key in item.preview){
						thumbHref = $url.ref(item.preview[key]);
					}
				}
				if(!thumbHref){
					if('image'==category){
						thumbHref=$url.ref(item.href);
					}else if('video'==category){
					}else if('audio'==category){
					}else{
					}
				}
				item.thumbHref=thumbHref;
				item.actualHref=$url.ref(item.href);
				if(category=='image'){
					item.previewHref=item.actualHref;
				}else{
					var media = item.preview&&item.preview.media ? item.preview.media : item.actualHref;
					if(media.indexOf("?")==-1){
						media = media+"?";
					}
					else{
						media = media+"&";
					}
					item.previewHref=$url.slides('/editor/basic-question/player.html',{
						mediaUrl:media+(category=='video'?'.mp4':'.mp3')
					});
				}
				
				if(item.tech_info.href.requirements && item.tech_info.href.requirements.length){
					for(var i=0;i<item.tech_info.href.requirements.length;i++){
						var x=item.tech_info.href.requirements[i];
						if(x.name&&x.name.toLowerCase()=='resolution'){
							item.resolution=x.value;
							angular.extend(item,parseResolutionToSize(item.resolution));
						}else if(x.name&&x.name.toLowerCase()=='duration'){
							item.duration=x.value;
						}
					}
				}

				//�޸�bug-41840��Ԥ��ʱ�����أ�proxy�����ص������У�proxy2����
				if(!!item.previewHref) {
					item.previewHref = item.previewHref.replace('proxy', 'proxy2');
				}

				return item;
			}
		};
	}]);
});