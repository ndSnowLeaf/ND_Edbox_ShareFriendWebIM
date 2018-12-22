function createHandwrite(e){var a=PathManagerCreator.create(e,"interaction"),t=a.id,r=e.body,n=loadTemplate("handwrite/metadata.json"),i=a.getRefPath("main.xml"),o={chapter_id:r.chapter_id,creator:r.creator,create_time:formatDate(new Date),identifier:t,page_id:t,question_type:"nd_handwritequestion",mainurl:i};n=replaceByParams(n,o);var s=JSON.parse(n);r.chapter_id||(s.relations=[]),s.page_id=t;var p=a.getFilePath();return saveToFile(p+"/metadata.json",JSON.stringify(s)).then(function(){return saveToFile(p+"/main.xml",replaceByParams(loadTemplate("courseware/main.xml"),o)).then(function(){return saveToFile(p+"/sdp-package.xml",replaceByParams(loadTemplate("courseware/sdp-package.xml"),s)).then(function(){var e={question_id:t,question_prompt:"",background_content:JSON.stringify(DEFAULT_BACKGROUND)};return saveToFile(p+"/pages/"+t+".xml",replaceByParams(loadTemplate("handwrite/page.xml"),e)).then(function(){return saveToFile(p+"/sdp-package.xml",loadTemplate("courseware/sdp-package.xml")).then(function(){return s})})})})})}var PathManagerCreator=require("./question_tools/PathManager"),DEFAULT_BACKGROUND={url:"",type:1,left:0,top:0,right:0,bottom:0},$i18n=require("../support/i18n").i18n,parsePage=function(e){var a=e.toString(),t={content:"",object:""},r=a.indexOf("<property name='text' type='html'>");if(-1!=(r=a.indexOf("<![CDATA[",r||0))){var n=a.indexOf("]]>",r);t.content=a.substring(r+"<![CDATA[".length,n)}if(r=a.indexOf('<property name="writer_background" type="json">'),-1!=(r=a.indexOf("<![CDATA[",r))){var n=a.indexOf("]]>",r),i=a.substring(r+"<![CDATA[".length,n);i&&(t.background=JSON.parse(i))}return t};exports._parsePage=parsePage,exports.getHandwrite=function(e,a,t){var r=PathManagerCreator.create(e,"interaction"),n=r.id,i=r.getFilePath("pages/"+n+".xml"),o=pathHelper.getRefpath("main.xml");fs.readFile(i,function(e,t){return e?a.status(500).send({code:"LS/QUESTION_NOT_FOUND",message:$i18n("server.error.question.missing")}):(t=parsePage(t),t.location=o,t.physic_path=path.normalize(r.getFilePath("")),a.send(t))})},exports.saveHandwrite=function(e,a,t){var r=PathManagerCreator.create(e,"interaction"),n=r.id,i=e.body.content,o=e.body.background;o||(o=DEFAULT_BACKGROUND);var s={question_id:n,question_prompt:i,background_content:JSON.stringify(o)},p=r.getFilePath("pages/"+n+".xml");return saveToFile(p,replaceByParams(loadTemplate("handwrite/page.xml"),s)).then(function(){return a.send({content:i})})};