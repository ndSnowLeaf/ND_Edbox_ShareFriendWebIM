define(['require','question-module','css!../import_question_style.css'],function(require,module){
    module.controller("importSampleController",['$scope','$i18n','$qti','$category',
        '$materialAPI','$context','$url','$console','$timeout',
        '$messenger','$stateParams','$isoDate',"$state","$filter",'$questionList','$questionTemplates','$sce','$location','$config',
        function($scope,$i18n,$qti,$category,$material,$context,$url,$console,$timeout,$messenger,$stateParams,$isoDate,$state,$filter,$questionList,$questionTemplates,$sce,$location,$config){
            var init = function(){
                $questionTemplates.getTemplates("basic_question").then(function(data){
                    $scope.basic_questions = data.data.items;
                });
                $questionTemplates.getTemplates("interaction_question").then(function(data){
                    $scope.interaction_questions = data.data.items;
                });
                var type = $stateParams.template || 'choice';
                $questionTemplates.getTemplate(type).then(function(data){
                    $scope.selectQuestionType(data.data);
                })
            };
            init();
            var pageSize = 3;
            var doQuery = function(){
                $scope.loading = true;
                var category = $scope.template.lccode;
                var chapter_id = $stateParams.chapter_id;
				var coverageSample = 'App/203918ab-cd5a-49da-bff7-c2868bb86382/';
                var promise = $scope.template.isBasic ?  $questionList.loadBasicQuestion($scope.page,pageSize,category,null,coverageSample,'') :$questionList.loadInteractionQuestionQuestion($scope.page,pageSize,category,null,coverageSample,'');
                promise.success(function(data){
                    $scope.loading = false;
                    var startIndex = ($scope.page-1)*pageSize;
                    var endIndex = startIndex+pageSize;
                    for(var i=0;i<data.items.length;i++){
                        $scope.items[startIndex+i] = data.items[i];
                        loadNickName(data.items[i]);
                    }
                    $scope.item = $scope.items[$scope.current-1];
                    if($scope.item == null){
                        if($scope.items.length>0){
                            $scope.current = 1;
                            $scope.item = $scope.items[$scope.current-1];
                            $scope.empty = false;
                        }
                        else{
                            $scope.empty = true;
                        }
                    }
                    else{
                        $scope.empty = false;
                    }
                });
            };
            var loadNickName = function(item){
                var userId = item.life_cycle.creator;
                $qti.loadUser(userId).then(function(data){
                    var user = data.data;
                    item.nickname = user.nick_name;
                },function(err){
                    item.nickname = item.life_cycle.creator;
                    return {handled:true};
                });
            }
            $scope.next = function(){
                $scope.current++;
                if($scope.items[$scope.current-1]){
                    $scope.item = $scope.items[$scope.current-1];
                }
                else{
                    $scope.page =Math.floor($scope.current%pageSize==0 ? $scope.current/pageSize :  $scope.current/pageSize+1);
                    doQuery();
                }
            }
            $scope.selectQuestionType = function(template){
                if($scope.template&&$scope.template.lccode == template.lccode){
                    return;
                }
                $scope.template = template;
                $scope.current = 1;
                $scope.page = 1;
                $scope.items = [];
                $scope.item = null;
                doQuery();
            };
            var toUrl = function(url,params){
                url = url+"?";
                for(var key in params){
                    url += key+"="+encodeURIComponent(params[key])+"&";
                }
                return url;
            }
            var importQuestion=function(){
                var defaultParams = $location.search();
                $questionList.download_and_copy($scope.item.identifier,$scope.template.isBasic).then(function(result){
                    var data = result.data;
                    if(data.result_code == '1'){
                        $console.message($i18n("sample.inserting.error"));
                        return ;
                    }
                    var target = window.parent ? window.parent : window;
                    while(target.parent&&target!=target.parent){
                        target = target.parent;
                    }
                    var params = {
                        template:$scope.template.code,
                        sys:"pptshell",
                        file_path: data.file_path,
                        id: data.identifier,
                        question_type:$scope.template.code,
						isSample: true
                    };
                    target.location =toUrl('/editor/',angular.extend({},defaultParams,params));
                }).finally($console.wait($i18n("sample.inserting")));
            };
            $scope.importQuestion = function(){
                if(!$scope.item){
                    return;
                }
                var defaultParams = $location.search();
                if(defaultParams.old_identifier){
                    $console.confirm($i18n("sample.insert.confirm"),function(){
                        importQuestion();
                    })
                }
                else{
                    importQuestion();
                }
            }
            $scope.getEditUrl = function(){
                if(!$scope.item) return null;
                var filepath = $scope.item.tech_info ?  $scope.item.tech_info.href.entry||$scope.item.tech_info.href.location : '';
                if(filepath&&filepath.indexOf(".xml")!=-1){
                    filepath = filepath.substring(0,filepath.lastIndexOf("/"));
                }
                if(filepath&&$scope.template.categoryCode=="basic_question"){
                    filepath = filepath.replace("${ref-path}",$config.csServer2);
                    var url = "/editor/?id="+$scope.item.identifier+"&template="+$scope.template.code+"&file_path="+encodeURIComponent(filepath)+"&hideSample=true&_lang_="+$location.search()["_lang_"];
                    //var url = "http://localhost:8081/questions/"+$scope.item.identifier+"/edit?editorCode=slides_production&template="+$scope.template.code;
                    return $sce.trustAsResourceUrl(url);
                }
                else{
                    filepath = filepath.replace("${ref-path}",$config.csServer2);
                    //var url = "http://esp-coursewareobject.edu.web.sdp.101.com/?id="+$scope.item.identifier+"&editorCode=slides_production&template="+$scope.template.code;
                    var url = "/editor/?id="+$scope.item.identifier+"&template="+$scope.template.code+"&file_path="+encodeURIComponent(filepath)+"&hideSample=true&isPreview=true&_lang_="+$location.search()["_lang_"];
                    return $sce.trustAsResourceUrl(url);
                }


            }
        }]);
});