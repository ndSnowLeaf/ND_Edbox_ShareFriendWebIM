!function(){CKEDITOR.plugins.add("inlinechoiceinteraction",{lang:["zh"],getPlaceholderCss:function(){return"img.cke_inlinechoiceinteraction{background-image: url("+CKEDITOR.getUrl(this.path+"../textEntryInteraction/images/placeholder.png")+");background-position: center center;background-repeat: no-repeat;border-bottom: 1px solid #555555;width: 100px;height: 30px;}"},onLoad:function(){CKEDITOR.addCss&&CKEDITOR.addCss(this.getPlaceholderCss())},init:function(editor){var lang=editor.lang.inlinechoiceinteraction;editor.addCommand("inlinechoiceinteraction",new CKEDITOR.command(editor,{exec:function(editor){textEntryNode=CKEDITOR.dom.element.createFromHtml("<cke:inlinechoiceinteraction></cke:inlinechoiceinteraction>",editor.document),textEntryNode.setAttributes({responseIdentifier:auto_id()});var newFakeImage=editor.createFakeElement(textEntryNode,"cke_inlinechoiceinteraction","inlinechoiceinteraction",!1);editor.insertElement(newFakeImage);var span=CKEDITOR.dom.element.createFromHtml("<span></span>");editor.insertElement(span),editor.getSelection().selectElement(span)},allowedContent:"inlinechoiceinteraction[*]"})),editor.ui.addButton("inlinechoiceinteraction",{label:lang.toolbar,command:"inlinechoiceinteraction",icon:this.path+"images/icon.png"}),editor.addCss&&editor.addCss(this.getPlaceholderCss()),editor.lang.fakeobjects.inlinechoiceinteraction=lang.fakeObject;this.path;editor.on("change",function(){setTextEntrySequence(editor)})},afterInit:function(editor){var dataProcessor=editor.dataProcessor;dataProcessor&&dataProcessor.htmlFilter;(dataProcessor&&dataProcessor.dataFilter).addRules({elements:{$:function(realElement){if("inlinechoiceinteraction"==realElement.name||"inlinechoiceinteraction"==realElement.name){realElement.name="cke:inlinechoiceinteraction";var fakeElement=editor.createFakeParserElement(realElement,"cke_inlinechoiceinteraction","inlinechoiceinteraction",!1),fakeStyle=fakeElement.attributes.style||"",width=realElement.attributes.width,height=realElement.attributes.height;return void 0!==width&&(fakeStyle=fakeElement.attributes.style=fakeStyle+"width:"+CKEDITOR.tools.cssLength(width)+";"),void 0!==height&&(fakeStyle=fakeElement.attributes.style=fakeStyle+"height:"+CKEDITOR.tools.cssLength(height)+";"),fakeElement}}}})}});var zh={toolbar:"插入选项"};CKEDITOR.plugins.setLang("inlinechoiceinteraction","zh",zh)}();