CKEDITOR.dialog.add("ndknowledge",function(editor){var copy=function(json){return JSON.parse(JSON.stringify(json))},formatDefinition=function(definition,json){var div=$("<div></div>");div.html(definition||"");for(var keywords=div.find(".ndknowledgekey"),i=0;i<keywords.length;i++){var keyword=keywords[i],identifier=$(keyword).data("json-key");for(var key in json.definition_properties){var keywordJson=json.definition_properties[key];if(keywordJson.identifier==identifier){var jsonstr=JSON.stringify(keywordJson);$(keyword).attr("data-json",jsonstr)}}}return console.log("format definition ",div.html()),div.html()},parseDefinition=function(definition,json){var div=$("<div></div>");div.html(definition||"");var keywords=div.find(".ndknowledgekey");json.definition_properties={};for(var i=0;i<keywords.length;i++){var keyword=keywords[i],keywordJson=$(keyword).data("json");keywordJson.identifier||(keywordJson.identifier="key"+(new Date).getTime()+"-"+i),$(keyword).attr("data-json","{}"),$(keyword).attr("data-json-key",keywordJson.identifier),json.definition_properties[keywordJson.keyword]=keywordJson}return console.log("parse definition ",div.html()),div.html()};return{title:"编辑知识点信息",minWidth:600,minHeight:400,contents:[{id:"info",elements:[{id:"abbr",type:"text",label:"名称",setup:function(widget){this.setValue(widget.data.json.abbr||"")},commit:function(widget){widget.data.json.abbr=this.getValue(),widget.data.json.uri="cn.K12.特殊学科.Editor."+this.getValue();var value=widget.data.json.uri;widget.data.json.tags=value?value.split(/\./gi):[],widget.setData("json",copy(widget.data.json))}},{id:"definition",type:"textarea",label:"知识点定义",setup:function(widget){var domId=(widget.data.json,this.domId);this.editor||(this.editor=CKEDITOR.replace($("#"+domId+" textarea")[0],{toolbar:[["Cut","Copy","Paste","-","Ndknowledgekey"]],extraPlugins:"ndknowledgekey"})),this.editor.setData(formatDefinition(widget.data.json.definition,widget.data.json))},commit:function(widget){if(this.editor){var value=parseDefinition(this.editor.getData(),widget.data.json);widget.data.json.definition=value,widget.setData("json",copy(widget.data.json))}}}]}],onOk:function(){}}});