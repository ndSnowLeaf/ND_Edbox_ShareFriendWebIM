define(['require','question-module','jquery'],function(require,module){
    var $=require('jquery');
    module.directive("selectDifficulty", ['$document',function($document){
        return {
            restrict:'EA',
            replace:true,
            templateUrl:'questionstore/$directives/select-difficulty.html',
            scope:{
                onSelect:"&",
                difficulties:"="
            },
            controller:['$scope',function($scope){
                $scope.selectDifficulty = function(difficulty){
                    $scope.difficulty = difficulty.code;
                    $scope.onSelect({difficulty:difficulty.code})
                };
                $scope.show=function($event){
                    $scope.showSelect = !$scope.showSelect;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                $($document).on("click",function(){
                    $scope.showSelect = false;
                });
                $scope.toNumber = function(difficulty){
                    var difficulties ={
                        'very easy':1,
                        'easy':2,
                        'medium':3,
                        'difficult':4,
                        'very difficult':5
                    };
                    var result = difficulties[difficulty] ;
                    if(result == undefined){
                        return -1;
                    }
                    return result;
                }

            }],
            link : function($scope, iElement, iAttrs) {

            }
        };
    }]);
});