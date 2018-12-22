/**
 * Created by zy on 2015/7/6.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('translatePanel', [ function () {
        return {
            restrict:'E',
            templateUrl:'interaction/fraction/directive/panel/translate-panel.html',
            scope: {
            	prompt:'=prompt',
                previousStep:"=previousStep",
                allowLcm:"=allowLcm",
                allowSampleResult:"=allowSampleResult"
            },
            link:function(scope,element,attrs){

                scope.checkNum = function( item ){
                	item.hide = !item.hide;
                }
                

                

                
            }
            
        };
    }])

});
