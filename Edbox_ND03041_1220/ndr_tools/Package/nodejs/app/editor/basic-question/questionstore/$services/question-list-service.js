define(['require','question-module'],function(require,module){
    module.factory("$questionList",['$http','$url','$stateParams','$config','$auth','$context',function($http,$url,$stateParams,$config,$auth,$context){

        return {
            loadBasicQuestion:function(page,size,question_type,keyword,coverage,chapter_id,difficulty){
                return $http.get($url.slidesRemote('/v1.3/questions',{
                    page:page,
                    size:size,
                    words:keyword||'',
                    coverage:coverage || $context.coverage.common,
                    chapter_id:chapter_id||'',
                    question_type:question_type||'$RE0201',
                    difficulty: difficulty||''
                }))
            },
            loadInteractionQuestionQuestion:function(page,size,question_type,keyword,coverage,chapter_id,difficulty){
                return $http.get($url.slidesRemote('/v1.3/courseware_objects',{
                    page:page,
                    size:size,
                    words:keyword||'',
                    coverage:coverage || $context.coverage.common,
                    chapter_id:chapter_id||'',
                    category:question_type,
                    difficulty: difficulty||''
                }));
            },
            download_and_copy:function(id,isBasic){
                return $http.post($url.slides('/v0.1/tools/download_and_copy'),{
                    id:id,
                    isBasic:isBasic,
                    lifecycleServer:$config.lifecycleServer
                });
            },
            loadQuestions:function(page,size,keyword,coverage,chapterId,question_type,difficulty){
                return $http.get($url.slidesRemote('/v1.3/questions',{
                    page:page,
                    size:size,
                    words:keyword,
                    coverage:coverage,
                    chapter_id:chapterId,
                    question_type:question_type||'$RE0201,$RE0202,$RE0203,$RE0204,$RE0205,$RE0207,$RE0209,$RE0210,$RE0225',
                    difficulty: difficulty||''
                })).then(function(baseQuestion){
                    if(question_type&&question_type !='$RE0210'){
                        return baseQuestion;
                    }
                    var range = (page-1)*size - baseQuestion.data.total_count;
                    var startPage = range>0 ? (range%20==0 ? Math.floor(range/20) :Math.floor(range/20+1)):1;
                    return $http.get($url.slidesRemote('/v1.3/courseware_objects',{
                        page:startPage,
                        size:size,
                        words:keyword,
                        coverage:coverage,
                        chapter_id:chapterId,
                        category:'$RE0445',
                        difficulty: difficulty||''
                    })).then(function(iQuestion){
                        var count = baseQuestion.data.total_count+iQuestion.data.total_count;
                        var needCount = (page-1)*size;
                        if(baseQuestion.data.total_count>needCount+size){
                            var items = baseQuestion.data.items;
                            return  {data:{item_count:size,items:items,total_count:count}};
                        }
                        else if(baseQuestion.data.total_count>needCount){
                            var items = baseQuestion.data.items;
                            for(var i=0;i<size-items.length&&i<iQuestion.data.items.length;i++){
                                items.push(iQuestion.data.items[i]);
                            }
                            return  {data:{item_count:size,items:items,total_count:count}};
                        }
                        else{
                            var range = (page-1)*size - baseQuestion.data.total_count;
                            var startPage = range>0 ? (range%20==0 ? Math.floor(range/20) :Math.floor(range/20+1)):1;
                            return $http.get($url.slidesRemote('/v1.3/courseware_objects',{
                                page:startPage+1,
                                size:size,
                                words:keyword,
                                coverage:coverage,
                                chapter_id:chapterId,
                                category:'$RE0445',
                                difficulty: difficulty||''
                            })).then(function(fresult){
                                var items = [];
                                var startIndex = range%20;
                                for(var i=startIndex;i<iQuestion.data.items.length;i++){
                                    items.push(iQuestion.data.items[i]);
                                }
                                for(var i=0;items.length<size&&i<fresult.data.items.length;i++){
                                    items.push(fresult.data.items[i]);
                                }
                                return {data:{item_count:size,items:items,total_count:count}};
                            });
                        }
                    });
                });
            }
        };
    }]);
});