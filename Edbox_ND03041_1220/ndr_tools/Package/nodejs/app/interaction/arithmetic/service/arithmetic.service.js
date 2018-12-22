define([
    'angularAMD', "mathjs", 'arithmetic/service/algorithm.service'
], function(angularAMD, math) {
    'use strict';
    angularAMD.service("ArithmeticService", ["skin_service", "CustomEditorService", "$stateParams", '$rootScope', '$filter', "$timeout", "ArithmeticUtils", "Algorithm",

        function(skin_service, customEditorService, $stateParams, $rootScope, $filter, $timeout, Utils, Algorithm) {

            var defaultTitleSetting = { isCleared: false, title: $filter('translate')('count.default.title') };

            var model = {
                "id": "",
                "title": defaultTitleSetting.title,
                "skin": {
                    code: "wood",
                    css_url: "${ref-path}/edu/esp/preparecustomeditor/arithmetic/wood/css/wood.css",
                    name: $filter('translate')('linkup.muwen'),
                    package_url: "${ref-path}/edu/esp/preparecustomeditor/arithmetic/wood"
                },
                "timer": {
                    "timer_type": "sequence", //计时器类型: ["sequence", "countdown"]
                    "time_minute": "0", //倒计时初始设置-分钟，timer_type="countdown"时有效
                    "time_second": "0" //倒计时初始设置-秒，timer_type="countdown"时有效
                },
                "prompt": {
                    "number_first": { // 计算数
                        "number": 23, // 完整计算数字
                        "symbol": { "symbol": "-", "hide": false }, //正负
                        "items": [{
                            "num": 2, // 位数数字
                            "hide": true | false, // 是否隐藏设置为填空项
                            "index": 1 //序号
                        }, {
                            "num": 3,
                            "hide": true | false,
                            "index": 1
                        }]
                    },
                    "number_second": { // 计算数
                        "number": 23,
                        "symbol": { "symbol": "-", "hide": false },
                        "items": [{
                            "num": 2,
                            "hide": true | false,
                            "index": 1
                        }, {
                            "num": 3,
                            "hide": true | false,
                            "index": 1
                        }]
                    },
                    "number_result": { // 结果
                        "number": 23,
                        "symbol": { "symbol": "-", "hide": false },
                        "items": [{
                            "num": 2,
                            "hide": true | false,
                            "index": 1
                        }, {
                            "num": 3,
                            "hide": true | false,
                            "index": 1
                        }]
                    },
                    "operator": { "operator": "+", "hide": true | false }, //计算符
                    "procedure": [{ // 计算过程
                        "offset": 2,
                        "number": [
                            { "num": 2, "hide": false, "index": 1 },
                            { "num": 3, "hide": false, "index": 1 },
                        ]
                    }],
                    "remainder": [ //余数
                        { "num": 2, "hide": false, "index": 1 },
                        { "num": 3, "hide": false, "index": 1 },
                    ]
                }
            };

            var count = {
                placeholder: { title: "请输入标题" },
                inputValue: '',
                flag: true,
                calError: false
            };

            var errorModel = { errorText: "" };

            var calNum = { originNum: "" };
            var tmpCalNum = {
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

            var data = { model: model, errorModel: errorModel, count: count, calNum: calNum, defaultTitleSetting: defaultTitleSetting };

            var formulaErrorTip = $filter('translate')('count.formula.error');

            var service = {};
            service.scope = null;

            //初始化数据 
            service.initData = function() {
                var self = this;

                if (!$stateParams.id) {
                    skin_service.set_skin_by_code(service.scope.model.skin.code, "v1");
                } else {
                    customEditorService.getQuestionInfoById($stateParams.id)
                        .then(function(rtnData) {
                            if (!rtnData) {
                                service.scope.errorModel.errorText = $filter('translate')('count.unvalidno');
                            } else {
                                if (rtnData.skin.code != '') {
                                    angular.extend(service.scope.model, service.decodeModel(rtnData));
                                    service.scope.calNum = service.scope.model.prompt;
                                    service.scope.calNum.screen = "";
                                    // service.scope.calNum.screen += service.scope.calNum.number_first.items.joinArrayItem();
                                    // service.scope.calNum.screen += service.scope.calNum.operator.operator;
                                    // service.scope.calNum.screen += service.scope.calNum.number_second.items.joinArrayItem();
                                    service.scope.calNum.screen += service.scope.calNum.number_first.number;
                                    service.scope.calNum.screen += service.scope.calNum.operator.operator;
                                    service.scope.calNum.screen += service.scope.calNum.number_second.number;

                                    service.scope.calNum.originNum = service.scope.calNum.screen;
                                    service.scope.count.inputValue = service.scope.calNum.screen;
                                } else {
                                    service.scope.model.id = rtnData.id;
                                }
                                service.scope.errorModel.errorText = "";
                                skin_service.set_skin_by_code(service.scope.model.skin.code, "v1");
                            }
                        }, function() {
                            service.scope.errorModel.errorText = $filter('translate')('count.get_title_error');
                        })
                }
            };
            //初始化
            service.init = function(scope) {
                angular.extend(scope, data);
                this.scope = scope;
                this.initData();
            };
            //上一步
            service.previousStep = function() {
                service.scope.count.flag = true;
            };
            //下一步
            service.nextStep = function() {
                var input = $("#f_inputText").val().trim();

                if (!Utils.isExpressValid(input)) {
                    service.scope.errorModel.errorText = formulaErrorTip;
                    return;
                }
                var inputObj = Utils.parseInputText(input);
                var firstNum, secondNum, resultNum;
                firstNum = inputObj.firstNumber;
                secondNum = inputObj.secondNumber;
                if ((!firstNum.isInt() && !firstNum.isFloat()) || (!secondNum.isInt() && !secondNum.isFloat())) {
                    service.scope.errorModel.errorText = formulaErrorTip;
                    return;
                }

                // if (parseFloat(firstNum) == 0 && parseFloat(secondNum) == 0) {
                //     service.scope.errorModel.errorText = $filter('translate')('count.zero.error');
                //     return;
                // }
                var operator = inputObj.operator;

                if (operator === "÷" && parseFloat(secondNum) === 0) {
                    service.scope.errorModel.errorText = $filter('translate')('count.zero.divide.error');
                    return;
                }

                resultNum = Utils.getResult(firstNum, secondNum, operator).toString();
                if (resultNum < 0) {
                    service.scope.errorModel.errorText = $filter('translate')('count.negative.error');
                    return;
                }
                // if (parseFloat(resultNum) < 0.0001) {
                //     service.scope.errorModel.errorText = $filter('translate')('count.small.error');
                //     return;
                // }

                if (operator === "÷" && parseInt(resultNum) === 0) {
                    service.scope.errorModel.errorText = $filter('translate')('count.divide.error');
                    return;
                }
                var item = Algorithm.getItem(inputObj.operator, inputObj);

                service.scope.calNum = item;
                service.scope.count.flag = false;
            };

            //验证数据
            service.validData = function() {
                var modelData = service.scope.model;
                if ($.trim(modelData.title) == '') {
                    service.scope.errorModel.errorText = $filter('translate')('count.notnull.title');
                    return false;
                }
                if (service.scope.count.flag === true) {
                    service.scope.errorModel.errorText = $filter('translate')('count.next.step');
                    return false;
                }

                var allItems = [].concat(service.scope.calNum.number_first.items).concat(service.scope.calNum.number_second.items).concat(service.scope.calNum.number_result.items);
                for (var i = 0, l = service.scope.calNum.procedure.length; i < l; i++) {
                    allItems = allItems.concat(service.scope.calNum.procedure[i].items);
                }
                if (service.scope.calNum.operator.operator === '÷') {
                    allItems = allItems.concat(service.scope.calNum.remainder.items);
                }
                var flag = false;
                for (var i = 0, l = allItems.length; i < l; i++) {
                    if (allItems[i].hide === true) {
                        flag = true;
                        break;
                    }
                }
                if (flag === false) {
                    service.scope.errorModel.errorText = $filter('translate')('count.no_content');
                    return false;
                }

                return true;
            };

            //encode model
            service.encodeModel = function(model) {
                var newModel = angular.copy(model);
                newModel.title = window.customHtmlEncode(newModel.title); //修复PMS-55657
                newModel.prompt = service.scope.calNum;
                newModel.originNum = '';

                if (newModel.prompt.operator.operator === '×') {
                    newModel.prompt.operator.operator = '*';
                } else if (newModel.prompt.operator.operator === '÷') {
                    newModel.prompt.operator.operator = '/';
                }

                return newModel;
            };
            //decode model
            service.decodeModel = function(model) {
                var newModel = angular.copy(model);
                newModel.title = window.customHtmlDecode(newModel.title); //修复PMS-55657

                if (newModel.prompt.operator.operator === '*') {
                    newModel.prompt.operator.operator = '×';
                } else if (newModel.prompt.operator.operator === '/') {
                    newModel.prompt.operator.operator = '÷';
                }
                service.scope.calNum = newModel.prompt;
                var procedure = service.scope.calNum.procedure;
                var fl = service.scope.calNum.number_first.number.toString().length;
                for (var i = 0, l = procedure.length; i < l; i++) {
                    procedure[i].tempOffset = fl - procedure[i].items.length - procedure[i].offset;
                }
                return newModel;
            };

            return service;
        }
    ]);
});