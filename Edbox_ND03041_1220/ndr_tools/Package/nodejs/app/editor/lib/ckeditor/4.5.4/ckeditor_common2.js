function create_uploader(container){function getUploadConfig(callback){$.ajax({url:CKEDITOR.config.assetServer+"/v0.2/assets/blob_upload_dir",type:"get",contentType:"application/json; charset=utf-8",dataType:"json",success:function(data){data.uuid;callback(data)}})}function finish_upload(url,uuid,size,file){var param=JSON.stringify({title:file.name,identifier:uuid,description:"",href:url,format:file.type,size:parseInt(size)}),xhr=new XMLHttpRequest;xhr.open("POST",CKEDITOR.config.assetServer+"/v0.2/assets"),xhr.setRequestHeader("Content-type","application/json"),xhr.send(param),$("#"+file.id)[0].innerHTML+=CKEDITOR.config.assetServer+url+","+uuid+","+size}function add_file(){container.getElementById("filelist").innerHTML+='<div id="'+file.id+'">'+file.name+" ("+plupload.formatSize(file.size)+") <b></b></div>"}function show_progress(){container.getElementById(file.id).getElementsByTagName("b")[0].innerHTML="<span>"+file.percent+"%</span>"}function show_error(up,err){container.getElementById("console").innerHTML+="\nError #"+err.code+": "+err.message}var cache={},uploadbutton=container.getElementById("button"),uploader=new plupload.Uploader({runtimes:"html5,flash,silverlight,html4",browse_button:uploadbutton,container:container,url:"#",flash_swf_url:UPLOAD_BASE+"Moxie.swf",silverlight_xap_url:UPLOAD_BASE+"Moxie.xap",chunk_size:CHUNK_SIZE,filters:{max_file_size:"1000mb",mime_types:[{title:"图片文件",extensions:"jpg,gif,png"},{title:"压缩文件",extensions:"zip"},{title:"视频文件",extensions:"mp4,ogg,avi"},{title:"音频文件",extensions:"mp3,ogg"}]},init:{PostInit:function(){},FilesAdded:function(up,files){plupload.each(files,function(file){add_file(),getUploadConfig(function(data){var uuid=data.uuid,uploadUrl=data.access_url+"?session="+data.session_id;uploader.setOption("url",uploadUrl),uploader.setOption("multipart_params",{name:file.name,file_title:file.name,file_description:"",file_type:file.type,path:"/edu/lifecycle/dev",scope:1,size:file.size}),cache[file.id]=uuid,uploader.start()})})},UploadProgress:function(up,file){show_progress()},FileUploaded:function(up,file,data){var result=data.response,json=new Function("return "+result+";")();if(json.dentry_id){var uuid=cache[file.id];finish_upload("/v0.2/assets/"+uuid+"/original/"+json.dentry_id,uuid,json.inode.size,file)}},Error:function(up,err){show_error(up,err)}}});return uploader.init(),uploader}var UPLOAD_BASE="/lib/ckeditor/4.4.7/",CHUNK_SIZE="20kb";