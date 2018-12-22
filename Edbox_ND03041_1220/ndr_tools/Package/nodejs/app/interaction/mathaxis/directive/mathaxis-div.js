/**
 * Created by Administrator on 2015/12/3.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('mathaxisDiv', ['$filter',function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'interaction/mathaxis/directive/mathaxis-div.html',
            link: function (scope, element) {
            	var addon = AddonMathAxis();
            	addon.setLocationProperties({
            		"mathaxis_question1": $filter('translate')('mathaxis.question1'),
            		"mathaxis_question2": $filter('translate')('mathaxis.question2'),
            		"mathaxis_question3": $filter('translate')('mathaxis.question3'),
            		"mathaxis_question4": $filter('translate')('mathaxis.question4')
            	})
                addon.run($('.com_lay_mboard'),scope.model,false,scope);

            }
        };
    }]);
});
