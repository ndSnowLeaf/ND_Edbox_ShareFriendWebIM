define(['require','question-module','jquery','plupload'],function(require,module){
	require('plupload');
	var $=require('jquery');
	module.directive("lcAssetUpload", ['$asset','$context','$document','$console','$window','$q','$i18n','$filter','$timeout','$url','$auth','$requestInfo','$stateParams','$config',
	                                   function($asset,$context,$document,$console,$window,$q,$i18n,$filter,$timeout,$url,$auth,$requestInfo,$stateParams,$config){
		return {
			restrict:'A',
			scope:{
				onItemCreated:'&',
				uploadItems:'=',
				assetSpace:'@',
				assetCoverage:'@'
			},
			link: function(scope, iElement, iAttrs) {
				var uploadBasePath="/lib/plu/";
				var url='#';
				var chunkSize='1mb';
				var filters = {};
				var category = iAttrs.lcAssetUpload||'image';
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
				
				var uploadConfig={
					runtimes : 'html5,flash,silverlight,html4',
					browse_button : iElement[0],
					container: iElement.parent()[0],
					url : url,
					flash_swf_url : uploadBasePath+'/lib/plu/Moxie.swf',
					silverlight_xap_url : uploadBasePath+'Moxie.xap',
					//chunk_size: chunkSize,
					headers:{},
					filters : filters,
					init: {
						PostInit: function(up) {
						},
						FilesAdded: function(up, files) {
							if(!scope.$root.$$phase){
								scope.$apply(function(){
									scope.onFilesAdded(up, files);
								});
							}else{
								scope.onFilesAdded(up, files);
							}
						},
						BeforeUpload:function(up,file){
							if(!scope.$root.$$phase){
								scope.$apply(function(){
									scope.onBeforeUpload(up,file);
								});
							}else{
								scope.onBeforeUpload(up,file);
							}
						},
						UploadProgress: function(up, file) {
							if(!scope.$root.$$phase){
								scope.$apply(function(){
									scope.onUploadProgress(up,file);
								});
							}else{
								scope.onUploadProgress(up,file);
							}
						},
				        FileUploaded:function(up,file,data){
				        	if(!scope.$root.$$phase){
								scope.$apply(function(){
									scope.onFileUploaded(up,file,data);
								});
							}else{
								scope.onFileUploaded(up,file,data);
							}
				        },
						Error: function(up, err) {
							if(!scope.$root.$$phase){
								scope.$apply(function(){
									scope.onError(up, err);
								});
							}else{
								scope.onError(up, err);
							}
						}
					}
				};
				
				scope.uploader = new plupload.Uploader(uploadConfig);
				scope.uploader.init();
				
				var processFile=function(file,item){
					return $q.when(item);
					/*var defererd=$q.defer();
					if(category=='image'){
						var image=document.createElement('img');
		                image.onload=function(e) {
		                    ($window.URL||$window.webkitURL).revokeObjectURL(this.src);
		                    item.resolution=this.width+'*'+this.height;
		                    defererd.resolve(item);
		                };
		                image.onerror=function(e){
		                	($window.URL||$window.webkitURL).revokeObjectURL(this.src);
		                    defererd.resolve(item);
		                };
	                    image.src = ($window.URL||$window.webkitURL).createObjectURL(file.getNative());
					}else if(category=='video'){
	                    var video=document.createElement('video');
	                    video.preload = 'metadata';
		                video.onloadedmetadata=function(e) {
		                    ($window.URL||$window.webkitURL).revokeObjectURL(this.src);
		                    var duration = parseInt(this.duration);
		                    if(isNaN(duration)) duration=-1;
		                    item.duration = duration;
		                    item.resolution=this.videoWidth+'*'+this.videoHeight;
		                    defererd.resolve(item);
		                };
		                video.onerror=function(e){
		                	($window.URL||$window.webkitURL).revokeObjectURL(this.src);
		                    item.duration = 0;
		                    defererd.resolve(item);
		                };
	                    video.src = ($window.URL||$window.webkitURL).createObjectURL(file.getNative());
					}else if(category=='audio'){
	                    var audio = document.createElement('audio');
	                    audio.preload='metadata';
		                audio.oncanplaythrough=function(e) {
		                    ($window.URL||$window.webkitURL).revokeObjectURL(this.src);
		                    var duration = parseInt(this.duration);
		                    if(isNaN(duration)) duration=-1;
		                    item.duration = duration;
		                    defererd.resolve(item);
		                };
		                audio.onerror=function(e){
		                	($window.URL||$window.webkitURL).revokeObjectURL(this.src);
	                        item.duration = 0;
	                        defererd.resolve(item);
	                    };
		                audio.src = ($window.URL||$window.webkitURL).createObjectURL(file.getNative());
					}
					return defererd.promise;*/
				};
				
				var fileItemMapping={};
				scope.uploadItems=[];
				scope.uploadItems.removeItem=function(item){
					scope.uploader.removeFile(item.fileId);
					var deleteIndex = -1;
					for (var i = 0; i < scope.uploadItems.length; i++) {
						if (scope.uploadItems[i] == item) {
							deleteIndex = i;
							break;
						}
					}
					if (deleteIndex != -1) {
						scope.uploadItems.splice(deleteIndex, 1);
					}
					delete fileItemMapping[item.fileId];
				};
				scope.onFilesAdded=function(up,files){
					for(var i=0;i<files.length;i++){
						var file=files[i];
						var newItem = {
							progress:0,
							size:'0mb',
							title:file.name,
							fullsize:plupload.formatSize(file.size),
							fileId:file.id
						};
						scope.uploadItems.push(newItem);
						fileItemMapping[file.id] = newItem;
					};
					if(up.state!=plupload.STARTED){
						scope.nextUpload();
					}
				};
				
				scope.nextUpload=function(){
					scope.uploader.stop();
					var file = scope.uploader.files[scope.uploader.total.uploaded+scope.uploader.total.failed];
					if(file){
						/*$q.all([processFile(file,fileItemMapping[file.id]),$asset.getUploadInfo(scope.assetSpace).success(angular.bind({file:file},function(data){
							fileItemMapping[this.file.id].uploadUrl=data.upload_url;
							fileItemMapping[this.file.id].identifier=data.resource_id;
							fileItemMapping[this.file.id].csPath=data.dist_path;
						}))]).then(function(){
							scope.uploader.start();
						});*/
						$timeout(function(){
							var chapter_id = $requestInfo.params.chapter_id;
			
							fileItemMapping[file.id].uploadUrl=$url.portal('/'+$asset.version()+'/assets/actions/upload',
									{asset_type:assetType,coverage:scope.assetCoverage,chapter_id:chapter_id,file_path:$url.getFilePath(),
										is_interaction:$stateParams.is_interaction,question_id:$stateParams.id,question_base:$stateParams.question_base});
							scope.uploader.start();
						});
					}
				};
				
				scope.onBeforeUpload=function(up,file){
					up.setOption('url',fileItemMapping[file.id].uploadUrl);					
					var authKey = $auth.generateAuthHeader(fileItemMapping[file.id].uploadUrl,'POST');	
					up.setOption("headers",{Authorization:authKey});
					/*var idx = file.name.lastIndexOf('.'),suffix='';
					if(idx!=-1){
						suffix=file.name.substring(idx);
					}
					var fileName = Date.parse(new Date()) + suffix;
					up.setOption("multipart_params",{
						path:fileItemMapping[file.id].csPath,
						name:fileName,
						file_title: file.name,
						file_description:'',
						file_type:file.type,
						scope:1,
						size:file.size
					});*/
				};
				
				scope.onUploadProgress=function(up, file) {
					var item = fileItemMapping[file.id];
					item.progress= file.percent+'%';
					item.size =plupload.formatSize(file.loaded);
				};
				
				scope.onFileUploaded=function(up,file,data){
					scope.nextUpload();
					var response=angular.fromJson(data.response);
		            //var dentry = response.dentry;
					var identifier = response.identifier;
		            var uploadItem = fileItemMapping[file.id];
		            if(identifier){
					     var deleteIndex=-1;
					     for(var i=0;i<scope.uploadItems.length;i++){
					    	if(scope.uploadItems[i]==uploadItem){
					    		deleteIndex=i;
					    		break;
					     	}
					     }
					     if(deleteIndex!=-1){
					    	 scope.uploadItems.splice(deleteIndex,1);
					     }
					     delete fileItemMapping[file.id];
					     scope.onItemCreated({item:response});
					     
		            }
		        };
		        
		        scope.onError=function(up, err) {
					var item = fileItemMapping[err.file.id];
					var errorMessage;
					try{
						var response=angular.fromJson(err.response);
						errorMessage=response.message;
					}catch(e){}
					errorMessage=errorMessage||err.message;
					if(item){
						item.error=true;
						item.errorMessage=errorMessage;
					}else{
						$console.message(err.file.name+' : '+errorMessage);
					}
				};
			}
		};
	}]);
});