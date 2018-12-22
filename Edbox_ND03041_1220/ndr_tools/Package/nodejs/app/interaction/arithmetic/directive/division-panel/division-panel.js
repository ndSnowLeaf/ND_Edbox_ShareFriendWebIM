/**
 * Created by zy on 2015/7/6.
 */
define(['angularAMD'], function(angularAMD) {
    angularAMD.directive('divisionPanel', [function() {
        return {
            restrict: 'E',
            templateUrl: 'interaction/arithmetic/directive/division-panel/division-panel.html',
            scope: {
                calNum: '=calNum'

            },
            link: function(scope, element, attrs) {

                scope.changeDotClass = function(item) {
                    var className = "com_u_btn_dot dot_defalut";
                    if (item.dot_show) {
                        className += " dot_show";
                    }
                    if (item.dashed) {
                        className += " dot_dashed";
                    }
                    if (item.hide) {
                        className = className.replace("dot_defalut", "dot_fill");
                    } else {
                        className = className.replace("dot_fill", "dot_defalut");
                    }
                    return className;
                }

                scope.changeNumClass = function(item) {
                    var className = "com_u_btn2";
                    if (item.dashed) {
                        className += " com_u_zero";
                    }
                    return className;
                }

                scope.checkNum = function(item) {
                    if (item.num == "." && !item.dot_show) return;
                    item.hide = !item.hide;
                    //console.log(scope.calNum);

                }
            }

        };
    }])

});