define([
    'angularAMD', "mathjs"
], function(angularAMD, math) {
    'use strict';
    angularAMD.service("Algorithm", ["ArithmeticUtils", function(Utils) {
        var AlgorithmCommand = (function() {
            var numItem = {
                "number_first": {
                    "number": "",
                    "symbol": { "symbol": "+", "hide": false },
                    "items": []
                },
                "number_second": {
                    "number": "",
                    "symbol": { "symbol": "+", "hide": false },
                    "items": []
                },
                "number_result": {
                    "number": "",
                    "symbol": { "symbol": "+", "hide": false },
                    "items": []
                },
                operator: { "operator": "", "hide": false },
                procedure: []
            };


            var obj = {};
            obj.a = 0;
            obj.b = 0;
            obj.operator = "";
            obj.c = 0;
            obj.item = {};
            obj.getActionName = function(symbol) {
                if (symbol == "+") return "add";
                else if (symbol == "-") return "sub";
                else if (symbol == "×") return "mul";
                else return "div";
            }
            obj.action = {
                base: function() {
                    obj.item = numItem;
                    obj.item.operator.operator = obj.operator;

                    obj.item.number_first.number = obj.a;
                    Utils.wrapNumItems(obj.a, obj.item.number_first.items);


                    obj.item.number_second.number = obj.b;
                    Utils.wrapNumItems(obj.b, obj.item.number_second.items);

                    obj.c = Utils.getResult(obj.a, obj.b, obj.operator).toString();

                    obj.item.number_result.number = obj.c;
                    Utils.wrapNumItems(obj.c, obj.item.number_result.items);
                    //obj.c = obj.c.sliceString();

                    var offset = Utils.getOffset(obj.a, obj.b, obj.c, obj.operator);
                    obj.item.number_first.offset = offset.first;
                    obj.item.number_second.offset = offset.second;
                    obj.item.number_result.offset = offset.result
                },
                baseDiv: function() {
                    obj.item = numItem;
                    obj.item.operator.operator = obj.operator;

                    obj.item.number_first.number = obj.a;
                    Utils.wrapNumItems(obj.a, obj.item.number_first.items);


                    obj.item.number_second.number = obj.b;
                    Utils.wrapNumItems(obj.b, obj.item.number_second.items);

                    obj.c = Utils.getResult(obj.a, obj.b, obj.operator).toString();

                    obj.c = obj.c.sliceString();
                    obj.item.number_result.number = obj.c;
                    Utils.wrapNumItems(obj.c, obj.item.number_result.items);


                    var offset = Utils.getOffset(obj.a, obj.b, obj.c, obj.operator);
                    obj.item.number_first.offset = offset.first;
                    obj.item.number_second.offset = offset.second;
                    obj.item.number_result.offset = offset.result;
                },
                //加
                add: function() {
                    obj.action.base();
                    return obj.item;
                },
                //减
                sub: function() {
                    obj.action.base();
                    return obj.item;
                },
                //乘
                mul: function() {
                    obj.action.base();
                    var result;
                    var k = obj.b.length - 1;
                    for (var i = obj.b.length - 1, j = 0; i >= 0; i--) {
                        if (obj.b[i] == ".") { continue; }
                        result = math.fraction(obj.b[i]).mul(obj.a.replace(".", "")).valueOf();
                        if (result === 0) {
                            k--;
                            continue;
                        }
                        obj.item.procedure[j] = {}
                        obj.item.procedure[j].items = [];
                        Utils.wrapNumItems(result + '', obj.item.procedure[j].items);
                        obj.item.procedure[j].number = result;
                        obj.item.procedure[j].offset = obj.b.length - k - 1;
                        j++;
                        k--;
                    }
                    if (obj.item.procedure.length == 1) {
                        delete obj.item.procedure;
                        obj.item.procedure = [];
                    }
                    return obj.item;
                },
                //除
                div: function() {
                    var pows = Utils.getPowArr();
                    var fractionLength = Utils.getFractionLength(obj.b.toString());
                    var b = math.fraction(obj.b).mul(pows[fractionLength]).toString();
                    var a = math.fraction(obj.a).mul(pows[fractionLength]).toString();

                    var number_result = obj._getResultNumber(obj.a.toString(), obj.b.toString(), obj.operator);
                    obj.c = number_result.number;
                    var number_first = obj._getFirstNumber(obj.a, a, obj.operator);
                    var number_second = obj._getSecondNumber(obj.b, obj.operator);

                    var procedure = obj._getProcedure(obj.a.replace(".", ""), obj.b.replace(".", ""), number_result.number.replace(".", ""), obj.operator);
                    var remainder = obj._getRemainder(obj.a.replace(".", ""), obj.b.replace(".", ""), number_result.number.replace(".", ""), obj.operator);
                    var operator = obj._getOperator(obj.operator);

                    obj.item.number_first = number_first;
                    obj.item.number_second = number_second;
                    obj.item.number_result = number_result;
                    obj.item.operator = operator;
                    obj.item.procedure = procedure;
                    obj.item.remainder = remainder;

                    return obj.item;
                }
            };
            obj._getOperator = function(operator) {
                var item = { operator: operator, hide: false };
                return item;
            };
            obj._getFirstNumber = function(number, wrapNumber, operator) {
                var item = { items: [], number: number, offset: 0, symbol: { hide: false, symbol: operator } };
                Utils.wrapNumItems(item.number, item.items);

                var item1 = { items: [], number: wrapNumber, offset: 0, symbol: { hide: false, symbol: operator } };
                Utils.wrapNumItems(item1.number, item1.items);

                var result = [];
                if (parseFloat(number) < 1) {
                    result = Utils.wrapDivisorItemLessOne(item.items, item1.items);
                } else {
                    result = Utils.wrapDivisorItem(item.items, item1.items);
                }
                item.items = result;
                return item;
            };
            obj._getSecondNumber = function(number, operator) {
                var item = { items: [], number: number, offset: 0, symbol: { hide: false, symbol: operator } };
                Utils.wrapNumItems(item.number, item.items);
                Utils.wrapByDivisorItem(item.items);
                return item;
            };
            obj._getResultNumber = function(firstNumber, secondNumber, operator) {
                var resultNumber = Utils.getResult(firstNumber, secondNumber, operator).toString();
                resultNumber = resultNumber.sliceString();
                var item = { items: [], number: resultNumber, offset: 0, symbol: { hide: false, symbol: operator } };
                Utils.wrapNumItems(item.number, item.items);
                return item;
            };

            obj._getProcedure = function(firstNumber, secondNumber, resultNumber, operator) {
                var procedures = [],
                    procedureNum1 = Utils.getProcedureNum1(firstNumber, secondNumber, resultNumber);

                var resultOffset = Utils.getResutOffset(firstNumber, secondNumber, resultNumber);
                resultNumber = Utils.wrapResultNumber(resultOffset, resultNumber);
                for (var i = 0, m = 0; i < resultNumber.length; i++) {
                    var procedure1 = { items: [], number: "", offset: 0, tempOffset: 0 };
                    var procedure2 = { items: [], number: "", offset: 0, tempOffset: 0 };
                    var character = resultNumber[i];
                    var procedureNum2 = parseInt(character) * parseInt(secondNumber);
                    if (procedureNum2 === 0) {
                        continue;
                    }

                    if (m !== 0) {
                        procedureNum1 = Utils.getProcedureNum(firstNumber, secondNumber, resultNumber, i);
                        procedure1.number = procedureNum1;
                        procedure1.offset = i - procedureNum1.toString().length + 1;
                        Utils.wrapNumItems(procedure1.number + '', procedure1.items);
                        procedures.push(procedure1);
                    }
                    procedure2.number = procedureNum2;
                    procedure2.offset = i - procedureNum2.toString().length + 1;
                    Utils.wrapNumItems(procedure2.number + '', procedure2.items);
                    procedures.push(procedure2);
                    m++;
                }
                return procedures;
            };
            obj._getRemainder = function(firstNumber, secondNumber, resultNumber, operator) {
                var procedureNum1 = Utils.getProcedureNum(firstNumber, secondNumber, resultNumber, resultNumber.length - 1);
                var procedureNum2 = parseInt(resultNumber.substr(resultNumber.length - 1, 1)) * parseInt(secondNumber);
                var resultOffset = Utils.getResutOffset(firstNumber, secondNumber, resultNumber);
                resultNumber = Utils.wrapResultNumber(resultOffset, resultNumber);
                var item = { items: [], number: "", offset: 0 };
                item.number = parseInt(procedureNum1) - parseInt(procedureNum2);
                Utils.wrapNumItems(item.number + '', item.items);
                var index = Utils.getResultAfterNotZeroIndex(resultNumber);
                item.offset = { left_blank: index - item.number.toString().length, right_blank: 0 };
                return item;
            };

            obj.excute = function(msg) {
                if (msg != null) {
                    var actionName = this.getActionName(msg.param.operator)
                    this.a = msg.param.firstNumber;
                    this.b = msg.param.secondNumber;
                    this.operator = msg.param.operator;
                    msg.param = Object.prototype.toString.call(msg.param) === "[object Array]" ? msg.param : [msg.param];
                    return obj.action[actionName].apply(actionName, msg.param);
                }
            }
            return obj;
        })

        var data = {
            "number_first": {},
            "number_second": {},
            "number_result": {},
            "operator": {},
            "procedure": [],
            "originNum": ""
        }
        var algorithm = {};
        algorithm.data = data;
        algorithm.getItem = function(command, param) {
            var algorithmCommand = new AlgorithmCommand();
            var item = algorithmCommand.excute({ "command": command, "param": param });
            return item;
        }

        return algorithm;
    }]);
});