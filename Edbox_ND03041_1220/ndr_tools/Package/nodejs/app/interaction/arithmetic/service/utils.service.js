define([
    'angularAMD', "mathjs"
], function(angularAMD, math) {
    'use strict';

    angularAMD.service("ArithmeticUtils", ['$rootScope',
        function($rootScope) {
            var regx = {
                symbol: /[+-×÷]/,
                symbol_dot: /[+-×÷.]/,
                int: /^[1-9][0-9]{0,4}$/,
                int_uncomplete: /^[1-9][0-9]{0,3}$/,
                float: /(^[1-9][0-9]{0,3}[\.]{1}[0-9]{1,4}$)|(^[0][\.][0-9]{1,4}$)/,
                float_uncomplete: /(^[1-9][0-9]{0,3}[\.]{1}[0-9]{0,4}$)|(^[0][\.][0-9]{0,4}$)/
            }

            //是否是不大于5位的整数
            String.prototype.isInt = function() {
                return regx.int.test(this);
            };
            //是否是不大于4位的整数
            String.prototype.isIntUncomplete = function() {
                return regx.int_uncomplete.test(this);
            };
            //是否是含小数点不大于6位的小数
            String.prototype.isFloat = function() {
                var result = regx.float.test(this);
                if (result) {
                    if (this.length > 6) {
                        result = false;
                    }
                }
                return result;
            };
            //是否是含小数点不大于6位的小数
            String.prototype.isFloatUncomplete = function() {
                var result = regx.float_uncomplete.test(this);
                if (result) {
                    if (this.length > 6) {
                        result = false;
                    }
                }
                return result;
            };
            //数组split symbol
            String.prototype.arrayBySymbol = function() {
                var symbol = "+-×÷";
                var list = [];
                for (var i = 0; i < symbol.length; i++) {
                    list = this.split(symbol[i]);
                    if (list.length > 1) {
                        return list;
                    }
                }
                return list;
            };

            Array.prototype.joinArrayItem = function() {
                var arr = [];
                for (var i = 0, l = this.length; i < l; i++) {
                    if (this[i].num == "." && !this.dot_show) { continue; }
                    arr[i] = this[i].num;
                }
                return arr.join('');
            };
            //是否包含多个symbol
            String.prototype.isContainsSymbols = function() {
                var symbol = "+-×÷";
                var result = false;
                var count = 0;
                for (var i = 0; i < symbol.length; i++) {
                    var index = this.indexOf(symbol[i]);
                    if (index > -1) {
                        count++;
                    }
                    var lastIndex = this.lastIndexOf(symbol[i]);
                    if (index != lastIndex) {
                        count++;
                    }
                }
                if (count > 1) { result = true } else { result = false; }
                return result;
            };
            //根据表达式获取符号
            String.prototype.getSymbol = function() {
                var symbol = "+-×÷";
                for (var i = 0; i < symbol.length; i++) {
                    var index = this.indexOf(symbol[i]);
                    if (index > -1) {
                        return symbol[i];
                    }
                }
                return "";
            };


            String.prototype.sliceString = function() {
                var self = this;
                var result = self;
                if (self.indexOf(".") > -1) {
                    if (self.split(".")[1].length > 4) {
                        result = self.split(".")[0] + "." + self.split(".")[1].substr(0, 4);
                    }
                }
                return result;
            };

            var Utils = {
                getPowArr: function() {
                    var powArr = [];
                    var mark = 0;
                    for (var i = 0; i < 10; i++) {
                        powArr.push(Math.pow(10, i));
                    }
                    return powArr;
                },
                //文本补几个0
                setTextZero: function(text, num) {
                    var result = text;
                    for (var i = 0; i < num; i++) {
                        result += "0";
                    }
                    return result;
                },
                wrapNumItems: function(strNum, numArr) {
                    this.wrapIntItems(strNum, numArr);
                    this.wrapDotItems(strNum, numArr);
                },
                wrapIntItems: function(strNum, numArr) {
                    var intNum = strNum.split(".")[0];
                    for (var i = 0, l = intNum.length; i < l; i++) {
                        var character = strNum.charAt(i);
                        var tmpDot = {};
                        tmpDot = { index: Math.pow(10, l - i) + 1, num: ".", "hide": false, "dot_show": false, "dashed": false }
                        numArr.push(tmpDot);

                        var tempNum = {};
                        tempNum = { index: Math.pow(10, l - i), num: character, "hide": false, "dot_show": false, "dashed": false }
                        numArr.push(tempNum);
                    }

                    var dotNum = strNum.split(".").length > 1 ? strNum.split(".")[1] : "";
                    for (var i = 0, l = dotNum.length; i < l; i++) {
                        var character = dotNum.charAt(i);
                        var tmpDot = {};
                        tmpDot = { index: -(Math.pow(10, i + 1) + 1), num: ".", "hide": false, "dot_show": false, "dashed": false }
                        numArr.push(tmpDot);

                        var tempNum = {};
                        tempNum = { index: -Math.pow(10, i + 1), num: character, "hide": false, "dot_show": false, "dashed": false }
                        numArr.push(tempNum);
                    }
                },
                wrapDotItems: function(strNum, numArr) {
                    for (var i = 0, l = strNum.length; i < l; i++) {
                        var character = strNum.charAt(i);
                        if (character == ".") {
                            numArr[i * 2].dot_show = true;
                        }
                    }
                },
                wrapByDivisorItem: function(numArr) {
                    for (var i = 0; i < numArr.length; i++) {
                        var numItem = numArr[i];
                        if (numItem.num == "." && numItem.dot_show) {
                            numItem.dashed = true;
                        }
                    }
                },
                getDivisorItemLessOneIndex: function(origArr, wrapArr) {
                    var origIndex = 0,
                        wrapIndex = 0,
                        endIndex = 0,
                        firstMatch = false;
                    for (var i = 0; i < origArr.length; i++) {
                        if (i % 2 == 1) {
                            var origItem = origArr[i];
                            for (var j = 0; j < wrapArr.length; j++) {
                                if (j % 2 == 1) {
                                    var wrapItem = wrapArr[j];
                                    if (origItem.num == wrapItem.num && parseInt(wrapItem.num) > 0 && parseInt(origItem.num) > 0) {
                                        origIndex = i;
                                        wrapIndex = j;
                                        firstMatch = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (firstMatch) { break; }
                    }

                    var origLength = origArr.length - origIndex + 1,
                        wrapLength = wrapArr.length - wrapIndex + 1;
                    for (var i = 0; i < wrapArr.length; i++) {
                        if (i == origLength - 1) {
                            endIndex = i;
                            break;
                        }
                    }

                    return { orig: origIndex, wrap: wrapIndex, end: endIndex };
                },
                wrapDivisorItemLessOne: function(origArr, wrapArr) {
                    var result = [];
                    var divisorIndex = this.getDivisorItemLessOneIndex(origArr, wrapArr);

                    //补0
                    for (var i = divisorIndex.end; i < wrapArr.length; i++) {
                        var wrapItem = wrapArr[i];
                        if (i % 2 == 1 && wrapItem.num == "0") {
                            wrapItem.dashed = true;
                        }
                    }

                    var origArr_new = origArr.slice(0, divisorIndex.orig);
                    var wrapArr_new = wrapArr.slice(divisorIndex.wrap, wrapArr.length);

                    //去掉小数点
                    for (var i = 0; i < origArr_new.length; i++) {
                        var origItem = origArr_new[i];
                        if (origItem.num == "." && i !== 0) {
                            origItem.dashed = true;
                            break;
                        }
                    }

                    //移位小数点
                    for (var i = divisorIndex.end; i < wrapArr_new.length; i++) {
                        var wrapItem = wrapArr_new[i];
                        if (wrapItem.num == "0" && i !== 0) {
                            wrapItem.dashed = true;
                        }
                    }

                    result = origArr_new.concat(wrapArr_new);

                    return result;
                },
                wrapDivisorItem: function(origArr, wrapArr) {
                    var origIndex = 0,
                        wrapIndex = 0;
                    var result = origArr;
                    for (var i = 0; i < wrapArr.length; i++) {
                        var warpNumItem = wrapArr[i];
                        if (i > result.length - 1) {
                            if (warpNumItem.num == ".") {
                                warpNumItem.dashed = false;
                            } else {
                                warpNumItem.dashed = true;
                            }
                            result.push(warpNumItem);
                        }
                        var numItem = result[i];
                        if (numItem.num == warpNumItem.num && numItem.num == "." && numItem.dot_show != warpNumItem.dot_show) {
                            if (numItem.dot_show == true) {
                                numItem.dashed = true;
                                numItem.dot_show = true;
                            } else {
                                numItem.dashed = false;
                                numItem.dot_show = true;
                            }
                        }
                    }

                    return result;
                },
                getFrontZeroLength: function(text) {
                    var length = 0;
                    for (var i = 0; i < text.length; i++) {
                        if (text[i] == ".") continue;
                        if (text[i] == "0") {
                            length++;
                        } else {
                            break;
                        }
                    }
                    return length;
                },
                getFractionLength: function(text) {
                    var len = text.indexOf(".") > -1 ? text.split('.')[1].length : 0;
                    return len;
                },
                getProcedureNum: function(firstNum, secondNum, resultNum, index) {
                    var pows = Utils.getPowArr();
                    var sub2 = parseInt(resultNum.substr(0, index + 1)) * parseInt(secondNum);

                    var m = 1;
                    var k = 1;
                    var tmp = parseInt(firstNum.substr(0, m)) - parseInt(sub2);
                    while (tmp < 0) {
                        m++;
                        if (m > firstNum.length) {
                            tmp = parseInt(firstNum.substr(0, firstNum.length)) * pows[k] - parseInt(sub2);
                            k++;
                        } else {
                            tmp = parseInt(firstNum.substr(0, m)) - parseInt(sub2);
                        }

                    }
                    var sub1 = tmp + parseInt(resultNum.substr(index, 1)) * parseInt(secondNum);

                    return sub1.toString();
                },
                getProcedureNum1: function(firstNum, secondNum, resultNum) {
                    var result = "";
                    var procedureNum1 = "";
                    for (var i = 0; i < resultNum.length; i++) {
                        var character = resultNum[i];
                        var procedureNum2 = parseInt(character) * parseInt(secondNum);
                        if (procedureNum2 === 0) { continue; }
                        procedureNum1 = Utils.getProcedureNum(firstNum, secondNum, resultNum, i);
                        break;
                    }

                    for (var j = 0; j < firstNum.length; j++) {
                        var item = firstNum.substr(0, j + 1);
                        var num = parseInt(item) - parseInt(procedureNum1);
                        if (num < 0) {
                            firstNum = firstNum + "0";
                        } else {
                            result = item;
                            break;
                        }
                    }

                    return result;
                },
                getResultFrontZeroCount: function(resultNum) {
                    var zeros = [];
                    for (var i = 0; i < resultNum.length; i++) {
                        var character = resultNum[i];
                        if (character !== "0") { break; }
                        zeros.push({ index: i });
                    }
                    return zeros.length;
                },
                getResultAfterNotZeroIndex: function(resultNum) {
                    var index = 0;
                    for (var i = resultNum.length; i > 0; i--) {
                        var character = resultNum[i - 1];
                        if (character !== "0") {
                            index = i;
                            break;
                        }
                    }
                    return index;
                },
                getResutOffset: function(firstNumber, secondNumber, resultNumber) {
                    var virZero = this.getResultFrontZeroByFristNumber(firstNumber, secondNumber);
                    var realZero = this.getResultFrontZeroCount(resultNumber);
                    var offset = virZero - realZero;
                    return offset;
                },
                wrapResultNumber: function(offset, resultNumber) {
                    var zeroStr = "";
                    for (var i = 0; i < offset; i++) {
                        zeroStr += "0";
                    }
                    return zeroStr + resultNumber.toString();
                },
                getResultFrontZeroByFristNumber: function(firstNumber, secondNumber) {
                    var zero = 0;
                    for (var i = 0; i < firstNumber.length; i++) {
                        var item = firstNumber.substr(0, i + 1);
                        var num = parseInt(item) - parseInt(secondNumber);
                        if (num < 0) {
                            zero++;
                        } else {
                            break;
                        }
                        if (item.length == firstNumber.length) {
                            firstNumber += "0";
                        }
                    }
                    return zero;
                },
                getOffset: function(firstNum, secondNum, resultNum, operator) {
                    var firstNum_dotLength = firstNum.split(".").length > 1 ? firstNum.split(".")[1].length : 0;
                    var secondNum_dotLength = secondNum.split(".").length > 1 ? secondNum.split(".")[1].length : 0;
                    var resultNum_dotLength = resultNum.split(".").length > 1 ? resultNum.split(".")[1].length : 0;

                    var firstNum_Length = firstNum.split(".")[0].length;
                    var secondNum_Length = secondNum.split(".")[0].length;
                    var resultNum_Length = resultNum.split(".")[0].length;

                    var maxLength_left = 0;
                    var maxLength_right = 0;

                    maxLength_left = firstNum_Length > maxLength_left ? firstNum_Length : maxLength_left;
                    maxLength_left = secondNum_Length > maxLength_left ? secondNum_Length : maxLength_left;
                    maxLength_left = resultNum_Length > maxLength_left ? resultNum_Length : maxLength_left;

                    maxLength_right = firstNum_dotLength > maxLength_right ? firstNum_dotLength : maxLength_right;
                    maxLength_right = secondNum_dotLength > maxLength_right ? secondNum_dotLength : maxLength_right;
                    maxLength_right = resultNum_dotLength > maxLength_right ? resultNum_dotLength : maxLength_right;
                    if (operator == "multiply") {
                        return {
                            first: {
                                left_blank: maxLength_right - resultNum_dotLength,
                                right_blank: 0,
                            },
                            second: {
                                left_blank: maxLength_right - resultNum_dotLength,
                                right_blank: 0,
                            },
                            result: {
                                left_blank: 0,
                                right_blank: 0
                            }
                        };
                    } else if (operator == "divide") {
                        return {
                            first: {
                                left_blank: 0,
                                right_blank: 0,
                            },
                            second: {
                                left_blank: 0,
                                right_blank: 0,
                            },
                            result: {
                                left_blank: 0,
                                right_blank: 0
                            }
                        };

                    } else {
                        return {
                            first: {
                                left_blank: maxLength_left - firstNum_Length,
                                right_blank: maxLength_right - firstNum_dotLength
                            },
                            second: {
                                left_blank: maxLength_left - secondNum_Length,
                                right_blank: maxLength_right - secondNum_dotLength,
                            },
                            result: {
                                left_blank: maxLength_left - resultNum_Length,
                                right_blank: maxLength_right - resultNum_dotLength
                            }

                        };
                    }

                },
                getLoopResult: function(text) {
                    var result = "";
                    var loopStart = text.indexOf("(");
                    var loopEnd = text.indexOf(")");
                    if (loopStart > -1 && loopEnd > -1) {
                        var loopText = text.substr(loopStart + 1, loopEnd - loopStart - 1);
                        result = text.substr(0, loopStart);
                        for (var i = 0; i < 5; i++) {
                            result += loopText;
                        }
                    } else {
                        result = text;
                    }
                    return result;
                },

                getDealedResult: function(n1, n2, c) {
                    var aFractionLength = this.getFractionLength(n1.toString());
                    var bFractionLength = this.getFractionLength(n2.toString());
                    var cFractionLength = this.getFractionLength(c.toString());

                    var maxLength = 0;
                    maxLength = aFractionLength > maxLength ? aFractionLength : maxLength;
                    maxLength = bFractionLength > maxLength ? bFractionLength : maxLength;
                    var cArr = c.split(".");
                    var cEnd = "";
                    if (cFractionLength < maxLength) {
                        for (var i = 0; i < maxLength - cFractionLength; i++) {
                            cEnd += "0";
                        }
                    }
                    if (maxLength > 0) {
                        return cArr.length > 1 ? cArr[0] + "." + cArr[1] + cEnd : cArr[0] + "." + cEnd;
                    } else {
                        return cArr[0];
                    }
                },
                getResult: function(n1, n2, oper) {
                    if (oper === '+') {
                        var c = this.getLoopResult(math.fraction(n1).add(n2).toString());
                        return this.getDealedResult(n1, n2, c);

                    } else if (oper === '-') {
                        var c = this.getLoopResult(math.fraction(n1).sub(n2).toString());
                        return this.getDealedResult(n1, n2, c);
                    } else if (oper === '×') {
                        return this.getLoopResult(math.fraction(n1).mul(n2).toString());
                    } else if (oper === '÷') {
                        return this.getLoopResult(math.fraction(n1).div(n2).toString());
                    }
                },
                getInputText: function($inputText, character) {
                    var inputText = $inputText.val();
                    var startIndex = $inputText[0].selectionStart,
                        endIndex = $inputText[0].selectionEnd;
                    inputText = inputText.substr(0, startIndex) + character + inputText.substr(endIndex, inputText.length);
                    return {
                        inputText: inputText,
                        startIndex: startIndex,
                        endIndex: endIndex
                    };
                },
                parseInputText: function(inputText) {
                    var textLength = inputText.length;
                    var list = inputText.arrayBySymbol();
                    var firstNumber = list[0];
                    var secondNumber = list[1];
                    var operator = inputText.getSymbol();
                    return {
                        firstNumber: firstNumber,
                        secondNumber: secondNumber,
                        operator: operator
                    }
                },
                isInputValid: function(inputText) {
                    var textLength = inputText.length;
                    if (inputText.isContainsSymbols()) {
                        return false;
                    }

                    var list = inputText.arrayBySymbol();
                    var firstNumber = list[0];
                    var secondNumber = "";
                    if (list.length > 1) {
                        secondNumber = list[1];
                    }

                    if (!firstNumber.isInt() && firstNumber !== "0" && !firstNumber.isFloatUncomplete()) {
                        return false;
                    }

                    if (secondNumber.length > 0) {
                        if (!secondNumber.isInt() && secondNumber !== "0" && !secondNumber.isFloatUncomplete()) {
                            return false;
                        }
                    }

                    return true;
                },
                isExpressValid: function(inputText) {
                    var text = inputText;
                    var textLength = text.length;
                    if (text.isContainsSymbols()) {
                        return false;
                    }

                    var list = text.arrayBySymbol();
                    if (list.length <= 1) {
                        return false;
                    }

                    var firstNumber = "";
                    var secondNumber = "";
                    firstNumber = list[0];
                    secondNumber = list[1];

                    if (firstNumber.isInt() || firstNumber.isFloat()) {
                        if (secondNumber.length > 0) {
                            if (secondNumber.isInt() || secondNumber.isFloat()) {} else {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }

                    return true;
                }
            }

            return Utils;
        }
    ]);
});