var Client=require("node-rest-client").Client,FileUtils=require("../support/FileUtils"),Path=require("path"),Q=require("q"),Fs=require("fs"),http=require("http"),SHA256=require("crypto-js/hmac-sha256"),CryptoJS=require("crypto-js"),request=require("request"),config=require("../config").config,lifecycleServer=config.lifecycleServer,xpath=require("xpath"),dom=require("xmldom").DOMParser,analyse=function(e){var t={protocol:/([^\/]+):\/\/(.*)/i,host:/(^[^\:\/]+)((?:\/|:|$)?.*)/,port:/\:?([^\/]*)(\/?.*)/,path:/([^\?#]+)(\??[^#]*)(#?.*)/};try{var r,n={};n.href=e;for(var o in t)r=t[o].exec(e),n[o]=r[1],e=r[2],""===e&&(e="/"),"path"===o&&(n.uri=r[1]+r[2],n.path=r[1],n.search=r[2],n.hash=r[3]);return n}catch(e){return null}},headers=function(e){return{"Content-Type":"application/json;charset=utf-8",Authorization:e}},Uploader=function(e,t){this.id=e.id,this.context=e,this.type=e.isBasic?"questions":"coursewareobjects",this.adjustTime=t.adjust_time||0,this.access_token=t.access_token,this.mac_key=t.mac_key;var r=t.user_id;e.coverage="User/"+r+"/OWNER",e.uid=r};Uploader.prototype.initUploadConfig=function(){if(this.uploadConfig)return Q.when(this.uploadConfig);var e=this,t=lifecycleServer+"/v0.6/"+e.type+"/"+e.id+"/uploadurl?renew=true&coverage="+this.context.coverage+"&uid="+this.context.uid;return e.httpGet(t).then(function(t){return e.uploadConfig=t,e.uploadConfig})},Uploader.prototype.syncFiles=function(){var e=this;return FileUtils.eachFile(this.context.basepath,function(t){return e.syncFile(t)},function(e){return!0})},Uploader.prototype.syncFile=function(e){var t=Q.defer(),r=this.uploadConfig.access_url+"?session="+this.uploadConfig.session_id,n=this.generateAuthHeader(r,"POST"),o={auth:n},i={file:Fs.createReadStream(e),filePath:this.context.distpath(e,this.uploadConfig.dist_path),scope:1};request.post({url:r,formData:i,headers:o},function(e,r,n){if(e)return t.reject(e);t.resolve()});return-1!=e.indexOf("_ref")?t.promise.then(function(){var t=Q.defer(),n=e.substring(e.indexOf("_ref")+"_ref".length).replace(/\\/g,"/");return i={file:Fs.createReadStream(e),filePath:n,scope:1},request.post({url:r,formData:i,headers:o},function(e,r,n){if(e)return t.reject(e);t.resolve()}),t.promise}):t.promise},Uploader.prototype.syncMetadata=function(){var e=this;return FileUtils.readFile(Path.join(this.context.basepath,"metadata.json")).then(function(t){var r=JSON.parse(t);return e.appendChapterInfo(r).then(function(t){if(t.coverages||(t.coverages=[]),t.coverages.push({strategy:"OWNER",target:e.context.uid,target_title:e.context.uid,target_type:"User"}),t.tech_info&&t.tech_info.href){var r=t.tech_info.href.location;-1==r.indexOf("${ref-path}")&&(r=e.context.fileToRefUrl(r).replace("${ref-base}/..","${ref-base}").replace("${ref-base}","${ref-path}/esp/edu"),t.tech_info.href=r)}var r=lifecycleServer+"/v0.6/"+e.type+"/"+e.id;return e.httpPost(r,t).then(function(e){if(e.code)throw e.code}).fail(function(n){if("LC/DUPLICATE_ID_VALID_FAIL"==n)return e.httpPut(r,t).then(function(e){if(e.code)throw e.code;return!0});throw n})})})},Uploader.prototype.appendChapterInfo=function(e){if(!e.relations)return Q.when(e);for(var t=this,r=[],n=0;n<e.relations.length;n++){var o=e.relations[n];if("chapters"==o.source_type){var i=t.httpGet(lifecycleServer+"/v0.6/teachingmaterials/none/chapters/"+o.source).then(function(r){var n=r.teaching_material;return t.httpGet(lifecycleServer+"/v0.6/teachingmaterials/"+n+"?include=TI,EDU,LC,CG").then(function(t){for(var r=e.categories,n=t.categories,o=["edition","sub_edition","subject","grade","phase"],i=0;i<o.length;i++){var a=o[i];r[a]||(r[a]=[]);for(var s=0;n[a]&&s<n[a].length;s++){for(var c=!1,h=0;h<r[a].length;h++)r[a][h].taxoncode==n[a][s].taxoncode&&(c=!0);c||r[a].push(n[a][s])}}return console.log("finish one chapter"),e})});r.push(i)}}return Q.all(r).then(function(){return console.log("finish all chapers "),e})},Uploader.prototype.httpGet=function(e){var t=Q.defer(),r=new Client,n=this.generateAuthHeader(e,"GET");return r.get(e,{headers:headers(n)},function(e,r){t.resolve(e)}),t.promise},Uploader.prototype.httpPost=function(e,t){var r=Q.defer(),n=new Client,o=this.generateAuthHeader(e,"POST");return n.post(e,{data:t,headers:headers(o)},function(e,t){r.resolve(e)}),r.promise},Uploader.prototype.httpPut=function(e,t){var r=Q.defer(),n=new Client,o=this.generateAuthHeader(e,"PUT");return n.put(e,{data:t,headers:headers(o)},function(e,t){r.resolve(e)}),r.promise},Uploader.prototype.generateAuthHeader=function(e,t){var r=this.adjustTime,n=this.access_token,o=this.mac_key;if(n&&o&&CryptoJS){var i=(new Date).getTime()+(r||0)+":"+randomCode(),a='MAC id="'+n+'",nonce="'+i+'",mac="',s=analyse(e)||{};return a+=SHA256(i+"\n"+t+"\n"+s.uri+"\n"+s.host+(s.port&&"80"!=s.port?":"+s.port:"")+"\n",o).toString(CryptoJS.enc.Base64)+'"'}};var randomCode=function(){code="";for(var e=new Array(0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"),t=0;t<8;t++){var r=Math.floor(36*Math.random());code+=e[r]}return code};exports.Uploader=Uploader;