define(['require','question-module','jquery','plupload'],function(require,module){
    var $=require('jquery');
    module.directive("lcQuestionSelect", ['$requestInfo','$context',function($requestInfo,$context){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                onSelect:'&',
                chapterIds:'=',
                defaultKeyword:'=',
                selectedQuestions:"=",
                initChapterId:'='
            },
            templateUrl:'questionstore/$directives/lc-question-select.html',
            controller:['$scope',function($scope){
                var defaultKeyword = "";
                $scope.selectQuestion = function(question){
                    $scope.onSelect({item:question});
                }
                $scope.stores = [];


                $scope.stores.push({title:$i18n("qti.newdata.nd.question"),coverage:$context.coverage.common,keyword:defaultKeyword});
                if($context.currentOrg()){
                    $scope.stores.push({title:$i18n("qti.newdata.school.question"),coverage:'Org/'+$context.currentOrg()+'/',keyword:defaultKeyword});
                }
                if($context.currentCreator()&&$context.currentCreator()!='0'){
                    $scope.stores.push({title:$i18n("qti.newdata.mine.question"),coverage:$context.coverage.user,keyword:defaultKeyword});
                }
                $scope.currentStore = $scope.stores[0];
                $scope.gotoStore = function(store){
                    $scope.currentStore = store;
                }
                $scope.search = function(){
                    $scope.currentStore.startSearch = true;
                }
                $scope.selectQuestion = function(item){
                    $scope.onSelect({item:item});
                }
            }],
            link : function($scope, iElement, iAttrs) {

            }
        };
    }]);
});