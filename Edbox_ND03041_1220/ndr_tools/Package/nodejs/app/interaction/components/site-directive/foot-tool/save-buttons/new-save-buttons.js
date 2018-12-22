define(["angularAMD","customeditor.service"],function(e){e.directive("cancelButton",[function(){return{restrict:"EA",templateUrl:"interaction/components/site-directive/save-buttons/cancel-button.html",controller:["$scope",function(e){var t=function(e){window.messageIframe.messenger.targets.parent.send({message:e})};e.cancel=function(){t("QuestionEditCancel")}}]}}]).directive("newSaveButtons",["ngDialog","CustomEditorService","$stateParams","$http","$timeout","CONSTANTS_GLOBAL",function(e,t,i,n,a,o){return{restrict:"E",replace:!0,templateUrl:"interaction/components/site-directive/foot-tool/save-buttons/new-save-buttons.html",scope:{postData:"=postData",validData:"=",encodeData:"=",decodeData:"=",version:"@"},controller:["$scope","$q","$filter","diskpathService",function(s,r,u,c){function d(e){return!(!g||!v.defaultTitleSetting.isCleared)&&(s.$emit(o.FS_DEFAULT_TITLE_CONFIRM_EVENT,e),!0)}n.get("/prepare/mapping").success(function(e){s.types=e.interact_question}),s.lang=i._lang_,s.isModify=i.isModify;var l=function(){if(s.validData&&(s.$parent.errorModel&&(s.$parent.errorModel.errorText=""),1!=s.validData())){var e=r.defer();return e.reject(),e.promise}var n=null;return n=s.postData.id?t.updateQuestion(s.encodeData(s.postData),null):t.addQuestion(s.encodeData(s.postData),null),n.then(function(e){angular.extend(s.postData,s.decodeData(e)),i.id=s.postData.id},function(e){s.$parent.errorModel&&(console.error(e),e.data?s.$parent.errorModel.errorText="发生系统错误：["+e.data.message+"].":s.$parent.errorModel.errorText="发生系统错误：[status:"+e.status+", text:"+e.statusText+"].");var t=r.defer();return t.reject(),t.promise})},p=function(e){var t={message:e,id:s.postData.id,isCustom:!0,question_type:i.question_type};switch(i.question_type){case"linkup":case"nd_memorycard":t.skin=s.postData.skin.css_url,t.spirit_root=s.postData.skin.package_url,s.postData.timer&&(t.timer_type=s.postData.timer.timer_type,t.time_limit=60*parseInt(s.postData.timer.time_minute||0)+parseInt(s.postData.timer.time_second||0));break;default:t.skin=s.postData.skin.css_url,t.question_title=window.customHtmlEncode(s.postData.title),s.postData.timer&&(t.timer_type=s.postData.timer.timer_type,t.time_limit=60*parseInt(s.postData.timer.time_minute||0)+parseInt(s.postData.timer.time_second||0))}window.messageIframe.messenger.targets.parent.send(t),_(e)},_=function(e){var t={message:"question_insert",question_id:s.postData.id,question_online:!1,question_tags:"interact_question",question_type:i.question_type,question_code:f(i.question_type),question_title:s.postData.title,question_path:c.getFilepath(),old_question_id:i.old_identifier||"",old_question_path:i.old_file_path||""},n=!1;switch(e){case"QuestionPreview":s.isModify&&(n=!0,t.message=i.old_identifier?"question_replace":"question_saved");break;case"QuestionSaved":n=!0,t.message=i.old_identifier?"question_replace":"question_saved";break;case"QuestionAdd":n=!0,t.message="question_insert"}if(n)try{PCInterface.questionAction(JSON.stringify(t))}catch(e){console.error("Fail to call PC interface for questionAction.")}},m=function(){angular.element(".exam_wood .global_success_tip").hide().show(),a(function(){angular.element(".exam_wood .global_success_tip").hide()},3e3)};s.preview=function(n){!!g&&(v.defaultTitleSetting.isCleared=!1),l().then(function(){p("QuestionPreview"),t.getPreviewUrl().then(function(t){s.previewUrl=t.url+"&isPreview=true&_lang_="+(i._lang_||"")+"&sys="+(i.sys||"")+"&rnd="+(new Date).getTime()+"&embed=true",e.open({templateUrl:"interaction/components/site-directive/save-buttons/preview.html",scope:s,className:"bk-dialog bk-dialog-previewtask"})})})};var f=function(e){for(var t=s.types,i=0;i<t.length;i++)if(t[i].type==e)return t[i].code};s.save=function(e){if(!e&&d("QuestionSaved"))return!1;l().then(function(){m(),p("QuestionSaved")})},s.add=function(e){if(!e&&d("QuestionAdd"))return!1;l().then(function(e){p("QuestionAdd")})};var v=s.$root.moduleScope,g=!!v&&angular.isObject(v.defaultTitleSetting);g&&(v.$on(o.FS_DEFAULT_TITLE_CONFIRM_EVENT,function(e,t){v.$broadcast(o.FP_DEFAULT_TITLE_CONFIRM_EVENT,t)}),v.$on(o.FS_CONTINUE_ACTION_EVENT,function(e,t){v.$broadcast(o.FP_CONTINUE_ACTION_EVENT,t)}),s.$on(o.FP_CONTINUE_ACTION_EVENT,function(e,t){switch(v.defaultTitleSetting.isCleared=!1,t){case"QuestionPreview":s.preview(!0);break;case"QuestionSaved":s.save(!0);break;case"QuestionAdd":s.add(!0)}}))}]}}])});