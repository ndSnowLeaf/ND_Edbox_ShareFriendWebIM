function getAllParams(e){var n={};-1!=e.indexOf("&amp;")&&(e=Encoder.htmlDecode(e)),-1!=e.indexOf("?")&&(e=e.substring(e.indexOf("?")+1));for(var r=e.split("&"),t=0;t<r.length;t++){var i=r[t].split("=");i[1]&&(n[i[0]]=decodeURIComponent(i[1]))}return n}var Q=require("Q"),FileUtils=require("./FileUtils"),Encoder=require("./encoder").Encoder,Path=require("path");exports.urlToRef=function(e,n){var r=function(e){if(!e)return"";var r=getAllParams(e),i=r.file_path,a=r.file_name,o=r.remote_path;return t.push(FileUtils.exists(Path.join(i,a)).then(function(e){return e||!o?Q.when():FileUtils.copy(o,Path.join(i,a))})),n.fileToRefUrl(Path.join(i,a))},t=[];return e=e.replace(/\/v2.0\/assets\/get\?(.*?)[^'">\\]*/gi,function(e){return r(e)}),Q.all(t).then(function(){return e})},exports.refToUrl=function(e,n){return e=e.replace(/\$\{ref-path\}(.*?)[^'">\\)]*/gi,function(e){return"/v2.0/assets/get?file_path="+encodeURIComponent(n.basepath)+"&file_name="+encodeURIComponent(e.replace("${ref-path}","_ref"))}),e=e.replace(/\$\{ref-base\}(.*?)[^'">\\)]*/gi,function(e){return n.isBasic||(e=e.replace("..","")),"/v2.0/assets/get?file_path="+encodeURIComponent(n.basepath)+"&file_name="+encodeURIComponent(e.replace("${ref-base}",""))}),Q.when(e)};