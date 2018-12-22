define(['require','question-module','jquery','plupload','mathjax'],function(require,module){
    var $=require('jquery');
    module.directive("lcQuestionList", ['$requestInfo','$context','$questionList','$console','$timeout','$i18n',function($requestInfo,$context,$questionList,$console,$timeout,$i18n){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                onSelect:'&',
                store:'=',
                selectedQuestions:"=",
                initChapterId:"="
            },
            templateUrl:'questionstore/$directives/lc-question-list.html',
            controller:['$scope',function($scope){
                $scope.pagination ={page:1,size:10};
                $scope.chapter_id =  $requestInfo.params.chapter_id;
                $scope.$watch("store.startSearch",function(newValue,oldValue){
                   if($scope.store&&$scope.store.startSearch){
                       $scope.store.startSearch = false;
                       //start search
                       $scope.doSearch();
                   }
                });
                var setQuestionSelectStatus  = function(){
                    for(var i=0;i<$scope.questions.length;i++){
                        $scope.questions[i].selected = false;
                    }
                    for(var i=0;i<$scope.questions.length;i++){
                        for(var j=0;j<$scope.selectedQuestions.length;j++){
                            if($scope.questions[i].identifier == $scope.selectedQuestions[j].item.identifier){
                                $scope.questions[i].selected = true;
                            }
                        }
                    }
                }
                $scope.$watch("selectedQuestions.length",function(newValue,oldValue){
                    if(newValue!=oldValue){
                        setQuestionSelectStatus();
                    }
                });
                $scope.doSearch = function(){
                    var keyword = $scope.store.keyword;
                    var coverage = $scope.store.coverage;
                    $questionList.loadQuestions($scope.pagination.page,$scope.pagination.size,keyword,coverage,$scope.chapter_id,$scope.question_type,$scope.difficulty).then(function(result){
                        $scope.questions = result.data.items;
                        $scope.pagination.totalItems=result.data.total_count;
                        setQuestionSelectStatus();
                    })['finally']($console.wait($i18n('qti.newdata.loading')));
                };
                $scope.$on('itemsRendered',function(){
                    $timeout(function(){
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                    });
                });
                function findQuestionName(code){
                    for(var i=0;i< $scope.question_types.length;i++){
                        if( $scope.question_types[i].code == code){
                            return  $scope.question_types[i].name;
                        }
                    }
                    return "";
                }
                $scope.question_types = [
                    {code: '$RE0201',name:$i18n('qti.type.choice')},
                    {code: '$RE0202',name:$i18n('qti.type.multiplechoice')},
                    {code: '$RE0204',name:$i18n('qti.type.order')},
                    {code: '$RE0203',name:$i18n('qti.type.judge')},
                    {code: '$RE0209',name:$i18n('qti.type.textentry')},
                    {code: '$RE0205',name:$i18n('qti.type.match')},
                    {code: '$RE0207',name:$i18n('qti.type.graphicgapmatch')},
                    {code: '$RE0210',name:$i18n('qti.type.handwrite')},
                    {code: '$RE0225',name:$i18n('qti.type.vote')}/*,
                    {code: '$RE0232',name:'主观基础题'}*/
                ];
                $scope.difficulties = [
                    {code: 'none',name:'未定义'},
                    {code: 'very easy',name:'非常简单'},
                    {code: 'easy',name:'简单'},
                    {code: 'medium',name:'中等'},
                    {code: 'difficult',name:'困难'},
                    {code: 'very difficult',name:'非常困难'},
                ];
                $scope.toNumber = function(difficulty){
                    var difficulties ={
                        'none':0,
                        'very easy':1,
                        'easy':2,
                        'medium':3,
                        'difficult':4,
                        'very difficult':5
                    };
                    return difficulties[difficulty] || 0;
                }

                $scope.addQuestion = function(question){
                    question.selected = true;
                    $scope.onSelect({item:question});
                }
                $scope.removeQuestion = function(question){
                    question.selected = false;
                    $scope.onSelect({item:question});
                }
                $scope.selectQuestion=function(type){
                    $scope.question_type=type;
                    $scope.doSearch();
                }
                $scope.selectDifficulty=function(difficulty){
                    $scope.difficulty = difficulty;
                    $scope.doSearch();
                }
                $scope.getQuestionType = function(question){
                    var restypes = question&&question.categories&&question.categories.res_type ? question.categories.res_type : [];
                    for(var i=0;i<restypes.length;i++){
                        if(restypes[i].taxoncode!='$RE0200'){
                            return findQuestionName(restypes[i].taxoncode);
                        }
                    }
                }
                $scope.lang = $context.getLang();
                $scope.doSearch();
            }],
            link : function($scope, iElement, iAttrs) {

            }
        };
    }]);
});