define(['require','question-module','jquery','plupload'],function(require,module){
	require('plupload');
	var $=require('jquery');
	module.directive("lcAssetUploadSingle",  ['$asset','$context','$console','$document','$window','$q','$i18n','$filter',function($asset,$context,$console,$document,$window,$q,$i18n,$filter){
		return {
			restrict:'A',
			scope:{
				onItemCreated:'&'
			},
			templateUrl:'asset/$directives/lcAssetUploadSingle.html',
			link: function(scope, iElement, iAttrs) {
				var uploadBasePath="/lib/plu/";
				var url='#';
				var chunkSize='1mb';
				var filters = {};
				var category = scope.category = iAttrs.lcAssetUploadSingle||'image';
				if(category=='image'){
					filters = {
						max_file_size : '5mb',
						mime_types: [
							{title : $i18n('resource.label.file_type.image'), extensions : "jpg,gif,png,bmp"} 
						]
					};
				}else if(category=='audio'){
					filters = {
						max_file_size : '100mb',
						mime_types: [
							{title : $i18n('resource.label.file_type.audio'), extensions : "mp3"}
						]
					};
				}else{
					filters = {
						max_file_size : '1000mb',
						mime_types: [
							{title : $i18n('resource.label.file_type.video'), extensions : "mp4"}
						]
					};
				}
				var uploadConfig={
					runtimes : 'html5,flash,silverlight,html4',
					browse_button : $(iElement).find('.upload-area')[0],
					url : url,
					flash_swf_url : uploadBasePath+'/lib/plu/Moxie.swf',
					silverlight_xap_url : uploadBasePath+'Moxie.xap',
					chunk_size: chunkSize,
					headers:{},
					filters : filters,
					multi_selection:false,
					init: {
						PostInit: function(up) {
						},
						FilesAdded: function(up, files) {
							scope.onFilesAdded(up, files);
						},
						BeforeUpload:function(up,file){
							scope.onBeforeUpload(up,file);
						},
						UploadProgress: function(up, file) {
							scope.onUploadProgress(up,file);
						},
				        FileUploaded:function(up,file,data){            
				        	scope.onFileUploaded(up,file,data);
				        },
						Error: function(up, err) {
							scope.onError(up, err);
						}
					}
				};
				
				scope.uploader = new plupload.Uploader(uploadConfig);
				scope.uploader.init();
				
				var processFile=function(file,item){
					var defererd=$q.defer();
					if(category=='image'){
						if(window.FileReader){
							item.duration=0;
							var nativeFile = file.getNative();
							var mimeType = (file.type || nativeFile.type);
							if (mimeType && mimeType.indexOf('image/') == 0) {
								var fr = new FileReader();
								fr.onload = function(e, f) {
									var img=new Image();
									img.onload = function(e) {
										item.resolution=this.width+'*'+this.height;
										defererd.resolve(item);
	                                };
	                                img.onerror=function(){
	                                	defererd.resolve(item);
	                                };
	                                img.src = e.target.result;
									item.src = e.target.result;
									scope.$digest();
								};
								fr.readAsDataURL(nativeFile);
							}
						}else{
							defererd.resolve(item);
						}
					}else if(category=='video'){
	                    var video=angular.element('video')[0];
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
	                    var audio = angular.element('audio')[0];;
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
					return defererd.promise;
				};
				
				scope.onFilesAdded=function(up,files){
					var allFiles=up.files;
					for(var i=0;i<allFiles.length-files.length;i++){
						if(allFiles[i].status==plupload.QUEUED){
							up.removeFile(allFiles[i]);
						}
					}
					scope.hint='';
					for(var i=0;i<files.length;i++){
						var file=files[i];
						scope.uploadItem={
							name:file.name,
							title:file.name,
							progress:0,
							size:'0mb',
							fullsize:plupload.formatSize(file.size),
							duration:-1
						};
						scope.file=file;
						scope.processPromise = processFile(file,scope.uploadItem);
						scope.$digest();
					};
				};
				
				scope.start=function(){
					if(scope.uploadItem){
						$q.all([scope.processPromise,$asset.getUploadInfo().success(function(data){
							scope.uploadItem.identifier=data.resource_id;
							scope.uploadItem.csPath=data.dist_path;
							scope.uploader.setOption('url',data.upload_url);
							scope.uploader.setOption("multipart_params",{
								path:data.dist_path,
								name:scope.uploadItem.name,
								file_title: scope.uploadItem.title,
								file_description:scope.uploadItem.description,
								file_type:scope.file.type,
								scope:1,
								size:scope.file.size
							});
						})]).then(function(){
							scope.uploader.start();
						});
					}
				};
				
				scope.onBeforeUpload=function(up,file){
					scope.uploadItem.start=true;
				};
				
				scope.onUploadProgress=function(up, file) { 
					scope.uploadItem.progress= file.percent+'%';
					scope.uploadItem.size =plupload.formatSize(file.loaded);
					scope.$digest();
				};
				
				scope.onFileUploaded=function(up,file,data){
					var json = angular.fromJson(data.response);
					if(json.dentry_id){
						 var cat=scope.category;
					     var item = {
				    		 "identifier":scope.uploadItem.identifier,
				    		 "title": scope.uploadItem.title,
							 "description": scope.uploadItem.description,
                             "keywords":[],
                             "tags":[],
							 "preview":{},
                             "life_cycle": {
                                 "creator": iAttrs.assetCreator||'',
                                 "publisher": iAttrs.assetPublisher||'',
                                 "provider": "",
                                 "provider_source": ""
                             },
                             "tech_info": {
                                 "href": {
                                     "location": '${ref-path}'+scope.uploadItem.csPath+'/'+file.name,
                                     "format": file.type,
                                     "size": parseInt(json.inode.size),
                                     "md5": "",
                                     "requirements": []
                                 }
                             },
                             "coverages":[$context.coverageObject[iAttrs.assetCoverage||'user']],
                             "categories": {
                                 "assets_type": [
                                     {
                                         "taxoncode": (cat=='image'?"$RA0101":(cat=='video'?"$RA0103":"$RA0102"))
                                     }
                                 ]
                             }
					     };
					     if(cat=='image'){
					        item.preview={"240":'${ref-path}'+scope.uploadItem.csPath+'/'+file.name+'?size=240'};
					     }
					     if(cat=='image'||cat=='video'){
					        item.tech_info.href.requirements.push({"name":"resolution","value":scope.uploadItem.resolution});
					     }
					     if(cat=='video'||cat=='audio'){
					        item.tech_info.href.requirements.push({"name":"duration","value":$filter('duration_to_iso')(scope.uploadItem.duration)});
					     }
					     $asset.createAsset(item).success(function(){
					    	 scope.onItemCreated({item:item});
					     });
					}
					scope.hint=$i18n('resource.upload.hint.reselect',item.title);
					delete scope.uploadItem;
		        };
		        
		        scope.onError=function(up, err) {
		        	if(scope.uploadItem){
						scope.uploadItem.error=true;
						scope.uploadItem.errorMessage=err.message;
						scope.$digest();
		        	}else{
		        		$console.message(err.file.name+' : '+err.message);
		        	}
				};
				
				scope.reset=function(){
					delete scope.uploadItem;
					scope.hint=$i18n('resource.upload.label.select');
				};
				scope.reset();
			}
		};
	}]);
});