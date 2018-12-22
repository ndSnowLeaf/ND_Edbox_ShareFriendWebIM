define(['require','question-module','jquery','plupload'],function(require,module){
    var $=require('jquery');
    module.directive("ndStar", [function(){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                ndStar:'='
            },
            templateUrl:'questionstore/$directives/ndStar.html',
            controller:['$scope',function($scope){

                $scope.ndStar = $scope.ndStar || 0;
                $scope.range = function(min, max, step) {
                    step = step || 1;
                    var input = [];
                    for (var i = min; i < max; i += step) {
                        input.push(i);
                    }
                    return input;
                };
            }],
            link : function($scope, iElement, iAttrs) {

            }
        };
    }]);
});