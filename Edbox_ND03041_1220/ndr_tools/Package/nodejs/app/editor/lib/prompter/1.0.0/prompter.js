define(["jquery","prompter/../layer-manager","i18n!prompter/../i18n","css!prompter/../prompter.css","css!prompter/../prompter-slides.css"],function($,layerManager,i18n){function asCssSize(value){return value&&(value+="")&&-1==value.indexOf("px")&&-1==value.indexOf("%")?value+"px":value}function Prompter(theme){function openMessage(text,backdrop,state,closeable){var html='<div class="_text"></div>';html=state?'<div class="prompter-popup-message _state-'+state+'"><div class="_state"></div>'+html+"</div>":'<div class="prompter-popup-message">'+html+"</div>";var el=$(html).addClass(theme);!0===closeable&&$('<div class="_close"></div>').click(function(){layer.close()}).appendTo(el.addClass("_closeable")),el.find("._text").append(text);var layer=layerManager.create({content:el,autoDestroy:!0,backdrop:backdrop});return layer.open().autoClose(messageCloseDeferred)}function Counter(text,total,backdrop){total=total||0;var count=-1,deferred=$.Deferred();this.promise=deferred.promise();var previousDeferred,destroyed=!1,commitedValues=[];this.commit=function(c,value){if(!destroyed){if(isNaN(parseInt(c))&&(value=c,c=$.isArray(value)?value.length:1),(count+=c)>0)for(var i=0;i<c;i++)commitedValues.push($.isArray(value)?vlaue[i]:value);count>=total?this.complete():(previousDeferred&&previousDeferred.resolve(),previousDeferred=$.Deferred(),openMessage(text+"："+(count+1)+"/"+total,backdrop,"wait").autoClose(previousDeferred))}},this.complete=function(){destroyed||(previousDeferred&&previousDeferred.resolve(),deferred.resolve(commitedValues),destroyed=!0)},this.destroy=function(reason){destroyed||(previousDeferred&&previousDeferred.resolve(),deferred.reject(reason),destroyed=!0)},this.commit()}function Progress(text,cancelable,backdrop){var deferred=$.Deferred();this.promise=deferred.promise();var previousDeferred,destroyed=!1,value=0;this.setValue=function(v){if(!destroyed)if((value=v)>=100)this.complete();else{previousDeferred&&previousDeferred.resolve(),previousDeferred=$.Deferred();var html="<span>"+text+'</span><br/><div class="_progress"><div class="_bar" style="width:'+value+'%">'+value+"%</div></div>";!0!==cancelable&&"string"!=typeof cancelable||(html+='&nbsp;<button class="_btn _primary _sm" ng-click="$close(\'cancel_progress\')">'+("string"==typeof cancelable?cancelable:i18n.translate("cancel"))+"</button>");var el=$("<div>"+html+"</div>");el.find("._btn").on("click",$.proxy(function(){this.destroy("cancel_progress")},this)),openMessage(el,backdrop).autoClose(previousDeferred).thenClose($.proxy(function(x){"cancel_progress"==x&&this.destroy("cancel")},this))}},this.complete=function(){destroyed||(previousDeferred&&previousDeferred.resolve(),deferred.resolve(),destroyed=!0)},this.destroy=function(reason){destroyed||(previousDeferred&&previousDeferred.resolve(),deferred.reject(reason),destroyed=!0)},this.setValue(0)}theme||(theme="slides");var previousMessageDeferred,prompter={},messageCloseDeferred=$.Deferred();prompter.message=function(text,state,closeable){return previousMessageDeferred&&previousMessageDeferred.resolve(),previousMessageDeferred=$.Deferred(),openMessage(text,!1,state,closeable).autoClose(2e3).autoClose(previousMessageDeferred)},prompter.wait=function(text,backdrop){return openMessage(text,!1!==backdrop&&"static","wait")},prompter.counter=function(text,total,backdrop){return new Counter(text,total,!1!==backdrop&&"static")},prompter.progress=function(text,cancelable,backdrop){return new Progress(text,cancelable,!1!==backdrop&&"static")},prompter.complete=function(){messageCloseDeferred.resolve(),messageCloseDeferred=$.Deferred()};var closeButtonHandle=function(contentEL,layer,btn){layer.close(btn.name,btn.success)},dialogButtons=[{name:"yes",label:i18n.translate("yes"),show:!1,primary:!0,keyCode:13,handle:closeButtonHandle,success:!0},{name:"no",label:i18n.translate("no"),show:!1,primary:!1,handle:closeButtonHandle,success:!1},{name:"cancel",label:i18n.translate("cancel"),show:!1,primary:!1,keyCode:27,handle:closeButtonHandle,success:!1},{name:"ok",label:i18n.translate("ok"),show:!1,primary:!0,keyCode:13,handle:closeButtonHandle,success:!0},{name:"close",label:i18n.translate("close"),show:!1,primary:!1,keyCode:[13,27],handle:closeButtonHandle}];return prompter.createDialog=function(options,contentOptions){options=$.extend({title:i18n.translate("dialog"),state:"default",size:"md",showClose:!0,backdrop:"static",autoDestroy:!0,moveBy:">.prompter-dialog>._header"},options);var wrap=$("<div></div>");if(wrap.addClass("prompter-dialog").addClass("_size-"+options.size).addClass("_state-"+options.state).addClass(options.theme||theme),options.scene&&wrap.addClass("_"+options.scene),wrap.css({width:asCssSize(options.width),height:asCssSize(options.height),top:asCssSize(options.top),left:asCssSize(options.left),right:asCssSize(options.right),bottom:asCssSize(options.bottom)}),options.title||options.showClose){var header=$('<div class="_header">').appendTo(wrap);options.showClose&&(header.append('<div class="_tools"><span class="_close"></span></div>'),header.find("._close").click($.proxy(function(event){layer.close("close")},this)));var title=$('<div class="_title"></div>').appendTo(header),titleText=options.title;$.isFunction(titleText)&&(titleText=titleText.apply(options,[contentOptions||{}])),title.html(titleText||"&nbsp;")}else wrap.addClass("_no-header");var body=$('<div class="_body"></div>').appendTo(wrap);options.bodyOverflow&&body.css("overflow",options.bodyOverflow);var buttons=options.buttons||[];if($.isArray(buttons)||(buttons=[buttons]),buttons.length){var footer=$('<div class="_footer"></div>').appendTo(wrap);$.each(buttons,function(i,btn){"string"==typeof btn&&(btn={name:btn});var defaultConfig;$.each(dialogButtons,function(ii,dialogBtn){if(btn.name==dialogBtn.name)return defaultConfig=dialogBtn,!1}),btn=$.extend({},defaultConfig,btn);var button=$('<button class="prompter-btn"></button>').text(btn.label).appendTo(footer);button.on("click",$.proxy(function(event){(this.handle||$.noop)(body,layer,this)},btn)),btn.primary&&button.addClass("_primary"),buttons[i]=btn});var keyCodeFn=function(event){if("INPUT"!=event.target.tagName){var keyCode=event.keyCode;$.each(buttons,function(i,btn){if(btn.keyCode&&(btn.keyCode==keyCode||-1!=$.inArray(keyCode,btn.keyCode)))return(btn.handle||$.noop)(body,layer,btn),!1})}};$(document.body).keydown(keyCodeFn);var onClose=options.onClose;options.onClose=function(result){$(document.body).off("keydown",keyCodeFn),$.isFunction(onClose)&&onClose(result)}}else wrap.addClass("_no-footer");var content;content=options.src?$('<div class="_iframe"><iframe src="'+options.src+'"></iframe></div>'):options.text?$('<div class="_content"></div>').append(options.text||""):options.content,options.content=function(layerWrap,layer){layerWrap.append(wrap),$.isFunction(content)&&(content=content.apply(options,[body,contentOptions||{},layer])),content&&body.append(content)};var layer=layerManager.create(options);return layer},prompter.dialog=function(options,contentOptions){return prompter.createDialog(options,contentOptions).open()},prompter.prompt=function(title,content,onClose,state){return prompter.dialog({title:"string"==typeof content&&title,text:"string"==typeof content?content:title,size:"sm",showClose:!1,buttons:["close"],state:state,scene:"prompt"}).thenClose(function(result){(onClose=$.isFunction(content)?content:onClose||$.noop)()})},prompter.info=function(title,content,onClose){return prompter.prompt(title,content,onClose,"info")},prompter.success=function(title,content,onClose){return prompter.prompt(title,content,onClose,"success")},prompter.warn=function(title,content,onClose){return prompter.prompt(title,content,onClose,"warn")},prompter.alert=function(title,content,onClose){return prompter.prompt(title,content,onClose,"warn")},prompter.error=function(title,content,onClose){return prompter.prompt(title,content,onClose,"error")},prompter.confirm=function(title,content,onOk,onCancel){return prompter.dialog({title:"string"==typeof content&&title,text:"string"==typeof content?content:title,buttons:["ok","cancel"],size:"sm",showClose:!1,state:"confirm",scene:"prompt"}).thenClose(function(result){"ok"==result?((onOk=$.isFunction(content)?content:onOk)||$.noop)():"cancel"==result&&((onCancel=$.isFunction(content)?onOk:onCancel)||$.noop)()})},prompter.ask=function(title,content,onYes,onNo,onCancel){return prompter.dialog({title:"string"==typeof content&&title,text:"string"==typeof content?content:title,buttons:["yes","no","cancel"],size:"sm",showClose:!1,state:"confirm",scene:"prompt"}).thenClose(function(result){"yes"==result?((onYes=$.isFunction(content)?content:onYes)||$.noop)():"no"==result?((onNo=$.isFunction(content)?onYes:onNo)||$.noop)():"cancel"==result&&((onCancel=$.isFunction(content)?onNo:onCancel)||$.noop)()})},prompter.input=function(title,value,onOk,onCancel){return prompter.dialog({title:"string"==typeof value&&title,text:'<input type="text" autofocus value="'+("string"==typeof value?value:title)+'"/><span class="_error-message"></span>',buttons:[{name:"ok",handle:function(contentEl,layer,btn){var inputValue=contentEl.find("input").val(),result=(onOk||$.noop)(inputValue);!1===result||"string"==typeof result?(contentEl.find("input").addClass("_has-error"),contentEl.find("._error-message").text(result||"无效内容")):layer.close(btn.name)}},"cancel"],size:"sm",showClose:!1,state:"input",scene:"prompt"}).thenClose(function(result){"ok"==result||"cancel"==result&&(onCancel||$.noop)()})},prompter.choice=function(title,options,onOk,onCancel){options||(options={});var text="<form>";if(!$.isArray(options)){var tmpOptions=[];$.each(options,function(key,value){tmpOptions.push({label:value,value:key})}),options=tmpOptions}return $.each(options,function(i,opt){if(opt){var label,value;"string"==typeof opt?label=value=opt:(label=opt.label,value=opt.value),text+='<div class="_choice"><label><input name="prompter-choice-radio" type="radio" value="'+value+'"/>'+label+"</label></div>"}}),text+='<span class="_error-message"></form>',prompter.dialog({title:"string"==typeof value&&title,text:text,buttons:[{name:"ok",handle:function(contentEl,layer,btn){var inputValue=contentEl.find("input:checked").val(),result=(onOk||$.noop)(inputValue);!1===result||"string"==typeof result?(contentEl.find("input").addClass("_has-error"),contentEl.find("._error-message").text(result||"无效内容")):layer.close(btn.name)}},"cancel"],size:"sm",showClose:!1,state:"choice",scene:"prompt"}).thenClose(function(result){"ok"==result||"cancel"==result&&(onCancel||$.noop)()})},$.each(["message","success","info","warn","alert","error"],function(i,fnName){prompter[fnName+"If"]=function(m,l){var args=$.makeArray(arguments).slice(2);return function(obj){if(!1!==m){var message=!0===m?obj:obj?"string"==typeof m?obj[m]||m:obj.toString()||obj:m;$.isFunction(message)&&(message=message.apply(obj)),prompter[fnName].apply(prompter,[message].concat(args))}if(!1!==l&&console[fnName]){var logMessage=!0===l?message:obj?"string"==typeof l?obj[l]||l:obj:l;$.isFunction(logMessage)&&(logMessage=logMessage.apply(obj)),console[fnName](logMessage)}}}}),prompter.as=function(theme){return new Prompter(theme)},prompter}return new Prompter});