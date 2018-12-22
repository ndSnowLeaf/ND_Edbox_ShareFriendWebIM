define(["require","jquery","espEnvironment","espService","espModel","prompter","i18n!"],function(requirejs,$,espEnvironment,espService,espModel,prompter,i18n){function getEditorConfig(templateIdentifier){var deferred=$.Deferred(),coursewareobjectTemplateRepository=espModel.repository.coursewareobjectTemplate(templateIdentifier);return null==coursewareobjectTemplateRepository?deferred.reject(i18n.translate("server.error.template.missing")+templateIdentifier):requirejs([coursewareobjectTemplateRepository.getResourceUrl("editor-config.js")],function(editorConfig){deferred.resolve(editorConfig)},function(error){console.warn(i18n.translate("courseware.error.editor.config.loading",templateIdentifier),error),deferred.resolve(null)}),deferred.promise()}function getTemplateIdentifier(coursewareobjectMetadata){var templateIdentifier=coursewareobjectMetadata.custom_properties&&coursewareobjectMetadata.custom_properties.template_code;if(!templateIdentifier)for(var resTypes=coursewareobjectMetadata.categories&&coursewareobjectMetadata.categories.res_type||[],i=0;i<resTypes.length;i++){var templateDefine=espEnvironment.findCoursewareobjectTemplateDefineByResourceType(resTypes[i].taxoncode);if(templateDefine){templateIdentifier=templateDefine.templateCode;break}}return templateIdentifier}function PageTransformFactory(templateIdentifier,coursewareobjectIdentifier,userTransform){this._templateIdentifier=templateIdentifier,this._coursewareobjectIdentifier=coursewareobjectIdentifier,this._userTransform=userTransform}function PageTransform(templateIdentifier,coursewareobjectIdentifier,userTransform,pageIndex){this._templateIdentifier=templateIdentifier,this._coursewareobjectIdentifier=coursewareobjectIdentifier,this._userTransform=userTransform,this._pageIndex=pageIndex}var defaultEditorConfig={editorType:"general"};return PageTransformFactory.prototype.create=function(pageIndex){return new PageTransform(this._templateIdentifier,this._coursewareobjectIdentifier,this._userTransform,pageIndex)},PageTransform.prototype.read=function(page){var reader=this._userTransform&&this._userTransform.read;return $.isFunction(reader)?(this._page=page,$.when(espModel.repository.coursewareobjectTemplate(this._templateIdentifier).getEditorTemplateForPage(this._coursewareobjectIdentifier,page.id,this._pageIndex),$.ajax({type:"GET",url:espModel.repository.coursewareobject(this._coursewareobjectIdentifier).getResourceUrl("resources/editor.json"),dataType:"json"}).then(function(result){return result},function(error){return console.warn(i18n.translate("courseware.error.editor.json.loading"),error),$.when(null)})).then($.proxy(function(editorPage,editorJson){return this._editorJson=editorJson,reader(this._page,editorPage,editorJson),editorPage},this))):$.when(page)},PageTransform.prototype.write=function(editorPage){var writer=this._userTransform&&this._userTransform.write;if(this._page&&$.isFunction(writer)){var exports={};return writer(this._page,editorPage,exports),exports.editorJson?espModel.repository.coursewareobject(this._coursewareobjectIdentifier).getResourceWriter("resources/editor.json")(JSON.stringify(exports.editorJson)).then($.proxy(function(){return this._page},this)):$.when(this._page)}return $.when(editorPage)},{doEdit:function(workbench,coursewareobjectMetadata,config){var deferred=new $.Deferred,location=coursewareobjectMetadata.tech_info&&coursewareobjectMetadata.tech_info.href&&coursewareobjectMetadata.tech_info.href.location;location&&espEnvironment.declareCoursewareobjectLocation(coursewareobjectMetadata.identifier,location);var templateIdentifier=getTemplateIdentifier(coursewareobjectMetadata);return templateIdentifier?getEditorConfig(templateIdentifier).then(function(editorConfig){editorConfig||(console.warn(i18n.translate("courseware.error.editor.template.unconfig",templateIdentifier)),editorConfig=defaultEditorConfig),"string"==typeof editorConfig&&(editorConfig={editorType:editorConfig}),editorConfig.editorType||(editorConfig.editorType=defaultEditorConfig.editorType),requirejs(["./implements/"+editorConfig.editorType+".js"],function(customization){customization($.extend({$template:templateIdentifier},editorConfig,config,{pageTransformFactory:new PageTransformFactory(templateIdentifier,coursewareobjectMetadata.identifier,editorConfig.pageTransform)}),workbench,coursewareobjectMetadata),deferred.resolve()},function(error){deferred.reject(i18n.translate("courseware.error.editor.not.exist",editorConfig.editorType))})},function(e){deferred.reject(e)}):deferred.reject(i18n.translate("courseware.error.editor.unkonwntemplate")),deferred.promise()}}});