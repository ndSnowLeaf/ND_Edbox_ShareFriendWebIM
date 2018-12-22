define(["jlang","jquery","prompter","slides","i18n!","css!./workbench.css"],function(jlang,$,prompter,slides,i18n){function isPromise(obj){return obj&&$.isFunction(obj.resolve)&&$.isFunction(obj.reject)}function Workbench(rootElement){function registerAction(actionDef){actionDef&&actionDefs.push(actionDef)}function registerPerspective(perspectiveDef){if($.isArray(perspectiveDef))for(var i=0;i<perspectiveDef.length;i++)registerPerspective(perspectiveDef[i]);else perspectiveDefs.push(perspectiveDef||{})}function registerView(viewDef){if($.isArray(viewDef))for(var i=0;i<viewDef.length;i++)registerView(viewDef[i]);else $.isFunction(viewDef)&&(viewDef=new viewDef),viewDefs.push(viewDef||{})}function findViewDef(name){for(var i=0;i<viewDefs.length;i++){var viewDef=viewDefs[i];if(viewDef.name==name)return viewDef}}function registerEditor(editorDef){if($.isArray(editorDef))for(var i=0;i<editorDef.length;i++)registerEditor(editorDef[i]);else{if($.isFunction(editorDef)&&(editorDef=new editorDef),!editorDef||!editorDef.name)return;var supportTypes=editorDef.supportTypes;$.isArray(supportTypes)||(supportTypes=[supportTypes]);for(var types=[],i=0;i<supportTypes.length;i++){var type=supportTypes[i];0==type.indexOf("^")&&(type=type.substring(1),editorAssociateTypes[type]=editorDef.name),types[i]=type}editorSupportTypes[editorDef.name]=types,editorDefs.push(editorDef)}}function findEditorDef(name){for(var i=0;i<editorDefs.length;i++){var editorDef=editorDefs[i];if(editorDef.name==name)return editorDef}}function registerDialog(dialogDef){if($.isArray(dialogDef))for(var i=0;i<dialogDef.length;i++)registerDialog(dialogDef[i]);else $.isFunction(dialogDef)&&(dialogDef=new dialogDef),dialogDefs.push(dialogDef||{})}function findDialogDef(name){for(var i=0;i<dialogDefs.length;i++){var dialogDef=dialogDefs[i];if(dialogDef.name==name)return dialogDef}}function Action(actionDef){var handle=actionDef&&actionDef.handle||$.noop;this.execute=function(){handle.apply(this,arguments)}}function Perspective(perspectiveDef,wrapEl){this.name=perspectiveDef.name;var regions={},prespectiveEl=$(templates.perspective).appendTo(wrapEl);perspectiveDef.name&&prespectiveEl.addClass("_"+perspectiveDef.name.replace(/\./g,"-"));var layoutEl=$(templates.perspectiveLayout).appendTo(prespectiveEl),regionDefs=perspectiveDef.regions||{};for(var key in regionDefs){var regionDef=regionDefs[key],template=templates.regionWrap[key];if(template){var regionWrapEl=$(template.replace("{size}",regionDef.size||200)).appendTo(layoutEl),region=new Region(regionDef,regionWrapEl);regions[key]=region}}!function(){var left=(layoutEl.children("._left").outerWidth()||0)+"px",right=(layoutEl.children("._right").outerWidth()||0)+"px",top=(layoutEl.children("._top").outerHeight()||0)+"px",bottom=(layoutEl.children("._bottom").outerHeight()||0)+"px";layoutEl.children("._left").nextAll("._top,._bottom").css("left",left),layoutEl.children("._right").nextAll("._top,._bottom").css("right",right),layoutEl.children("._top").nextAll("._left,._right").css("top",top),layoutEl.children("._bottom").nextAll("._left,._right").css("bottom",bottom),layoutEl.children("._center").css({left:left,right:right,top:top,bottom:bottom})}(),this.getRegion=function(r){return regions[r]},this.getEditorRegion=function(){return regions[perspectiveDef.editorRegion||"center"]},this.removeView=function(viewId){for(var key in regions)regions[key].removeView(viewId)},this.activeView=function(viewId){for(var key in regions)regions[key].activeView(viewId)}}function VerticalRegionLayout(regionEl,layoutConfig){var layoutEl=$(templates.regionLayout.vertical.layout).appendTo(regionEl);this.renderView=function(view){var wrapEl=$(templates.regionLayout.vertical.wrap).appendTo(layoutEl);wrapEl.attr("view-id",view.id),view.renderTo(wrapEl.children("._body")),wrapEl.children("._header").text(view.title),layoutConfig&&!0===layoutConfig.hideHeader&&wrapEl.children("._header").hide()},this.removeView=function(viewId){layoutEl.children('[view-id="'+viewId+'"].slides-workbench-view-wrap').remove()},this.activeView=function(viewId){var viewWrapEl=layoutEl.children('[view-id="'+viewId+'"].slides-workbench-view-wrap');return!!viewWrapEl.length&&(layoutEl.children(".slides-workbench-view-wrap").removeClass("_actived"),viewWrapEl.addClass("_actived"),!0)}}function FitRegionLayout(regionEl,layoutConfig){var layoutEl=$(templates.regionLayout.fit.layout).appendTo(regionEl);this.renderView=function(view){var wrapEl=$(templates.regionLayout.fit.wrap).appendTo(layoutEl);wrapEl.attr("view-id",view.id),view.renderTo(wrapEl.children("._body")),wrapEl.find("._header > ._title").text(view.title),view.toolbar.renderTo(wrapEl.find("._header > ._tools")),layoutConfig&&!0===layoutConfig.hideHeader&&wrapEl.children("._header").hide()},this.removeView=function(viewId){layoutEl.children('[view-id="'+viewId+'"].slides-workbench-view-wrap').remove()},this.activeView=function(viewId){var viewWrapEl=layoutEl.children('[view-id="'+viewId+'"].slides-workbench-view-wrap');return!!viewWrapEl.length&&(layoutEl.children(".slides-workbench-view-wrap").removeClass("_actived"),viewWrapEl.addClass("_actived"),!0)}}function TabRegionLayout(regionEl,layoutConfig){var activeHistory=[],layoutEl=$(templates.regionLayout.tab.layout).appendTo(regionEl);layoutEl.children("._header").delegate(">.slides-workbench-view-wrap","click",function(){activeView($(this).attr("view-id"))}).delegate(">.slides-workbench-view-wrap","dblclick",function(){removeView($(this).attr("view-id"))}),layoutConfig&&!0===layoutConfig.hideHeader&&layoutEl.children("._header").hide(),this.renderView=function(view){var headerWrapEl=$(templates.regionLayout.tab.headerWrap).appendTo(layoutEl.children("._header")),bodyWrapEl=$(templates.regionLayout.tab.bodyWrap).appendTo(layoutEl.children("._body"));headerWrapEl.attr("view-id",view.id),bodyWrapEl.attr("view-id",view.id),view.renderTo(bodyWrapEl),headerWrapEl.text(view.title)},this.removeView=function(viewId){layoutEl.find('[view-id="'+viewId+'"].slides-workbench-view-wrap').remove(),this.activePreviousView()},this.activeView=function(viewId){var viewWrapEl=layoutEl.find('[view-id="'+viewId+'"].slides-workbench-view-wrap');return!!viewWrapEl.length&&(layoutEl.find(">*>.slides-workbench-view-wrap").removeClass("_actived"),viewWrapEl.addClass("_actived"),activeHistory.unshift(viewId),!0)},this.activePreviousView=function(){var viewId=activeHistory.shift();viewId&&!1===this.activeView(viewId)&&this.activePreviousView()}}function Region(regionDef,wrapEl){var regionEl=$(templates.region).appendTo(wrapEl),layout=new(regionLayouts[regionDef.layout]||VerticalRegionLayout)(regionEl,regionDef.layoutConfig);this.addView=function(view){layout.renderView(view)},this.removeView=function(viewId){layout.removeView(viewId)},this.activeView=function(viewId){return layout.activeView(viewId)};var viewConfigs=regionDef.views||[];$.isArray(viewConfigs)||(viewConfigs=[viewConfigs]);for(var i=0;i<viewConfigs.length;i++){var viewDef,viewConfig=viewConfigs[i];"string"==typeof viewConfig?(viewDef=viewConfig,viewConfig=null):viewDef=viewConfig.name;var view=createView(viewDef,viewConfig);view&&this.addView(view)}}function Toolbar(tools){this._tools=tools?$.isArray(tools)?tools:[tools]:[]}function View(viewDef,viewConfig){this._id=($.isFunction(viewDef.id)?viewDef.id():viewDef.id)||viewDef.name,this._name=viewDef.name,this._viewDef=viewDef,this._viewConfig=viewConfig,this._ctrl=$.extend({},viewDef.ctrl);var t=viewDef.tools;$.isFunction(t)&&(t=t()),this._toolbar=new Toolbar(t)}function EditorViewDef(editorDef,resource,editorConfig){var editor=new Editor(editorDef,resource,editorConfig);this.id=editor.name+":"+editor.key,this.title=function(){return editor.title},this.tools=function(){return editorDef.tools},this.render=function(view){Object.defineProperty(editor,"toolbar",{get:function(){return view.toolbar}}),editor.renderTo(view.element)},this.destroy=function(view){console.log("destroy view..."),editor.destroy()},this.save=editorDef.save,this.ctrl={editor:editor}}function Editor(editorDef,resource,editorConfig){this._name=editorDef.name,this._type=resource.type,this._key=resource.key,this._data=resource.data,this._editorDef=editorDef,this._resource=resource,this._title=resource.title,this._editorConfig=editorConfig,this.destroy=function(){(editorDef.destroy||$.noop).call(editorDef,this,resource)},this._ctrl=$.extend({},editorDef.ctrl)}function bootstrap(rootElement){initActions(),$(rootElement).attr("lang",i18n.language),workbenchEl=$(templates.workbench).appendTo($(rootElement)),eventManager.trigger("afterBootstrap",workbenchCtrl)}function initActions(){for(var i=0;i<actionDefs.length;i++){var actionDef=actionDefs[i];if($.isFunction(actionDef)&&(actionDef=actionDef(workbenchCtrl)),actionDef){$.isArray(actionDef)||(actionDef=[actionDef]);for(var j=0;j<actionDef.length;j++){var def=actionDef[j];def&&def.name&&(actions[def.name]=new Action(def))}}}}function executeAction(name){var action=actions[name];if(!action)throw"no action named with: "+name;for(var args=[],i=1;i<arguments.length;i++)args.push(arguments[i]);action.execute.apply(action,args)}function switchPerspective(perspectiveName){var perspective=perspectives[perspectiveName];if(!perspective)for(var i=0;i<perspectiveDefs.length;i++){var perspectiveDef=perspectiveDefs[i];if(perspectiveDef.name==perspectiveName){var wrapEl=$(templates.perspectiveWrap).appendTo(workbenchEl);wrapEl.attr("perspective-name",perspectiveName),perspective=new Perspective(perspectiveDef,wrapEl),perspectives[perspectiveName]=perspective}}workbenchEl.children(".slides-workbench-perspective-wrap").removeClass("_actived"),workbenchEl.children('[perspective-name="'+perspectiveName+'"].slides-workbench-perspective-wrap').addClass("_actived")}function getCurrentPerspective(){var perspectiveName=workbenchEl.children(".slides-workbench-perspective-wrap._actived").attr("perspective-name");return perspectives[perspectiveName]}function createView(viewDef,viewConfig){if("string"==typeof viewDef&&(viewDef=findViewDef(viewDef)),!viewDef)return!1;if(viewDef.name)for(var key in views)if(views[key].name===viewDef.name)return views[key];var view=new View(viewDef,viewConfig);return view.id||(view.id=viewIdPrefix+viewIdIndex++),views[view.id]=view,view}function removeView(viewId){if("string"==typeof viewId){var view=views[viewId];if(!view)return!1;view.destroy(),delete views[viewId];for(var key in perspectives)perspectives[key].removeView(viewId);return!0}if($.isFunction(viewId)){var result=!0;for(var key in views){var view=views[key];!0===viewId(view)&&(result=removeView(view.id)&&result)}return result}}function activeView(viewId){for(var key in perspectives)perspectives[key].activeView(viewId)}function getView(viewId){return views[viewId]}function getViewByName(viewName){for(var key in views)if(views[key].name===viewName)return views[key]}function openEditor(resource,name,editorConfig){if(!resource||!resource.key)return prompter.alert(i18n.translate("courseware.error.open.empty")),!1;if(name||(name=editorAssociateTypes[resource.type]),!name)outer:for(var key in editorSupportTypes)for(var types=editorSupportTypes[key],i=0;i<types.length;i++)if(types[i]==resource.type){name=key;break outer}var viewId=name+":"+resource.key,view=views[viewId];if(!view){var editorDef=findEditorDef(name);if(!editorDef)return!1;view=createView(new EditorViewDef(editorDef,resource,editorConfig)),getCurrentPerspective().getEditorRegion().addView(view,!0)}return getCurrentPerspective().getEditorRegion().activeView(view.id),view.ctrl.editor}function closeEditor(editor){return!!editor&&removeView(function(view){return view.ctrl.editor==editor})}function closeEditorByName(editorName){return!!editorName&&removeView(function(view){var editor=view.ctrl.editor;return editor&&editor.name===editorName})}function closeEditorByType(editorType){return!!editorType&&removeView(function(view){var editor=view.ctrl.editor;return editor&&editor.type===editorType})}function closeEditorByKey(resourceKey){return!!resourceKey&&removeView(function(view){var editor=view.ctrl.editor;return editor&&editor.key===resourceKey})}function closeAllEditor(){return removeView(function(view){return!!view.ctrl.editor})}function openDialog(name,dialogOptions,contentOptions){var dialog=dialogs[name];if(!dialog||dialog.destroyed){var dialogDef=findDialogDef(name);if(!dialogDef)throw"no dialog with name: "+name;dialog=prompter.createDialog($.extend({},dialogDef,dialogOptions),contentOptions),dialogs[dialogDef.name]=dialog}return dialog.open()}function saveAll(){for(var key in views)var view=views[key],promise=view.save()}var eventManager=jlang.EventManager(["afterBootstrap"]),actionDefs=[],perspectiveDefs=[],viewDefs=[],editorDefs=[],editorSupportTypes={},editorAssociateTypes={},dialogDefs=[],regionLayouts={vertical:VerticalRegionLayout,tab:TabRegionLayout,fit:FitRegionLayout};Toolbar.prototype.renderTo=function(wrapEl){this._wrapEl=wrapEl,$.each(this._tools,$.proxy(function(i,tool){this._renderTool(tool)},this))},Toolbar.prototype._renderTool=function(tool){var toolEl=$(templates.viewTool).appendTo(this._wrapEl).attr("data-name",tool.name);toolEl.find("span").text(tool.label||"");var tb=this;toolEl.click($.proxy(function(event){(this.handle||$.noop)(tb)},tool)),this._toggle(tool,toolEl,!1!==tool.visible)},Toolbar.prototype._toggle=function(tool,toolEl,b){tool.visible=!!b,toolEl&&toolEl[b?"show":"hide"]()},$.each(["toggle"],function(i,fn){Toolbar.prototype[fn]=function(name){var args=$.makeArray(arguments).slice(1);$.each(this._tools,$.proxy(function(i,tool){if(tool.name==name)return this["_"+fn].apply(this,[tool,this._wrapEl&&this._wrapEl.find('._tool[data-name="'+name+'"]')].concat(args)),!1},this))}}),Toolbar.prototype.add=function(tools){var tools=tools?$.isArray(tools)?tools:[tools]:[];this._tools.push.apply(this._tools,tools),this._wrapEl&&$.each(tools,$.proxy(function(i,tool){this._renderTool(tool)},this))},View.prototype.renderTo=function(wrapEl){this._viewEl?this._viewEl.appendTo(wrapEl):(this._viewEl=$(templates.view).appendTo(wrapEl),(this._viewDef.render||$.noop).call(this._viewDef,this,this._viewConfig))},View.prototype.destroy=function(){(this._viewDef.destroy||$.noop).call(this._viewDef,this,this._viewConfig)},View.prototype.save=function(){var result=(this._viewDef.save||$.noop).call(this._viewDef);return isPromise(result)||(result=$.when(result)),result},Object.defineProperties(View.prototype,{id:{get:function(){return this._id}},name:{get:function(){return this._name}},title:{get:function(){var t=this._title||this._viewDef.title;return $.isFunction(t)&&(t=t()),t},set:function(val){this._title=val}},toolbar:{get:function(){return this._toolbar}},element:{get:function(){return this._viewEl[0]}},workbench:{get:function(){return workbenchCtrl}},ctrl:{get:function(){return this._ctrl},set:function(val){this._ctrl=val||{}}}}),Editor.prototype.renderTo=function(wrapEl){this._editorEl=$(templates.editor).appendTo(wrapEl),(this._editorDef.render||$.noop).call(this._editorDef,this,this._resource,this._editorConfig)},Editor.prototype.destroy=function(){(this._editorDef.destroy||$.noop).call(this._editorDef,this,this._resource)},Object.defineProperties(Editor.prototype,{name:{get:function(){return this._name}},type:{get:function(){return this._type}},key:{get:function(){return this._key}},data:{get:function(){return this._data}},title:{get:function(){var t=this._title||this._editorDef.title||this.key;return $.isFunction(t)&&(t=t()),t},set:function(val){this._title=val}},element:{get:function(){return this._editorEl[0]}},workbench:{get:function(){return workbenchCtrl}},ctrl:{get:function(){return this._ctrl},set:function(val){this._ctrl=val||{}}}});var workbenchEl,actions={},perspectives={},views={},dialogs={},viewIdPrefix=":workbench:view:",viewIdIndex=1;this.registerAction=registerAction,this.registerPerspective=registerPerspective,this.registerView=registerView,this.registerEditor=registerEditor,this.registerDialog=registerDialog,this.on=$.proxy(eventManager,"on"),this.off=$.proxy(eventManager,"off"),this.bootstrap=bootstrap;var workbenchCtrl={switchPerspective:switchPerspective,createView:createView,getView:getView,getViewByName:getViewByName,removeView:removeView,activeView:activeView,openEditor:openEditor,closeEditor:closeEditor,closeEditorByName:closeEditorByName,closeEditorByType:closeEditorByType,closeEditorByKey:closeEditorByKey,closeAllEditor:closeAllEditor,openDialog:openDialog,executeAction:executeAction,saveAll:saveAll}}var templates={workbench:'<div class="slides-workbench"><div class="slides-workbench-header"></div><div class="slides-workbench-toolbar"></div></div>',perspectiveWrap:'<div class="slides-workbench-perspective-wrap"></div>',perspective:'<div class="slides-workbench-perspective"></div>',perspectiveLayout:'<div class="slides-layout-border"></div>',regionWrap:{left:'<div class="_left" style="width:{size}px;"></div>',right:'<div class="_right" style="width:{size}px;"></div>',top:'<div class="_top" style="height:{size}px;"></div>',bottom:'<div class="_bottom" style="height:{size}px;"></div>',center:'<div class="_center"></div>'},region:'<div class="slides-workbench-region"></div>',regionLayout:{vertical:{layout:'<div class="slides-layout-vertical"></div>',wrap:'<div class="_box slides-workbench-view-wrap"><div class="_header"><div class="_title"></div><div class="_tools"></div></div><div class="_body"></div></div>'},tab:{layout:'<div class="slides-layout-tab"><div class="_header"></div><div class="_body"></div></div>',headerWrap:'<div class="slides-workbench-view-wrap"></div>',bodyWrap:'<div class="slides-workbench-view-wrap"></div>'},fit:{layout:'<div class="slides-layout-fit"></div>',wrap:'<div class="slides-workbench-view-wrap"><div class="_header"><div class="_title"></div><div class="_tools"></div></div><div class="_body"></div></div>'}},view:'<div class="slides-workbench-view"></div>',editor:'<div class="slides-workbench-editor"></div>',viewTool:'<div class="_tool"><span></span></div>'};return Workbench});