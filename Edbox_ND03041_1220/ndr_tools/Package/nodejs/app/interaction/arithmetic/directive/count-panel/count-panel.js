/**
 * Created by zy on 2015/7/6.
 */
define(['angularAMD', 'arithmetic/service/utils.service'], function(angularAMD) {

    angularAMD.directive('countPanel', ['$filter', 'ArithmeticUtils', function($filter, Utils) {
        return {
            restrict: 'E',
            templateUrl: 'interaction/arithmetic/directive/count-panel/count-panel.html',
            scope: {
                inputData: '=countData',
                error: '=error',
                errorModel: '=errorModel'
            },
            replace: true,
            link: function(scope, element, attrs) {
                var KEYCODE = {
                    "KP_BackSpace": 8,
                    "KP_Home": 36,
                    "KP_Select": 41,
                    "KP_Dot": 190,
                    "KP_0_RB": 48,
                    "KP_9_LB": 57,
                    "KP_8_Star": 56,
                    "KP_0": 96,
                    "KP_Enter": 108,
                    "KP_Subtract": 109,
                    "KP_Dot_Right": 110,
                    "KP_Divide": 111,
                    "KP_Equal_Plus": 187,
                    "KP_Minus_Underline": 189,
                    "KP_Division_Question": 191,
                    "Chinese": 229,
                };

                var cArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '×', '+', '.', '-', '', '÷'];

                var $inputText = $("#f_inputText");

                scope.getKeyText = function(keyCode) {
                    var c = "";
                    if (keyCode >= KEYCODE.KP_0 && keyCode < KEYCODE.KP_Enter || keyCode === KEYCODE.KP_Subtract || keyCode === KEYCODE.KP_Divide) {
                        c = cArr[keyCode - KEYCODE.KP_0];
                    } else if (keyCode >= KEYCODE.KP_0_RB && keyCode <= KEYCODE.KP_9_LB && event.shiftKey === false) {
                        c = cArr[keyCode - KEYCODE.KP_0_RB];
                    } else if ((keyCode == KEYCODE.KP_Equal_Plus && event.shiftKey === true) ||
                        ((keyCode == KEYCODE.KP_Minus_Underline || keyCode == KEYCODE.KP_Division_Question) && event.shiftKey === false)) {
                        c = cArr[keyCode - 176];
                    } else if (keyCode == KEYCODE.KP_8_Star && event.shiftKey === true) {
                        c = cArr[10];
                    } else if (keyCode == KEYCODE.KP_Dot || keyCode == KEYCODE.KP_Dot_Right) {
                        c = cArr[12];
                    }
                    return c;
                };

                scope.keybaord = function(event) {
                    var keyCode = event.keyCode;
                    if (keyCode === KEYCODE.Chinese) {
                        event.preventDefault();
                        return true;
                    }
                    var startIndex = $inputText[0].selectionStart;
                    var inputText = $inputText.val();
                    var c = scope.getKeyText(keyCode);

                    if ((!$inputText.val().isFloat() && !$inputText.val().isInt() && 　$inputText.val() !== "0") && (c == '×' || c == '+' || c == '-' || c == '÷')) {
                        scope.errorModel.errorText = $filter('translate')('count.integer.format.error');
                        event.preventDefault();
                    }

                    //x小键盘支持
                    if (keyCode >= KEYCODE.KP_0 && keyCode < KEYCODE.KP_Enter || keyCode === KEYCODE.KP_Subtract || keyCode === KEYCODE.KP_Divide ||
                        keyCode >= KEYCODE.KP_0_RB && keyCode <= KEYCODE.KP_9_LB && event.shiftKey === false ||
                        (keyCode == KEYCODE.KP_Equal_Plus && event.shiftKey === true) ||
                        ((keyCode == KEYCODE.KP_Minus_Underline || keyCode == KEYCODE.KP_Division_Question) && event.shiftKey === false) ||
                        keyCode == KEYCODE.KP_8_Star && event.shiftKey === true) {} else if (keyCode == KEYCODE.KP_Dot || keyCode == KEYCODE.KP_Dot_Right) {

                    } else if (keyCode == KEYCODE.KP_BackSpace || (keyCode > KEYCODE.KP_Home && 　keyCode < KEYCODE.KP_Select)) {
                        // scope.deleteNum();
                    } else {
                        event.preventDefault();
                    }

                    if (c.length > 0) {
                        var inputObj = Utils.getInputText($inputText, c);
                        var text = inputObj.inputText;
                        if (!Utils.isInputValid(text)) {
                            scope.errorModel.errorText = $filter('translate')('count.integer.format.error');
                            event.preventDefault();
                        }
                    }
                };

                scope.pasteValid = function(e) {
                    var inputText = e.originalEvent.clipboardData.getData('text/plain');
                    if (/[0-9+×÷-]/g.test(inputText) === false) {
                        scope.errorModel.errorText = $filter('translate')('count.integer.format.error');
                        document.execCommand("insertText", false, '');
                        e.preventDefault();
                    }
                };

                scope.keyup = function(e) {
                    var inputText = $inputText.val();
                    var startIndex = $inputText[0].selectionStart,
                        endIndex = $inputText[0].selectionEnd;
                    if (/[*\/]/.test(inputText)) {
                        inputText = inputText.replace(/\*/g, '×').replace(/\//, '÷');
                        focusNewVauleByIndex(inputText, startIndex);
                    }
                    if (startIndex === endIndex && !Utils.isInputValid(inputText)) {
                        inputText = inputText.substr(0, startIndex - 1) + inputText.substr(startIndex);
                        focusNewVauleByIndex(inputText, startIndex - 1);
                    }
                    scope.inputData = inputText;
                };

                scope.$watch('inputData', function(newValue, oldValue) {
                    if (newValue === '0') {
                        scope.inputData = '';
                    }
                });

                scope.getNum = function(character) {
                    if ((!$inputText.val().isFloat() && !$inputText.val().isInt() && 　$inputText.val() !== "0") && (character == '×' || character == '+' || character == '-' || character == '÷')) {
                        return;
                    }
                    var inputObj = Utils.getInputText($inputText, character);
                    var text = inputObj.inputText;
                    if (Utils.isInputValid(text)) {
                        scope.inputData = text;
                        $inputText.val(text);
                        focusNewVauleByIndex(text, inputObj.startIndex + 1);
                    }
                    if (text) {
                        scope.keyup();
                    }
                };

                //退格删除
                scope.deleteNum = function() {
                    var inputText = scope.inputData;
                    if (inputText.length === $inputText[0].selectionStart) {
                        var text = inputText.replace(/.$/, '');
                        scope.inputData = text;
                        $inputText.val(text);
                    } else {
                        var startIndex = $inputText[0].selectionStart,
                            endIndex = $inputText[0].selectionEnd;
                        if (startIndex < endIndex) {
                            inputText = inputText.substr(0, startIndex) + inputText.substr(endIndex);
                        } else {
                            var str = inputText.substr(0, startIndex - 1) + inputText.substr(startIndex);
                            inputText = str;
                            startIndex--;
                        }
                        focusNewVauleByIndex(inputText, startIndex);
                        scope.inputData = inputText;
                    }
                }

                function focusNewVauleByIndex(value, Index) {
                    $inputText.val(value);
                    $inputText[0].focus();
                    $inputText[0].setSelectionRange(Index, Index);
                }
            }
        };
    }])

});