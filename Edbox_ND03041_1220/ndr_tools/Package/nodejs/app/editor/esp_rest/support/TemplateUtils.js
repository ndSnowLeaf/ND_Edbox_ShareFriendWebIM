var FileUtils=require("./FileUtils"),Path=require("path"),Q=require("q"),BASE_PATH="../template/",templateFiles={},loadTemplate=function(e,t){return(templateFiles[e]?Q.when(templateFiles[e]):loadTemplateInternal(e)).then(function(e){return t&&(e=replaceByParams(e,t)),e})},loadTemplateInternal=function(e){return FileUtils.readFile(Path.join(__dirname,BASE_PATH,e)).then(function(t){return templateFiles[e]=t,t})},replaceByParams=function(e,t,a){for(var l in t)for(var r=t[l],n=a?l:"{{"+l+"}}",i=e.indexOf(n);-1!=i;)e=e.substring(0,i)+r+e.substring(i+n.length),i=e.indexOf(n,i+n.length);return e};exports._loadTemplateInternal=loadTemplateInternal,exports.loadTemplate=loadTemplate,exports.replaceByParams=replaceByParams;