!function(){"use strict";function dataIsEmpty(data){if(!data)return!0;if(data.length>20)return!1;var value=data.replace(/[\n|\t]*/g,"").toLowerCase();return!value||"<br>"==value||"<p>&nbsp;<br></p>"==value||"<p><br></p>"==value||"<p>&nbsp;</p>"==value||"&nbsp;"==value||" "==value||"&nbsp;<br>"==value||" <br>"==value}function addPlaceholder(ev){var editor=ev.editor,root=editor.editable?editor.editable():"wysiwyg"==editor.mode?editor.document&&editor.document.getBody():editor.textarea,placeholder=ev.listenerData;if(root){if("wysiwyg"==editor.mode){if(CKEDITOR.dialog._.currentTop)return;if(!root)return;dataIsEmpty(root.getHtml())&&(root.setHtml("<p>"+placeholder+"</p>"),root.addClass("placeholder"))}if("source"==editor.mode){if(supportsPlaceholder)return void("mode"==ev.name&&root.setAttribute("placeholder",placeholder));dataIsEmpty(root.getValue())&&(root.setValue(placeholder),root.addClass("placeholder"))}}}function removePlaceholder(ev){var editor=ev.editor,root=editor.editable?editor.editable():"wysiwyg"==editor.mode?editor.document&&editor.document.getBody():editor.textarea;if(root){if("wysiwyg"==editor.mode){if(!root.hasClass("placeholder"))return;if(root.removeClass("placeholder"),CKEDITOR.dtd[root.getName()].p){root.setHtml("<p><br/></p>");var range=new CKEDITOR.dom.range(editor.document);range.moveToElementEditablePosition(root.getFirst(),!0),editor.getSelection().selectRanges([range])}else root.setHtml(" ")}if("source"==editor.mode){if(!root.hasClass("placeholder"))return;root.removeClass("placeholder"),root.setValue("")}}}function getLang(element){return element?element.getAttribute("lang")||getLang(element.getParent()):null}var supportsPlaceholder="placeholder"in document.createElement("textarea");CKEDITOR.plugins.add("confighelper",{getPlaceholderCss:function(){return".placeholder{ color: #999; }"},onLoad:function(){CKEDITOR.addCss&&CKEDITOR.addCss(this.getPlaceholderCss())},init:function(editor){editor.on("mode",function(ev){ev.editor.focusManager.hasFocus=!1});var placeholder=editor.element.getAttribute("placeholder")||editor.config.placeholder||"";editor.addCss&&editor.addCss(this.getPlaceholderCss());var node=CKEDITOR.document.getHead().append("style");node.setAttribute("type","text/css");var content="textarea.placeholder { color: #999; font-style: italic; }";CKEDITOR.env.ie&&CKEDITOR.env.version<11?node.$.styleSheet.cssText=content:node.$.innerHTML=content,editor.on("getData",function(ev){var element=editor.editable?editor.editable():"wysiwyg"==editor.mode?editor.document&&editor.document.getBody():editor.textarea;element&&element.hasClass("placeholder")&&(ev.data.dataValue="")}),editor.on("setData",function(ev){if(!(CKEDITOR.dialog._.currentTop||"source"==editor.mode&&supportsPlaceholder)){var root=editor.editable?editor.editable():"wysiwyg"==editor.mode?editor.document&&editor.document.getBody():editor.textarea;root&&(dataIsEmpty(ev.data.dataValue)?(console.log("set place holder "),addPlaceholder(ev)):root.hasClass("placeholder")&&root.removeClass("placeholder"))}}),editor.on("blur",addPlaceholder,null,placeholder),editor.on("mode",addPlaceholder,null,placeholder),editor.on("contentDom",addPlaceholder,null,placeholder),editor.on("focus",removePlaceholder),editor.on("beforeModeUnload",removePlaceholder);var lang=editor.config.contentsLanguage||getLang(editor.element);if(lang&&!editor.config.scayt_sLang){localStorage&&localStorage.removeItem("scayt_0_lang");var map={en:"en_US","en-us":"en_US","en-gb":"en_GB","pt-br":"pt_BR",da:"da_DK","da-dk":"da_DK","nl-nl":"nl_NL","en-ca":"en_CA","fi-fi":"fi_FI",fr:"fr_FR","fr-fr":"fr_FR","fr-ca":"fr_CA",de:"de_DE","de-de":"de_DE","el-gr":"el_GR",it:"it_IT","it-it":"it_IT","nb-no":"nb_NO",pt:"pt_PT","pt-pt":"pt_PT",es:"es_ES","es-es":"es_ES","sv-se":"sv_SE"};editor.config.scayt_sLang=map[lang.toLowerCase()]}var parseDefinitionToObject=function(value){if("object"==typeof value)return value;var i,contents=value.split(";"),tabsToProcess={};for(i=0;i<contents.length;i++){var parts=contents[i].split(":");if(3==parts.length){var dialogName=parts[0],tabName=parts[1],fieldName=parts[2];tabsToProcess[dialogName]||(tabsToProcess[dialogName]={}),tabsToProcess[dialogName][tabName]||(tabsToProcess[dialogName][tabName]=[]),tabsToProcess[dialogName][tabName].push(fieldName)}}return tabsToProcess};CKEDITOR.on("dialogDefinition",function(ev){if(editor==ev.editor){var tabsToProcess,i,name,fields,tab,dialogName=ev.data.name,dialogDefinition=ev.data.definition;if("removeDialogFields"in editor._||!editor.config.removeDialogFields||(editor._.removeDialogFields=parseDefinitionToObject(editor.config.removeDialogFields)),editor._.removeDialogFields&&(tabsToProcess=editor._.removeDialogFields[dialogName]))for(name in tabsToProcess)for(fields=tabsToProcess[name],tab=dialogDefinition.getContents(name),i=0;i<fields.length;i++)tab.remove(fields[i]);if("hideDialogFields"in editor._||!editor.config.hideDialogFields||(editor._.hideDialogFields=parseDefinitionToObject(editor.config.hideDialogFields)),editor._.hideDialogFields&&(tabsToProcess=editor._.hideDialogFields[dialogName]))for(name in tabsToProcess)for(fields=tabsToProcess[name],tab=dialogDefinition.getContents(name),i=0;i<fields.length;i++)tab.get(fields[i]).hidden=!0;if(editor.config.dialogFieldsDefaultValues&&(tabsToProcess=editor.config.dialogFieldsDefaultValues[dialogName]))for(name in tabsToProcess){fields=tabsToProcess[name],tab=dialogDefinition.getContents(name);for(var fieldName in fields){var dialogField=tab.get(fieldName);dialogField&&(dialogField.default=fields[fieldName])}}}})}})}();