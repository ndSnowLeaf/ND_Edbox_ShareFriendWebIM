define(['require','question-module','jquery'],function(require,module){
    var $=require('jquery');
    module.directive("selectQuestionType", ['$document',function($document){
        return {
            restrict:'EA',
            replace:true,
            templateUrl:'questionstore/$directives/select-question-type.html',
            scope:{
                onSelect:"&",
                questionTypes:"="
            },
            controller:['$scope',function($scope){
                $scope.selectQuestion = function(type){
                    $scope.question_type = type.name;
                    $scope.onSelect({type:type.code})
                };
                $scope.show=function($event){
                    $scope.showSelect = !$scope.showSelect;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                $($document).on("click",function(){
                    $scope.showSelect = false;
                })

            }],
            link : function($scope, iElement, iAttrs) {

            }
        };
    }]);
});