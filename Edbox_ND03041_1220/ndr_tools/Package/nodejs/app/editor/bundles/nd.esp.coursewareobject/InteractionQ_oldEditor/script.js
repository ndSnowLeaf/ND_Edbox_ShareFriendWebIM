define(["jquery","i18n!","espEnvironment","prompter","css!./style.css"],function($,i18n,espEnvironment,prompter){var templates={preview:'<div class="slides-coursewareobject-interaction-q-old-preview"></div>',editor:'<div class="slides-coursewareobject-interaction-q-old-editor">'},embedUrl=espEnvironment.url.external("coursewareobjectEditorForOld");return window.addEventListener("message",function(event){0==embedUrl.indexOf(event.origin)&&(console.debug("proxy message send for interaction question editor(old): ",event.data),window.parent!=window&&window.parent.postMessage(event.data,"*"))}),function(){this.name="nd.esp.coursewareobject.InteractionQ_oldEditor",this.supportTypes=["coursewareobject"],this.render=function(editor,resource,config){function renderPreview(){previewRendered||(previewRendered=!0,$("<iframe></iframe>").appendTo(previewEl)),previewEl.children("iframe").attr("src",espEnvironment.url.coursewareobjectPreview(resource.data.identifier,config&&config.playerCode))}function renderEditor(){if(!editorRendered){editorRendered=!0;var coursewareobjectMetadata=resource.data,entry=config.entry;if(!entry){var idx=config.$template.indexOf("_");entry=-1==idx?config.$template:config.$template.substring(idx+1)}var url=espEnvironment.url.external("coursewareobjectEditorForOld",$.extend({entry:entry,question_type:config.$template,id:coursewareobjectMetadata.identifier,question_base:coursewareobjectMetadata.physic_path&&coursewareobjectMetadata.physic_path.replace(/\\/g,"/").replace("/"+coursewareobjectMetadata.identifier+".pkg",""),token_info:espEnvironment.encryptedLoginInfo},espEnvironment.location.params));editorEl.html('<iframe src="'+url+'"></iframe>')}}this.title=resource.data.title;var previewEl=$(templates.preview).appendTo(editor.element).hide(),editorEl=$(templates.editor).appendTo(editor.element).hide(),previewRendered=!1,editorRendered=!1;editor.toolbar.add([{name:"edit",label:i18n.translate("view.toolbar.edit"),visible:config&&!0===config.defaultPreview,handle:function(tb){tb.toggle("preview",!0),tb.toggle("edit",!1),editorEl.show(),previewEl.hide(),renderEditor()}},{name:"preview",label:i18n.translate("view.toolbar.preview"),visible:!config||!0!==config.defaultPreview,handle:function(tb){tb.toggle("edit",!0),tb.toggle("preview",!1),editorEl.hide(),previewEl.show(),renderPreview()}}]),config&&!0===config.defaultPreview?(previewEl.show(),renderPreview()):(editorEl.show(),renderEditor())}}});