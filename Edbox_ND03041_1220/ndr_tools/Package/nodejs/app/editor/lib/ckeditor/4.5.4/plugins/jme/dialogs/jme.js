function getIFrameDOM(fid){var fm=getIFrame(fid);return fm.document||fm.contentDocument}function getIFrame(fid){return document.frames?document.frames[fid]:document.getElementById(fid)}var JMEditor_BasePath="",JMEditor={};$(document).ready(function(){JMEditor={versionCode:5,versionName:"V0.9.4",ckEditor:CKEDITOR,jmeBasePath:JMEditor_BasePath,defaultFontSize:"20px",isEmpty:function(elementId){return($("#"+elementId).html()+"").replace(/(<[^>]*>|\s|&nbsp;)/gi,"").length<1},html:function(elementId){return $("#"+elementId).html()}}}),CKEDITOR.dialog.add("jmeDialog",function(editor){var jme_fid="math_frame_"+editor.id;return{title:"JMEditor "+JMEditor.versionName,minWidth:500,minHeight:300,contents:[{id:"tab-basic",label:"Editor",elements:[{type:"html",html:'<div style="width:500px;height:300px;"><iframe id="'+jme_fid+'" style="width:500px;height:300px;" frameborder="no" src="'+CKEDITOR.basePath+'plugins/jme/dialogs/mathdialog.html"></iframe></div>'}]}],onShow:function(){},onOk:function(){var thedoc=getIFrame(jme_fid),latex=thedoc.contentWindow.getLatex();console.log("get latex "+latex);var mathHTML='<latex class="math-tex">\\('+latex+"\\)</latex>";editor.insertHtml(mathHTML)}}});