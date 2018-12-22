!function(){"use strict";var pluginCmd="matheditDialog",runningId=0;CKEDITOR.plugins.add("mathedit",{init:function(editor){var iconPath=this.path+"icons/mathedit.png";editor.addCommand(pluginCmd,new CKEDITOR.dialogCommand(pluginCmd,{allowedContent:"img[src,title,class](mathImg)",requiredContent:"img[src,title,class](mathImg)"})),editor.ui.addButton("mathedit",{label:"Insert math",command:pluginCmd,toolbar:"insert",icon:iconPath}),editor.contextMenu&&(editor.addMenuGroup("Math"),editor.addMenuItem("mathedit",{label:"Edit function",icon:iconPath,command:pluginCmd,group:"Math"}),editor.contextMenu.addListener(function(element){var res={};if(element&&(element=element.getAscendant("img",!0)),element&&!element.data("cke-realelement")&&"mathImg"===element.getAttribute("class"))return res.mathedit=CKEDITOR.TRISTATE_OFF,res})),editor.on("doubleclick",function(evt){var element=evt.data.element;element&&element.is("img")&&"mathImg"===element.getAttribute("class")&&(evt.data.dialog=pluginCmd,evt.cancelBubble=!0,evt.returnValue=!1,evt.stop())},null,null,1),CKEDITOR.dialog.add(pluginCmd,function(editor){var currId="mathedit-latex-input-field-"+runningId;return runningId+=1,{title:"Add Math",minWidth:400,minHeight:200,contents:[{id:"general",label:"Settings",elements:[{type:"html",html:"<span id='"+currId+"' style='border: 1px solid gray;padding: 2px;'></span><div style='float: right; padding-top: 10px;'><a href='http://www.codecogs.com/' style='cursor: pointer; font-size: smaller; color:#085585' target='_blank'>CodeCogs</a><br/><a href='http://www.mathquill.com/' style='cursor: pointer; font-size: smaller; color:#085585' target='_blank'>MathQuill</a></div>",setup:function(image){var dialEl=jQuery(CKEDITOR.document.getById(currId).$);dialEl.mathquill("editable"),dialEl.mathquill("latex",image.getAttribute("title"))},commit:function(image){var dialEl=jQuery(CKEDITOR.document.getById(currId).$),url="http://latex.codecogs.com/gif.latex?",latex="";latex=dialEl.mathquill("latex"),latex||(latex="empty"),url+=escape(latex),image.setAttribute("src",url),image.setAttribute("title",latex)}}]}],onShow:function(event){var dialog=this,sel=editor.getSelection(),image=sel.getStartElement();image&&(image=image.getAscendant("img",!0)),!image||"mathImg"!==image.getAttribute("class")||image.data("cke-realelement")?(image=editor.document.createElement("img"),image.setAttribute("class","mathImg"),image.setAttribute("title","x^2"),dialog.insertMode=!0):dialog.insertMode=!1,dialog.image=image,dialog.setupContent(dialog.image)},onOk:function(){var dialog=this,image=dialog.image;dialog.insertMode&&editor.insertElement(image),dialog.commitContent(image)}}})}})}();