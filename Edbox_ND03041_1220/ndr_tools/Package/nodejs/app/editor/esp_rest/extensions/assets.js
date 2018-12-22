function Download(e,r){var t=Q.defer(),i=FileSys.createWriteStream(r);return http.get(e,function(e){e.pipe(i),i.on("finish",function(){i.close(function(){t.resolve()})}).on("error",function(){t.resolve()})}).on("error",function(){t.resolve()}),t.promise}function GetWordCardIdentifier(e){var r=Q.defer(),t=config.lifecycleServer+"/v0.6/coursewareobjects/actions/query?limit=(0,100)&words="+encodeURI(e.text)+"&coverage=RSD/workspace/ASSEMBLE&category=$RT0303";return InteractionUtils.sendHttpGet(t,function(t){if(t){var i=JSON.parse(t);1===i.total?(e.identifier=i.items[0].identifier,r.resolve(e)):i.total>1?InteractionUtils.forEach(i.items,function(t){if(t.title.indexOf(e.pinyin)>-1)return e.identifier=t.identifier,r.resolve(e),!0}):r.resolve()}else r.resolve()},function(){r.resolve()}),r.promise}function DownloadWordCardResourceSingle(e,r){var t=Q.defer(),i=PathSys.join(r,e.identifier);if(e.path="${ref-base}/../resources/wordcards/"+e.identifier,FileSys.existsSync(i))t.resolve(e);else{var s=PathSys.join(i,"resources");InteractionUtils.mkdirsSync(s);var n=config.csServer+"/edu/RSD/workspace/coursewareobjects/"+e.identifier+".pkg/resources/relations.json";FileUtils.readFile(n,!1).then(function(r){FileSys.writeFileSync(PathSys.join(s,"relations.json"),r);var n=JSON.parse(r);if(n&&n.wordStrokeAsset&&n.wordStrokeAsset.target){var o=n.wordStrokeAsset.target.location,c=PathSys.join(i,"_ref",o.replace("${ref-path}",""));InteractionUtils.mkdirsSync(PathSys.dirname(c)),Download(o.replace("${ref-path}",config.csServer),c).then(function(){FileSys.writeFileSync(PathSys.join(s,"relations.json"),r)})}t.resolve(e)})}return t.promise}function DownloadWordCardsResource(e,r){var t=Q.defer(),i=[];return InteractionUtils.forEach(e,function(e){i.push(DownloadWordCardResourceSingle(e,r))}),Q.all(i).then(function(e){t.resolve(e)}),t.promise}var http=require("http"),Q=require("q"),uuid=require("node-uuid"),FileSys=require("fs"),PathSys=require("path"),config=require("../config").config,speechSynthesis=require("./bundles/speechSynthesis"),voiceRecord=require("./bundles/voiceRecord"),InteractionUtils=require("./bundles/InteractionUtils"),FileUtils=require("../support/FileUtils"),CoursewareObjectContextCreator=require("../support/CoursewareObjectContext"),ARCHIVE_FILE_PATH=PathSys.join(CoursewareObjectContextCreator.root,"archive_files"),CS_HOST="http://cs.101.com/v0.1/static/";exports.saveAchiveFile=function(e,r,t){try{FileSys.existsSync(ARCHIVE_FILE_PATH)||FileSys.mkdirSync(ARCHIVE_FILE_PATH);var i=PathSys.join(ARCHIVE_FILE_PATH,e.params.file_name);return FileSys.writeFileSync(i,JSON.stringify(e.body)),r.send("success")}catch(e){return r.send("fail")}},exports.loadAchiveFile=function(e,r,t){var i=null,s=PathSys.join(ARCHIVE_FILE_PATH,e.params.file_name);if(FileSys.existsSync(s)){var n=FileSys.readFileSync(s);i=n?n.toString():null}else i=null;return r.send(i)},exports.speechSynthesis=function(e,r){var t=e.query.file_path,i=PathSys.resolve(t,"resources/synthesis/");if(!FileSys.existsSync(i)){if(!InteractionUtils.mkdirsSync(i))return void r.send("")}speechSynthesis.synthesis(e.query.text,i,function(e){e?r.send({audioUrl:"resources/synthesis/"+e}):r.send("")})},exports.speechSynthesisV2=function(e,r){var t=e.body.file_path,i=e.body.content,s=PathSys.resolve(decodeURIComponent(t),"resources/synthesis/");if(!FileSys.existsSync(s)){if(!InteractionUtils.mkdirsSync(s))return void r.send({flag:!1})}speechSynthesis.synthesisV2({text:i.text,audioPath:s,lang:i.lang,tone:i.tone},function(e){e?r.send({flag:!0,href:"resources/synthesis/"+e,title:e}):r.send({flag:!1})})},exports.downloadFromCS=function(e,r){var t=e.body.file_path,i=e.body.assets;if(i&&i.length>0){var s=PathSys.resolve(t,"_ref");FileSys.existsSync(s)||FileSys.mkdirSync(s);var n=[];InteractionUtils.forEach(i,function(e){var r=PathSys.resolve(s,e);if(!FileSys.existsSync(r)){var t=PathSys.resolve(s,e.substr(0,e.lastIndexOf("/")));if(InteractionUtils.mkdirsSync(t)){var i=Download(CS_HOST+e,r);n.push(i)}}}),Q.all(n).then(function(){r.send()})}else r.send()},exports.startVoiceRecord=function(e,r){voiceRecord.startVoiceRecord(function(e){r.send({status:e})})},exports.getVoiceVolumn=function(e,r){voiceRecord.getVoiceVolumn(function(e){r.send({flag:void 0!=e,volumn:e})})},exports.stopVoiceRecord=function(e,r){var t=e.body.file_path,i=PathSys.resolve(decodeURIComponent(t),"resources/voiceRecord/");if(!FileSys.existsSync(i)){if(!InteractionUtils.mkdirsSync(i))return void r.send({flag:!1})}voiceRecord.stopVoiceRecord(function(e){if(-1===e)r.send({flag:!1});else if(e=PathSys.normalize(e),FileSys.existsSync(e)){var t=uuid.v4()+e.substr(e.lastIndexOf("."));FileSys.writeFileSync(PathSys.resolve(i,t),FileSys.readFileSync(e)),r.send({flag:!0,href:"resources/voiceRecord//"+t,title:t})}else r.send({flag:!1})})},exports.downloadWordCardResource=function(e,r){var t=e.body.words,i=e.body.file_path;if(Array.isArray(t)&&t.length>0&&i&&FileSys.existsSync(i)){var s=PathSys.join(i,"resources/wordcards");if(InteractionUtils.mkdirsSync(s)){var n={},o=[],c=[];return t.sort(function(e,r){return r.identifier?1:0}),InteractionUtils.forEach(t,function(e){var r=e.text+e.pinyin;n.hasOwnProperty(r)||(e.identifier?(n[r]=e.identifier,o.push(e)):e.text&&c.push(GetWordCardIdentifier(e)))}),void Q.all(c).then(function(e){InteractionUtils.forEach(e,function(e){e&&o.push(e)}),DownloadWordCardsResource(o,s).then(function(e){var t={};InteractionUtils.forEach(e,function(e){t[e.text+e.pinyin]=e.path}),r.send(t)})})}}r.send(null)};