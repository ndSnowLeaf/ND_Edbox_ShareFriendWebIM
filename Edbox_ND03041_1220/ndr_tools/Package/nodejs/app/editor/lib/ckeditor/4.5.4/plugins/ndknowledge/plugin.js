"use strict";CKEDITOR.plugins.add("ndknowledge",{requires:"widget",icons:"ndknowledge",init:function(editor){CKEDITOR.dialog.add("ndknowledge",this.path+"dialogs/ndknowledge.js");var formatDefinition=function(definition,text){var div=$("<div></div>");return div.html(definition),div.text()};editor.widgets.add("ndknowledge",{allowedContent:"span(*){width}[*];",inline:!0,draggable:!1,requiredContent:"span(ndknowledge)",editables:{},defaults:function(){var innerText=editor.getSelection()?editor.getSelection().getSelectedText():"";return innerText||(innerText=""),{content:innerText}},template:'<span class="ndknowledge">{content}</span>',button:"创建知识点",dialog:"ndknowledge",upcast:function(element){return"span"==element.name&&element.hasClass("ndknowledge")},init:function(){var json=$(this.element.$).data("json")||{};json.definition||(json.definition=$(this.element.$).text()),this.setData("json",json)},data:function(){var json=this.data.json||{},text=formatDefinition(json.definition)||"未定义";$(this.element.$).text(text),$(this.element.$).attr("data-json",JSON.stringify(json))}})}});