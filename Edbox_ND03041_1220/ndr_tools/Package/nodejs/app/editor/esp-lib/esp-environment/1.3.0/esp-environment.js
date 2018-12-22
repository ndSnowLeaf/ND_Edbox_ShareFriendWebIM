define(["jquery","environmentConfig","espEnvironment/../esp-environment-workspace","espEnvironment/../esp-environment-local","espEnvironment/../esp-environment-nw","espEnvironment/../esp-environment-pptshell","espEnvironment/../esp-environment-server","espEnvironment/../UrlHelper","espEnvironment/../ReferenceUrlResolver"],function($,config,environmentWorkspace,environmentLocal,environmentNw,environmentPptshell,environmentServer,UrlHelper,ReferenceUrlResolver){var location=UrlHelper.analyse(),environments={local:environmentLocal,nw:environmentNw,pptshell:environmentPptshell,server:environmentServer},environment=environmentWorkspace;if(!environment){var environmentKey=location.params.environment;environmentKey||(environmentKey=config.environment||"server"),environment=environments[environmentKey]||environments.server}var encryptedLoginInfo,encryptedUserInfo,supports=$.extend({asset:!0},environment.supports),coursewareobjectLocations={},moduleEditorDefines=[],coursewareobjectTemplateDefines=[],jsLibraryDefines=[],customReferenceUrlResolvers=[],readyDeferred=$.Deferred(),espEnvironment={location:location,url:{makeRoot:function(baseUrl){return baseUrl&&0==baseUrl.indexOf("/")?UrlHelper.root([window.location.pathname,baseUrl]):UrlHelper.root(baseUrl)},coursewareobjectPreview:function(identifier,playerCode,params){return params=$.extend({},params),!1===params.isPreview?delete params.isPreview:params.isPreview=!0,UrlHelper.build(environment.coursewareobjectPreview,$.extend({id:identifier,playerCode:playerCode},params))},coursewareobjectPreviewByMain:function(mainUrl,playerCode){return UrlHelper.build(environment.coursewareobjectPreviewByMain,{mainUrl:espEnvironment.createReferenceUrlResolver().parse(mainUrl),playerCode:playerCode})},coursewareobjectRoot:function(identifier){var l=coursewareobjectLocations[identifier];if(!1!==environment.coursewareobjectRootUseMetadata&&l){var l=espEnvironment.createReferenceUrlResolver().parse(l);return l=l.substring(0,l.lastIndexOf("/")),UrlHelper.root(l)}return UrlHelper.root(UrlHelper.build(environment.coursewareobjectRoot,{id:identifier,$$autoParams:!1}))},coursewareobjectTemplateRoot:function(identifier){if(0==coursewareobjectTemplateDefines.length)return UrlHelper.root(UrlHelper.build(environment.coursewareobjectTemplateRoot,{id:identifier}));var urlRoot;return $.each(coursewareobjectTemplateDefines,function(i,define){if(identifier==define.templateCode)return urlRoot=UrlHelper.root(define.href),!1}),urlRoot},moduleEditorRoot:function(moduleId){if(0==moduleEditorDefines.length)return UrlHelper.root(UrlHelper.build(environment.moduleEditorRoot,{id:moduleId}));var urlRoot;return $.each(moduleEditorDefines,function(i,define){if(moduleId==define.editorCode)return urlRoot=UrlHelper.root(define.href),!1}),urlRoot},modulePresenterRoot:function(presenterId){return environment.modulePresenterRoot?UrlHelper.root(UrlHelper.build(environment.modulePresenterRoot,{id:presenterId})):null},jsLibraryRoot:function(name,version){var isEditorLib=!1,href=null;return $.each(jsLibraryDefines,function(i,define){if(define.name==name)return isEditorLib=define._isEditorLib_||!1,href=define.href,!version&&(version=define.version),!1}),!version&&(version="1.0.0"),isEditorLib&&href?UrlHelper.root(href.replace(environment.jsLibraryRefPathSymbol,environment.jsLibraryRefPath)):UrlHelper.root(UrlHelper.build(environment.jsLibraryRoot,{name:name,version:version}))},questionEditor:function(identifier){return UrlHelper.build(environment.questionEditor,$.extend({id:identifier,token_info:encryptedLoginInfo},location.params))},referenceIcon:function(fileName){return UrlHelper.build([environment.referenceIconPath,fileName])},external:function(key,v1,v2,v3){return UrlHelper.build(environment.external&&environment.external[key],v1,v2,v3)},externalRoot:function(key){return UrlHelper.root(environment.external&&environment.external[key])}},addCustomReferenceUrlResolver:function(resolver){customReferenceUrlResolvers.push(resolver)},createReferenceUrlResolver:function(relativeRootPath,relativePath){var resolver=ReferenceUrlResolver(environment.referencePath,relativeRootPath,relativePath);return resolver.addCustomResolver(customReferenceUrlResolvers),resolver},createCoursewareobjectReferenceUrlResolver:function(identifier,relativeRootPath,relativePath){var resolver=ReferenceUrlResolver(environment.coursewareobjectReferencePath?UrlHelper.build(environment.coursewareobjectReferencePath,{id:identifier}):environment.referencePath,relativeRootPath,relativePath,environment.referencePath);return resolver.addCustomResolver(customReferenceUrlResolvers),resolver},declareCoursewareobjectLocation:function(identifier,l){coursewareobjectLocations[identifier]=l},declareModuleEditor:function(defines){$.isPlainObject(defines)?moduleEditorDefines.push(defines):$.isArray(defines)&&$.each(defines,function(i,define){moduleEditorDefines.push(define)})},declareCoursewareobjectTemplate:function(defines){$.isPlainObject(defines)?coursewareobjectTemplateDefines.push(defines):$.isArray(defines)&&$.each(defines,function(i,define){coursewareobjectTemplateDefines.push(define)})},findCoursewareobjectTemplateDefineByResourceType:function(resourceType){var result;return $.each(coursewareobjectTemplateDefines,function(i,define){if(define.resourceType==resourceType?result=define:define.resourceTypes&&define.resourceTypes.length>1&&$.each(define.resourceTypes,function(si,r){if(r==resourceType)return result=define,!1}),result)return!1}),result},declareJsLibrary:function(defines){$.isPlainObject(defines)?jsLibraryDefines.push(defines):$.isArray(defines)&&$.each(defines,function(i,define){jsLibraryDefines.push(define)})},isSupport:function(name){return!0===supports[name]},externalValue:function(key){return environment.external&&environment.external[key]},ready:function(fn){return readyDeferred.promise()}};return $.isFunction(environment.ready)?$.when(environment.ready(espEnvironment)).done(function(){readyDeferred.resolve()}).fail(function(arg){readyDeferred.reject(arg)}):readyDeferred.resolve(),Object.defineProperties(espEnvironment,{defaultLanguage:{get:function(){return defaultLanguage}},language:{get:function(){return language}},service:{get:function(){return environment.service}},serviceConfig:{get:function(){return environment.serviceConfig}},security:{get:function(){return environment.security}},securityConfig:{get:function(){return environment.securityConfig}},writeMode:{get:function(){return environment.writeMode||config.writeMode||"yes"}},encryptedLoginInfo:{get:function(){return encryptedLoginInfo},set:function(val){encryptedLoginInfo=val}},encryptedUserInfo:{get:function(){return encryptedUserInfo},set:function(val){encryptedUserInfo=val}},coursewareobjectTemplateDefines:{get:function(){return coursewareobjectTemplateDefines}},referencePath:{get:function(){return environment.referencePath}}}),espEnvironment});