/**
 * Created by zy on 2015/7/6.
 */
define(['angularAMD'], function(angularAMD) {
    angularAMD.directive('multiplyPanel', [function() {
        return {
            restrict: 'E',
            templateUrl: 'interaction/arithmetic/directive/multiply-panel/multiply-panel.html',
            scope: {
                calNum: '=calNum',
            },
            link: function(scope, element, attrs) {

                scope.changeDotClass = function(item) {
                    var className = "com_u_btn_dot dot_defalut";
                    if (item.dot_show) {
                        className += " dot_show";
                    }
                    if (item.hide) {
                        className = className.replace("dot_defalut", "dot_fill");
                    } else {
                        className = className.replace("dot_fill", "dot_defalut");
                    }
                    return className;
                }
                scope.checkNum = function(item) {
                    if (item.num == "." && !item.dot_show) return;
                    item.hide = !item.hide;
                }
            }

        };
    }])

});