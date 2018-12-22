/**
 * Created by zy on 2015/7/6.
 */
define(['angularAMD'], function(angularAMD) {
    angularAMD.directive('translatePanel', ['$filter', function($filter) {
        return {
            restrict: 'E',
            templateUrl: 'interaction/arithmetic/directive/translate-panel/translate-panel.html',
            scope: {
                calNum: '=calNum',
            },
            link: function(scope, element, attrs) {
                //console.log(scope.calNum) ; 
                // scope.first_data_bai=scope.inputData.first_data;

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
                    if (!item.hide) return;
                    //TO:DO 如果是item == "." 
                    var oper = scope.calNum.operator.operator;
                    if (oper === "+" || oper === '-') {
                        if (!mulResult(item)) {
                            item.hide = !item.hide;
                            scope.$parent.errorModel.errorText = $filter('translate')('count.multiple.result.error');
                        }
                    }
                };
                /**
                 * 存在多解的情况：
                 *   1. 同一列挖了3个
                 *   2. 同一列挖了2个，除以下两种情况都会存在多解：
                 *      2.1. 挖了同一列的第一个数和第二个数， 且都为0或9，但一种例外：连续0099，如*09*+*09*
                 *      2.2. 挖了同一列的第一个数和第三个数，当第一个数为9，第3个数为0
                 *
                 * @param item
                 * @returns {boolean}
                 */
                function mulResult(item) {
                    var n1, n2, n3;
                    var findItemByIndex = function(numItems) {
                        for (var i = 0, l = numItems.length; i < l; i++) {
                            if (numItems[i].index === item.index) {
                                return numItems[i];
                            }
                        }
                        return false;
                    }
                    n1 = findItemByIndex(scope.calNum.number_first.items);
                    //减法的时候转化成加法计算
                    if (parseInt(scope.calNum.number_first.number) < 0) {
                        n3 = findItemByIndex(scope.calNum.number_second.items);
                        n2 = findItemByIndex(scope.calNum.number_result.items);
                    } else {
                        n2 = findItemByIndex(scope.calNum.number_second.items);
                        n3 = findItemByIndex(scope.calNum.number_result.items);
                    }

                    if (n1 && n2 && n1.hide && n2.hide) {
                        if (n1.num == n2.num && (n1 === "0" || n1 === "9")) {
                            return true //单解
                        } else {
                            return false;
                        }
                    } else if (n1 && n3 && (n1.hide && n3.hide) || n3 && n2 && (n2.hide && n3.hide)) {
                        if (!n2.hide && n1.num === "9" && n3.num === "0") {
                            return true;
                        }
                        if (!n1.hide && n2.num === "9" && n3.num === "0") {
                            return true;
                        }
                        return false; //加减法多解
                    }
                    return true;
                };
            }

        };
    }])

});