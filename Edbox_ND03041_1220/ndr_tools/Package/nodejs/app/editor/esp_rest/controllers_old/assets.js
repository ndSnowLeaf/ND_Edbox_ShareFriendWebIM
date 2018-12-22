function getQuestionPackagePath(e,t){return pathHelper.getQuestionRefPackagePath(e,t)}function saveMetadata(e,t,r,n,i){var a=e.getRefPath(),s=e.getFilePath(),o=(Path.join(s,"resources"),r.substring(r.lastIndexOf("."))),u="/resources/"+t+o,f=e.urlJoin(a,u),c={identifier:t,title:r,tech_info:{href:{format:n,location:f,requirements:[{type:"QUOTA",name:"resolution"}]}},type:i};if("$RA0101"==i)try{var p=sizeOf(e.getFilePath("resources/"+t+o));c.tech_info.href.requirements[0].value=p.width+"*"+p.height}catch(e){logError(e)}return c}var http=require("http"),util=require("util"),uuid=require("node-uuid"),fs=require("fs"),Path=require("path"),sizeOf=require("image-size"),pathHelper=require("./question_tools/question_path_helper"),Q=require("q"),PathManagerCreator=require("./question_tools/PathManager"),CoursewareObjectContextCreator=require("./../support/CoursewareObjectContext"),FileUtils=require("../support/FileUtils"),$i18n=require("../support/i18n").i18n,getQuestionBase=function(e){return"edu/esp/questions"},QuestionUtils=require("./question_tools/QuestionUtils"),checkDir=function(e,t){return QuestionUtils.checkDir(e,t)},mkdir=function(e,t){return QuestionUtils.mkdir(e,t)},convertBaiduImageToLocalImage=function(e,t){for(var r=[],n="bd_"+(new Date).getTime(),i=0;i<t.length;i++){var a=n+""+i,s=t[i],o="/resources/"+a+"."+s.Pictype,u=e.toProxy(o,s.ObjUrl,"");r.push({identifier:a,title:s.Desc,tech_info:{href:{format:"",location:u,requirements:[{type:"QUOTA",name:"resolution",value:s.Width+"*"+s.Height}]}},preview:{240:"/v1.3/assets/proxy2?url="+encodeURIComponent(s.ObjUrl)},type:"$RA0101"})}return r},logError=function(e){e.stack?console.error(e.stack.split("\n")):console.log(e)},getLocalFileList=function(e,t){var r=e.getFilePath("resources"),n=(e.getRefPath("resources"),{jpg:{code:"$RA0101",minetype:""},jpeg:{code:"$RA0101",minetype:""},gif:{code:"$RA0101",minetype:""},png:{code:"$RA0101",minetype:""},bmp:{code:"$RA0101",minetype:""},mp4:{code:"$RA0103",minetype:""},mp3:{code:"$RA0102",minetype:""}}),i=Q.defer();return mkdir(r,function(){for(var a=[],s=fs.readdirSync(r),o=0;o<s.length;o++)if(-1!=s[o].indexOf(".")){var u=e.getRefPath("resources/"+s[o]),f=s[o].substring(0,s[o].lastIndexOf(".")-1),c=s[o].substring(s[o].lastIndexOf(".")+1),p=n[c.toLowerCase()];if(-1==["audio.png","background.jpg","default_audio.png","default_video.png","image.png","papertype_1.png","papertype_2.png","papertype_3.png","papertype_4.png","papertype_5.png","video.png"].indexOf(s[o])&&0!=s[o].indexOf("sf-")&&p&&p.code==t){var d={identifier:f,title:f+"."+c,tech_info:{href:{format:p.mimetype,location:u,requirements:[{type:"QUOTA",name:"resolution"}]}},type:p.code};if("$RA0101"==p.code)try{var l=sizeOf(e.getFilePath("resources/"+s[o]));d.tech_info.href.requirements[0].value=l.width+"*"+l.height}catch(e){logError(e)}a.push(d)}}i.resolve(a)}),i.promise};exports._getLocalFileList=getLocalFileList,exports.search=function(e,t,r){var n=e.query.question_id,i=PathManagerCreator.create(e,"",n),a=(i.extraInfoUrl(),e.query.coverage),s=e.query.type;if(-1!=a.indexOf("local")){if(e.query.is_interaction===QUESTION_TYPE_INTERACTION)return void InteractionAssetsManager.searchLocalAssets(e,t,r);getLocalFileList(i,s).then(function(e){t.send({items:e})})}else if(-1!=a.indexOf("User")||-1!=a.indexOf("Org/nd")){-1!=a.indexOf("Org/nd")&&(a="Org/nd/OWNER");var o=e.query.slideServer,u=e.query.csserver;o&&-1!=o.indexOf("//")&&(o=o.substring(o.indexOf("//")+2)),o&&-1!=o.lastIndexOf("/")&&(o=o.substring(0,o.lastIndexOf("/")));var f="/v1.3/assets?type="+encodeURIComponent(e.query.type)+"&coverage="+encodeURIComponent(a)+"&page="+(e.query.page||1)+"&size="+(e.query.size||24)+"&chapter_id="+(e.query.chapter_id||"")+"&words="+encodeURIComponent(e.query.words||"")+"&max_size="+(e.query.max_size||"");http.get({host:o,path:f,headers:{}},function(e){var r="";e.on("data",function(e){r+=e}),e.on("end",function(){try{var e=JSON.parse(r);if(e.code)return t.status(500).send({code:e.code,message:e.message});for(var n=e.items,a="nd_"+(new Date).getTime(),s=0;s<n.length;s++){var o=n[s],f=o.tech_info.href.location;f=f.replace("${ref-path}",u);var c=o.preview,p=a+""+s,d=f.substring(f.lastIndexOf(".")+1),l="/resources/"+p+"."+d;if(c&&0!=c.length&&o.preview[240])for(var g in c)c[g]=c[g].replace("${ref-path}",u);else o.preview={240:f+"?size=240",media:f+"?size=240"};f=-1==f.indexOf("?")?f+"?size=1200":f+"&size=1200",o.tech_info.href.location=i.toProxy(l,f,"$RA0101")}return t.send(e)}catch(e){t.status(500).send({code:"LS/JSON_PARSE_FAIL",message:$i18n("server.error.response.format")})}})}).on("error",function(e){t.status(500).send({code:"LS/JSON_PARSE_FAIL",message:$i18n("server.error")})})}else{if(-1==a.indexOf("Baidu/bd/")||"$RA0101"!=s)return t.send({items:[]});if(""==e.query.words)return t.send({items:[]});var c=e.query.size||24,p=((e.query.page||1)-1)*c,d="/image_search/search/search?word="+encodeURIComponent(e.query.words||"")+"&pn="+p+"&rn="+c+"&assetType=$RA0101&ie=utf-8";http.get({host:"apis.baidu.com",path:d,headers:{apikey:"de4eb4b4a1ae4e1c529b0774f931d1f8"}},function(e){var r="";e.on("data",function(e){r+=e}),e.on("end",function(){var e=JSON.parse(r),n=e.status.code;if("0"!=n)return t.status(500).send({code:n,message:e.status.msg});var a=e.data.ReturnNumber,s=e.data.TotalNumber,o=convertBaiduImageToLocalImage(i,e.data.ResultArray);return t.send({item_count:a,total_count:s,items:o})})}).on("error",function(e){t.status(500).send({code:"LS/JSON_PARSE_FAIL",message:$i18n("server.error")})})}},exports.get=function(e,t,r){if(e.query.is_interaction===QUESTION_TYPE_INTERACTION)return void InteractionAssetsManager.getAsset(e,t,r);var n=e.query.question_id,i=PathManagerCreator.create(e,null,n),a=e.query.filepath;a&&-1!=a.indexOf("?")&&(a=a.substring(0,a.indexOf("?")));var s=i.getFilePath(a);return t.sendFile(Path.resolve(s))},exports.check_proxy=function(e,t,r,n,i){handleProxyFile(e,t,r,n,i)},exports.proxy2=function(e,t,r){var n=e.query.url;http.get(n,function(e){e.pipe(t)}).end()},exports.proxy3=function(e,t,r){var n=e.params[0],i=e.params.base;console.log("before decode ",i),i=new Buffer(i,"base64").toString("ascii"),-1!=i.indexOf("?")&&(i=i.substring(0,i.indexOf("?"))),console.log("real url ",i,n),t.sendFile(Path.resolve(i,n))},exports.proxy=function(e,t,r){if(e.query.is_interaction===QUESTION_TYPE_INTERACTION)return void InteractionAssetsManager.downloadAssets(e,t,r);var n=e.query.question_id,i=PathManagerCreator.create(e,null,n),a=e.query.filepath,s=e.query.url,o=e.query.assetType;handleProxyFile(i,a,s,o,function(e){return t.sendFile(Path.resolve(e))})};var handleProxyFile=function(e,t,r,n,i){t&&-1!=t.indexOf("?")&&(t=t.substring(0,t.indexOf("?")));var a=t.substring(t.lastIndexOf("/")+1),s=(a.substring(0,a.lastIndexOf(".")),e.getFilePath(t));if(fs.existsSync(s))return i(s);var o=fs.createWriteStream(s),u=http.get(r,function(e){var t=e.headers["content-type"];t&&(t=t.trim()),e.pipe(o),o.on("finish",function(){o.close(function(){return i(s)})})});u.on("error",function(e){}),u.end()},renameFile=function(e,t){return FileUtils.copy(e,t,!1,!1)};exports.upload=function(e,t,r){if(e.query.is_interaction===QUESTION_TYPE_INTERACTION)return void InteractionAssetsManager.uploadAssets(e,t,r);var n=e.query.question_id,i=e.file,a=PathManagerCreator.create(e,null,n),s=(e.query.asset_type,(new Date).getTime()+""+Math.floor(100*Math.random())),o=(a.getRefFullPath(),i.originalname.substring(i.originalname.lastIndexOf("."))),u=(i.originalname.substring(0,i.originalname.lastIndexOf(".")),a.getFilePath("resources"));mkdir(u,function(){var r=a.getFilePath("resources/"+s+o);renameFile(i.path,r).then(function(){var r=saveMetadata(a,s,i.originalname,i.mimetype,e.query.asset_type);t.send(r)})})};var QUESTION_TYPE_INTERACTION="true",InteractionAssetsManager={$ref_base:"${ref-base}",$ref_path:"${ref-path}",$interaction_base:"edu/esp/interaction",$ref_assets_path:"/_ref/edu/esp/assets/",$assets_path:"/edu/esp/assets/",getInteractionPackagePath:function(e,t){var r=t.param("question_base");if(!r){var n=t.param("file_path");n&&(r=Path.dirname(n))}return r||(r=Path.join(CoursewareObjectContextCreator.root,"/interaction/")),r.lastIndexOf("/")!=r.length-1&&(r+="/"),r+e+".pkg"},resolveFilePath:function(e,t,r){var n=this;return e=replacer.toRefpath(e),-1!=e.indexOf(refbase)&&(e=e.substring(refbase.length)),n.$interaction_base+e},mkdirsSync:function(e,t){if(!fs.existsSync(e)){var r;e.split("/").forEach(function(e){if(r=r?r+"/"+e:e,!fs.existsSync(r)&&!fs.mkdirSync(r,t))return!1})}return!0},saveMetadata:function(e,t,r,n,i,a){var s=this,o=s.getInteractionPackagePath(t,a),u=(s.$ref_assets_path,r.substring(r.lastIndexOf("."))),f=s.$ref_assets_path+e+u,c=s.$ref_base+s.$ref_assets_path+e+u,p={identifier:e,title:r,tech_info:{href:{format:n,location:c,requirements:[{type:"QUOTA",name:"resolution"}]}},type:i};if("$RA0101"==i)try{var d=sizeOf(o+f);p.tech_info.href.requirements[0].value=d.width+"*"+d.height}catch(e){logError(e)}return p},searchLocalAssets:function(e,t,r){var n=this,i=e.query.type,a=e.query.question_id,s=n.getInteractionPackagePath(a,e),o=s+n.$ref_assets_path,u=n.$ref_base+n.$ref_assets_path,f={jpg:{code:"$RA0101",minetype:""},jpeg:{code:"$RA0101",minetype:""},gif:{code:"$RA0101",minetype:""},png:{code:"$RA0101",minetype:""},bmp:{code:"$RA0101",minetype:""},mp4:{code:"$RA0103",minetype:""},mp3:{code:"$RA0102",minetype:""}};mkdir(o,function(){for(var e=[],r=fs.readdirSync(o),n=0;n<r.length;n++)if(-1!=r[n].indexOf(".")){var a=u+r[n],s=r[n].substring(0,r[n].lastIndexOf(".")-1),c=r[n].substring(r[n].lastIndexOf(".")+1),p=f[c.toLowerCase()];if(-1==["audio.png","background.jpg","default_audio.png","default_video.png","image.png","papertype_1.png","papertype_2.png","papertype_3.png","papertype_4.png","papertype_5.png","video.png"].indexOf(r[n])&&0!=r[n].indexOf("sf-")&&p&&p.code==i){var d={identifier:s,title:s+"."+c,tech_info:{href:{format:p.mimetype,location:a,requirements:[{type:"QUOTA",name:"resolution"}]}},type:p.code};if("$RA0101"==p.code)try{var l=sizeOf(o+r[n]);d.tech_info.href.requirements[0].value=l.width+"*"+l.height}catch(e){logError(e)}e.push(d)}}t.send({items:e})})},getAsset:function(e,t,r){var n=this,i=e.query.from_ref_base,a=e.query.filepath,s=e.query.question_id;if(!s)return t.status(400).send({code:"LS/MISSING_QUESTION_ID",message:$i18n("server.error.questionid.missing")});a&&-1!=a.indexOf("?")&&(a=a.substring(0,a.indexOf("?"))),a&&0===a.indexOf("/")&&(a=a.substring(1));var o=n.getInteractionPackagePath(s,e);return o+="true"==i?"/"+a:"/_ref/"+a,t.sendFile(Path.resolve(o))},uploadAssets:function(e,t,r){var n=this,i=e.file,a=e.query.question_id,s=(e.query.asset_type,(new Date).getTime()+""+Math.floor(100*Math.random())),o=(n.$interaction_base,i.originalname.substring(i.originalname.lastIndexOf("."))),u=(i.originalname.substring(0,i.originalname.lastIndexOf(".")),n.getInteractionPackagePath(a,e)),f=u+n.$ref_assets_path,c=n.$ref_assets_path+s+o;mkdir(f,function(){renameFile(i.path,u+c).then(function(){var r=n.saveMetadata(s,a,i.originalname,i.mimetype,e.query.asset_type,e);t.send(r)})})},downloadAssets:function(e,t,r){var n=this,i=e.query.question_id,a=e.query.filepath,s=e.query.url,o=e.query.assetType;n.handleProxyFile(i,a,s,o,e,function(e){return t.send(e)})},handleProxyFile:function(e,t,r,n,i,a){var s=this,o=t.substring(t.lastIndexOf("/")+1),u=s.getInteractionPackagePath(e,i)+s.$ref_assets_path,f=u+o;if(s.mkdirsSync(u),fs.existsSync(f))return a(s.$ref_path+s.$assets_path+o);FileUtils.copy(r,f).then(function(){a(s.$ref_path+s.$assets_path+o)})}};