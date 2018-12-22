/**
 * Created by Administrator on 2016/1/18.
 */
(function (namespace) {
    function Stat() {
        //原始数据
        this.originalData = {};
        //转换过后的数据
        this.convertedData = {};
        //答题统计的摘要信息
        this.summary = {};
        //获取到的指定作答结果的统计信息
        this.specificalAnswerUsers = {};
    }
    Stat.prototype = {
        //统计
        init: function (orignalDataSet) {
            var deffer = $.Deferred();
            //TODO:统计过程
            if (orignalDataSet && orignalDataSet.value && orignalDataSet.value.questionType) {
                if (dataHandler[orignalDataSet.value.questionType]) {
                    dataHandler[orignalDataSet.value.questionType](orignalDataSet);
                }
            }

            //统计完成执行回调
            //initCallback(data);
            return deffer;
        },
        //获取作答统计的摘要信息
        getSummary: function () {

            /*{
             "spend_time": 3000, //作答用时,单位为秒
             "submit_count": 20, //提交人数
             "answers": [{ //详细作答情况,为一个数组,每个项目为其中项
             "item_key": "[ID]", //可以与题目中项目对应的唯一编号; 由统计和题型双方进行约定
             "percent": 0.25 //项目正确率
             }]
             }*/
            return namespace['fillStatistics'].convertedData;
        },
        //获取指定作答结果(可能是正确或错误)的统计信息
        getSpecifical: function (answer) {

            /*
             [{
             "user_id": "[User_Id1]",
             "user_name": "[User_Name]"
             },{
             "user_id": "[User_Id2]",
             "user_name": "[User_Name]"
             },{
             "user_id": "[User_Id3]",
             "user_name": "[User_Name]"
             }]*/


        },
        //获取正确答案的数据(排行榜类需要实现)
        getCorrectAnswer: function () {

        },
        //转换数据，得到需要的数据
        convertData: function (originalData) {
            var value = originalData.value;
            var convertedData = {};
            //题目类型
            convertedData.questionType = value.questionType;
            //用时
            convertedData.elapsedTime = value.elapsedTime;
            //已作答人数
            convertedData.finishedNum = value.finishedNum;
            //未作答人数
            convertedData.unfinishedNum = value.unfinishedNum;
            //总人数
            convertedData.totalNum = value.unfinishedNum + value.finishedNum;

        },
        //释放统计过程中使用的内存对象
        dispose: function () {

        }
    };

    var isType = function (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        };
    };
    var isObject = isType('Object');
    var isFunction = isType('Function');
    var isArray = isType('Array');
    var isString = isType('String');

    /**
     * 处理器
     * @type {{guessword}}
     */
    var dataHandler = {
        guessword: guesswordHandler,
        compare: compareHandle,
        imagemark: imagemarkHandle,
        textentry: textentryHandle,
        match: matchHandle,
        arithmetic: arithmeticHandle,
        fillblank: fillblankHandler,
        table: tableHandle,
        wordpuzzles: wordpuzzlesHandle,
        magicbox: magicboxHandle,
        classified: classifiedHandle,
        markpoint: markpointHandler
    };

    /**
     * 猜词游戏数据统计
     * @param oriData
     */
    function guesswordHandler(oriData) {
        var i, j, k, m;
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        convertedData["allrightStu"] = [];

        var answer;
        //获取正确答案并设置编号
        if (!correctAnswer && value.correctAnswerTeacher && value.correctAnswerTeacher.correct_response) {
            correctAnswer = value.correctAnswerTeacher.correct_response;
            if (correctAnswer && $.isArray(correctAnswer)) {
                for (k = 0; k < correctAnswer.length; k++) {
                    item_key.push(k + 1);
                    stuAnswerStat.push({
                        "rightNum": 0,
                        "right_userIds": [],
                        "wrong_userIds": [],
                        "unfinished_userIds": value.unfinishedUserIds,
                        "ref_key": (k + 1)
                    });
                }
            }
        }

        if (value.answers) {
            for (i = 0; i < value.answers.length; i++) {
                if ($.isArray(value.answers[i])) {
                    for (j = 0; j < value.answers[i].length; j++) {
                        answer = value.answers[i][j].answer;
                        if (answer && (typeof answer) == "string") {
                            answer = JSON.parse(answer);

                            if (correctAnswer && answer.user_response) {
                                var judgeIsCorrect = true;
                                for (k = 0; k < correctAnswer.length; k++) {
                                    if (answer.user_response[k] && correctAnswer[k] == answer.user_response[k]) {
                                        //stuAnswerStat[k]["rightNum"] = ((typeof stuAnswerStat[k]["rightNum"]) == "number") ? (stuAnswerStat[k]["rightNum"] + 1) : 1;
                                        for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                            stuAnswerStat[k]["rightNum"] = ((typeof stuAnswerStat[k]["rightNum"]) == "number") ? (stuAnswerStat[k]["rightNum"] + 1) : 1;
                                            stuAnswerStat[k]["right_userIds"].push(value.answers[i][j].userIds[m]);
                                        }
                                    } else {
                                        judgeIsCorrect = false;
                                        for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                            stuAnswerStat[k]["wrong_userIds"].push(value.answers[i][j].userIds[m]);
                                        }
                                    }
                                }
                                answer.isCorrect = judgeIsCorrect;
                                if (answer.isCorrect) {
                                    convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                                }
                            }
                        }
                    }
                }
            }
        }

        onlineNum = value.finishedNum + value.unfinishedNum;

        /**计算正确率**/
        for (i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }

    function magicboxHandle(oriData) {
        var i, j, k, m;
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        convertedData["allrightStu"] = [];

        var answer;
        if (value.answers) {
            for (i = 0; i < value.answers.length && isArray(value.answers[i]); i++) {

                if (value.answers[i].length > 0) {
                    for (j = 0; j < value.answers[i].length; j++) {
                        answer = value.answers[i][j].answer;
                        if (answer && (typeof answer) == "string") {
                            answer = JSON.parse(answer);

                            if (!correctAnswer) { //获取正确答案并设置编号
                                correctAnswer = answer.correct_response;
                                if (correctAnswer && $.isArray(correctAnswer)) {
                                    for (k = 0; k < correctAnswer.length; k++) {
                                        item_key.push(k + 1);
                                        stuAnswerStat.push({
                                            "rightNum": 0,
                                            "right_userIds": [],
                                            "wrong_userIds": [],
                                            "unfinished_userIds": value.unfinishedUserIds,
                                            "ref_key": (k + 1)
                                        });
                                    }
                                }
                            }

                            if (correctAnswer && answer.user_response && correctAnswer.length == answer.user_response.length) {
                                var judgeIsCorrect = true;
                                for (k = 0; k < correctAnswer.length; k++) {
                                    if (correctAnswer[k] == answer.user_response[k]) {

                                        for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                            stuAnswerStat[k]["rightNum"] = ((typeof stuAnswerStat[k]["rightNum"]) == "number") ? (stuAnswerStat[k]["rightNum"] + 1) : 1;
                                            stuAnswerStat[k]["right_userIds"].push(value.answers[i][j].userIds[m]);
                                        }
                                    } else {
                                        judgeIsCorrect = false;
                                        for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                            stuAnswerStat[k]["wrong_userIds"].push(value.answers[i][j].userIds[m]);
                                        }
                                    }
                                }
                                answer.isCorrect = judgeIsCorrect;
                                if (answer.isCorrect) {
                                    convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                                }
                            }
                        }
                    }
                } else {
                    $.each(value.correctAnswerTeacher.correct_response, function (k, item) {
                        if (!stuAnswerStat[k]) {
                            stuAnswerStat[k] = {
                                rightNum: 0,
                                right_userIds: [],
                                wrong_userIds: [],
                                unfinished_userIds: value.unfinishedUserIds,
                                ref_key: (k + 1)
                            };
                            item_key.push(k + 1);
                        }
                    });
                    convertedData["allrightStu"] = [];
                }
            }

        }

        onlineNum = value.finishedNum + value.unfinishedNum;

        /**计算正确率**/
        for (i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }
    /**
     * 比大小数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function compareHandle(oriData) {
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};

        convertedData["allrightStu"] = [];
        if (value.answers) {
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                if (value.answers[i].length) {
                    for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                        if (!isObject(value.answers[i][j])) {
                            break;
                        }
                        if (isString(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                        } else if (isObject(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = value.answers[i][j].answer;
                        } else {
                            break;
                        }
                        $.each(value.answers[i][j].answer.response, function (k, item) {
                            if (!stuAnswerStat[k]) {
                                stuAnswerStat[k] = {
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k + 1)
                                };
                                item_key.push(k + 1);
                            }
                            if (item.isCorrect) {
                                stuAnswerStat[k].right_userIds = stuAnswerStat[k].right_userIds.concat(value.answers[i][j].userIds);
                            } else {
                                stuAnswerStat[k].wrong_userIds = stuAnswerStat[k].wrong_userIds.concat(value.answers[i][j].userIds);
                            }
                        });
                        if (value.answers[i][j].answer.isCorrect) {
                            convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                        }
                    }
                } else {
                    $.each(value.correctAnswerTeacher.response, function (k, item) {
                        if (!stuAnswerStat[k]) {
                            stuAnswerStat[k] = {
                                rightNum: 0,
                                right_userIds: [],
                                wrong_userIds: [],
                                unfinished_userIds: value.unfinishedUserIds,
                                ref_key: (k + 1)
                            };
                            item_key.push(k + 1);
                        }
                    });
                    convertedData["allrightStu"] = [];
                }
            }
        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var ii = 0; ii < stuAnswerStat.length; ii++) {
            percent[ii] = (onlineNum > 0) ? (stuAnswerStat[ii]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }

    /**
     * 图片标签数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function imagemarkHandle(oriData) {
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        convertedData["allrightStu"] = [];
        if (value.answers) {
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                if (value.answers[i].length) {
                    for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                        if (!isObject(value.answers[i][j])) {
                            break;
                        }
                        if (isString(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                        } else if (isObject(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = value.answers[i][j].answer;
                        } else {
                            break;
                        }
                        $.each(value.answers[i][j].answer.tags, function (itemk, item) {
                            var k = item.serialNum - 1;
                            if (!stuAnswerStat[k]) {
                                stuAnswerStat[k] = {
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k + 1)
                                };
                                item_key.push(k + 1);
                            }
                            if (item.answer) {
                                stuAnswerStat[k].right_userIds = stuAnswerStat[k].right_userIds.concat(value.answers[i][j].userIds);
                            } else {
                                stuAnswerStat[k].wrong_userIds = stuAnswerStat[k].wrong_userIds.concat(value.answers[i][j].userIds);
                            }
                        });
                        if (value.answers[i][j].answer.answer) {
                            convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                        }
                    }
                } else {
                    $.each(value.correctAnswerTeacher.tags, function (itemk, item) {
                        var k = item.serialNum - 1;
                        if (!stuAnswerStat[k]) {
                            stuAnswerStat[k] = {
                                rightNum: 0,
                                right_userIds: [],
                                wrong_userIds: [],
                                unfinished_userIds: value.unfinishedUserIds,
                                ref_key: (k + 1)
                            };
                            item_key.push(k + 1);
                        }
                    });
                    convertedData["allrightStu"] = [];
                }

            }
        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var ii = 0; ii < stuAnswerStat.length; ii++) {
            percent[ii] = (onlineNum > 0) ? (stuAnswerStat[ii]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }


    /**
     * 基础题－填空题统计
     * @param oriData
     */
    function textentryHandle(oriData) {
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer = [],
                item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        convertedData["allrightStu"] = [];
        //保存填空项的索引值
        convertedData["itemIndexs"] = [];

        var model = player.getPlayerServices().getModulesByType('BasicQuestionViewer')[0].getDataQuestionAssessmentModel();
        var ii = 0;
        for (var key in model.correctAnswer) {
            correctAnswer.push(model.correctAnswer[key].value[0]);
            if (!stuAnswerStat[ii]) {
                stuAnswerStat[ii] = {
                    right_userIds: [],
                    wrong_userIds: [],
                    unfinished_userIds: value.unfinishedUserIds,
                    ref_key: (ii + 1)
                };
                item_key.push(ii + 1);
                convertedData["itemIndexs"].push({
                    'key': key,
                    'value': ii
                });
                ii++;
            }
        }

        if (value.answers) {
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                    if (!isObject(value.answers[i][j])) {
                        break;
                    }
                    if (isString(value.answers[i][j].answer)) {
                        value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                    } else if (isObject(value.answers[i][j].answer)) {
                        value.answers[i][j].answer = value.answers[i][j].answer;
                    } else {
                        break;
                    }

                    var k = 0;
                    var isAllCorrect = true;
                    for (var key in value.answers[i][j].answer) {
                        //						if (!stuAnswerStat[k]) {
                        //							stuAnswerStat[k] = {
                        //								right_userIds: [],
                        //								wrong_userIds: [],
                        //								unfinished_userIds: value.unfinishedUserIds,
                        //								ref_key: (k + 1)
                        //							};
                        //							item_key.push(k + 1);
                        //							convertedData["itemIndexs"].push({
                        //								'key': key,
                        //								'value': k
                        //							});
                        //						}
                        if (value.answers[i][j].answer[key].state == 'PASSED') {
                            stuAnswerStat[k].right_userIds = stuAnswerStat[k].right_userIds.concat(value.answers[i][j].userIds);
                        } else {
                            stuAnswerStat[k].wrong_userIds = stuAnswerStat[k].wrong_userIds.concat(value.answers[i][j].userIds);
                            isAllCorrect = false;
                        }
                        k++;
                    }

                    if (isAllCorrect) {
                        convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                    }
                }
            }
        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }


    /**
     * 基础题－连线题统计
     * @param oriData
     */
    function matchHandle(oriData) {
        var value = oriData.value;
        console.log('value:', value);
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        convertedData["allrightStu"] = [];

        var module = player.getPlayerServices().getModulesByType('BasicQuestionViewer')[0];
        var model = module.getDataQuestionAssessmentModel();
        correctAnswer = model.correctAnswer['RESPONSE_1-1'].value;
        var moduleStatService = module.getModuleStatService();
        var randomSeed = [].concat(moduleStatService.getRandomSeed());
        convertedData["randomSeed"] = [].concat(randomSeed);
        //检测连线题的排序
        var answerSerail = [];
        var simpleMatchSet1 = model.modelMap['RESPONSE_1-1'].simpleMatchSet[0];
        var simpleMatchSet2 = model.modelMap['RESPONSE_1-1'].simpleMatchSet[1];
        for (var j = 0, jLen = randomSeed.length; j < jLen; j++) {
            if (randomSeed[j] < correctAnswer.length) {
                answerSerail.push(randomSeed.splice(j, 1)[0]);
                --j;
                jLen = randomSeed.length;
            }
        }

        console.log('answerSerail:', answerSerail);
        console.log('randomSeed:', randomSeed);
        console.log('simpleMatchSet1:', simpleMatchSet1);
        console.log('simpleMatchSet2:', simpleMatchSet2);

        for (var k = 0, kLen = correctAnswer.length; k < kLen; k++) {
            if (!stuAnswerStat[k]) {
                stuAnswerStat[k] = {
                    right_userIds: [],
                    wrong_userIds: [],
                    unfinished_userIds: value.unfinishedUserIds,
                    ref_key: (k + 1)
                };
                item_key.push(k + 1);
            }
        }

        if (value.answers) {
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                    if (!isObject(value.answers[i][j])) {
                        break;
                    }
                    if (isString(value.answers[i][j].answer)) {
                        value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                    } else if (isObject(value.answers[i][j].answer)) {
                        value.answers[i][j].answer = value.answers[i][j].answer;
                    } else {
                        break;
                    }

                    var isAllCorrect = true;
                    for (var k = 0, kLen = correctAnswer.length; k < kLen; k++) {
                        //						if (!stuAnswerStat[k]) {
                        //							stuAnswerStat[k] = {
                        //								right_userIds: [],
                        //								wrong_userIds: [],
                        //								unfinished_userIds: value.unfinishedUserIds,
                        //								ref_key: (k + 1)
                        //							};
                        //							item_key.push(k + 1);
                        //						}
                        var teaKey = simpleMatchSet1[answerSerail[k]].identifier + ' ' + simpleMatchSet2[answerSerail[k]].identifier;
                        var isCorrect = false;
                        for (var m = 0, mLen = value.answers[i][j].answer['RESPONSE_1-1'].value.length; m < mLen; m++) {
                            var stuAnswer = value.answers[i][j].answer['RESPONSE_1-1'].value[m];
                            if (teaKey == stuAnswer) {
                                isCorrect = true;
                                break;
                            }
                        }
                        if (isCorrect) {
                            stuAnswerStat[k].right_userIds = stuAnswerStat[k].right_userIds.concat(value.answers[i][j].userIds);
                        } else {
                            stuAnswerStat[k].wrong_userIds = stuAnswerStat[k].wrong_userIds.concat(value.answers[i][j].userIds);
                            isAllCorrect = false;
                        }

                    }

                    if (isAllCorrect) {
                        convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                    }
                }
            }
        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }

    /**
     * 竖式计算数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function arithmeticHandle(oriData) {
        var i, j, k, m;
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};

        convertedData["allrightStu"] = [];
        if (value.answers) {
            for (i = 0; i < value.answers.length; i++) {
                if ($.isArray(value.answers[i])) {
                    if (value.answers[i].length) {
                        for (j = 0; j < value.answers[i].length; j++) {
                            if (value.answers[i][j].answer && (typeof value.answers[i][j].answer) == "string") {
                                value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);

                                if (!correctAnswer) { //获取正确答案并设置编号
                                    correctAnswer = value.answers[i][j].answer.correctResponse;
                                    if (correctAnswer && $.isArray(correctAnswer)) {
                                        for (k = 0; k < correctAnswer.length; k++) {
                                            item_key.push(k + 1);
                                            stuAnswerStat.push({
                                                "rightNum": 0,
                                                "right_userIds": [],
                                                "wrong_userIds": [],
                                                "unfinished_userIds": value.unfinishedUserIds,
                                                "ref_key": (k + 1)
                                            });
                                        }
                                    }
                                }

                                if (correctAnswer && value.answers[i][j].answer.userResponse &&
                                        correctAnswer.length == value.answers[i][j].answer.userResponse.length) {
                                    for (k = 0; k < correctAnswer.length; k++) {
                                        if (correctAnswer[k] == value.answers[i][j].answer.userResponse[k]) {
                                            for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                                stuAnswerStat[k]["right_userIds"].push(value.answers[i][j].userIds[m]);
                                            }
                                        } else {
                                            for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                                stuAnswerStat[k]["wrong_userIds"].push(value.answers[i][j].userIds[m]);
                                            }
                                        }
                                    }
                                    if (value.answers[i][j].answer.isCorrect) {
                                        convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                                    }
                                }
                            }
                        }
                    } else {
                        $.each(value.correctAnswerTeacher.correctResponse, function (k, item) {
                            if (!stuAnswerStat[k]) {
                                stuAnswerStat[k] = {
                                    rightNum: 0,
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k + 1)
                                };
                                item_key.push(k + 1);
                            }
                        });
                        convertedData["allrightStu"] = [];
                    }

                }
            }

        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });

        onlineNum = value.finishedNum + value.unfinishedNum;

        /**计算正确率**/
        for (i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }


    /**
     * 选词填空数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function fillblankHandler(oriData) {
        var i, j, k, m;
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};

        convertedData["allrightStu"] = [];
        if (value.answers) {
            for (i = 0; i < value.answers.length; i++) {
                if ($.isArray(value.answers[i])) {
                    if (value.answers[i].length) {
                        for (j = 0; j < value.answers[i].length; j++) {
                            if (value.answers[i][j].answer && (typeof value.answers[i][j].answer) == "string") {
                                value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);

                                if (!correctAnswer) { //获取正确答案并设置编号
                                    correctAnswer = value.answers[i][j].answer.correct_response;
                                    if (correctAnswer && $.isArray(correctAnswer)) {
                                        for (k = 0; k < correctAnswer.length; k++) {
                                            item_key.push(k + 1);
                                            stuAnswerStat.push({
                                                "rightNum": 0,
                                                "right_userIds": [],
                                                "wrong_userIds": [],
                                                "unfinished_userIds": value.unfinishedUserIds,
                                                "ref_key": (k + 1)
                                            });
                                        }
                                    }
                                }

                                if (correctAnswer && value.answers[i][j].answer.user_response &&
                                        correctAnswer.length == value.answers[i][j].answer.user_response.length) {
                                    var isRight = true;
                                    var isIn = false;
                                    for (k = 0; k < correctAnswer.length; k++) {
                                        if (correctAnswer[k] == value.answers[i][j].answer.user_response[k]) {
                                            isIn = true;
                                            stuAnswerStat[k]["right_userIds"] = stuAnswerStat[k]["right_userIds"].concat(value.answers[i][j].userIds);
                                        } else {
                                            isRight = false;
                                            stuAnswerStat[k]["wrong_userIds"] = stuAnswerStat[k]["wrong_userIds"].concat(value.answers[i][j].userIds);
                                        }
                                    }
                                    if (isRight && isIn) {
                                        convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                                    }
                                }
                            }
                        }
                    } else {
                        $.each(value.correctAnswerTeacher.correct_response, function (k, item) {
                            if (!stuAnswerStat[k]) {
                                stuAnswerStat[k] = {
                                    rightNum: 0,
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k + 1)
                                };
                                item_key.push(k + 1);
                            }
                        });
                        convertedData["allrightStu"] = [];
                    }

                }
            }

        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });

        onlineNum = value.finishedNum + value.unfinishedNum;

        /**计算正确率**/
        for (i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }

    /**
     * 分类表格数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function tableHandle(oriData) {
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        var correctMap = {};

        convertedData["allrightStu"] = [];


        if (value.answers) {
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                if (value.answers[i].length) {
                    for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                        if (!isObject(value.answers[i][j])) {
                            break;
                        }
                        if (isString(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                        } else if (isObject(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = value.answers[i][j].answer;
                        } else {
                            break;
                        }
                        $.each(value.answers[i][j].answer, function (k, item) {
                            value.answers[i][j].answer = item;
                            return false;
                        });
                        $.each(value.answers[i][j].answer.correctAnswers, function (k, item) {
                            var temp = item.split(' ');
                            correctMap[temp[0]] = temp[1];
                        });
                        var isAllRight = true;
                        var isIn = false;
                        $.each(value.answers[i][j].answer.value, function (k, item) {
                            if (!stuAnswerStat[k]) {
                                stuAnswerStat[k] = {
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k + 1)
                                };
                                item_key.push(k + 1);
                            }
                            isIn = true;
                            var temp = item.split(' ');
                            if (correctMap[temp[0]] === temp[1]) {
                                stuAnswerStat[k].right_userIds = stuAnswerStat[k].right_userIds.concat(value.answers[i][j].userIds);
                            } else {
                                isAllRight = false;
                                stuAnswerStat[k].wrong_userIds = stuAnswerStat[k].wrong_userIds.concat(value.answers[i][j].userIds);
                            }
                        });
                        if (isAllRight && isIn) {
                            convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                        }
                    }
                } else {
                    $.each(value.correctAnswerTeacher, function (k, item) {
                        value.correctAnswerTeacher = item;
                        return false;
                    });
                    $.each(value.correctAnswerTeacher.correctAnswers, function (k, item) {
                        if (!stuAnswerStat[k]) {
                            stuAnswerStat[k] = {
                                rightNum: 0,
                                right_userIds: [],
                                wrong_userIds: [],
                                unfinished_userIds: value.unfinishedUserIds,
                                ref_key: (k + 1)
                            };
                            item_key.push(k + 1);
                        }
                    });
                    convertedData["allrightStu"] = [];
                }

            }
        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var ii = 0; ii < stuAnswerStat.length; ii++) {
            percent[ii] = (onlineNum > 0) ? (stuAnswerStat[ii]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }
    /**
     * 分类题数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function classifiedHandle(oriData) {
        var value = oriData.value;
        var onlineNum = 0;
        var item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        var correctMap = {};
        var correctNumMap = {};

        convertedData["allrightStu"] = [];
        if (value.correctAnswerTeacher) {
            var num = 0;
            $.each(value.correctAnswerTeacher.correct_response, function (k, item) {
                for (var cIndex = 0; cIndex < item.length; cIndex++) {
                    correctMap[item[cIndex]] = k;
                    correctNumMap[item[cIndex]] = num;
                    if (!stuAnswerStat[num]) {
                        stuAnswerStat[num] = {
                            right_userIds: [],
                            wrong_userIds: [],
                            unfinished_userIds: value.unfinishedUserIds,
                            ref_key: (num + 1)
                        };
                    }
                    num++;
                }
            });
        }

        if (value.answers) {
            //初始化正确答案信息
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                if (value.answers[i].length) {
                    for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                        if (!isObject(value.answers[i][j])) {
                            break;
                        }
                        if (isString(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                        } else if (isObject(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = value.answers[i][j].answer;
                        } else {
                            break;
                        }
                        //构造当前学生答案
                        var responseMap = {};
                        $.each(value.answers[i][j].answer.user_response, function (k, item) {
                            var aItem;
                            for (var aIndex = 0; aIndex < item.length; aIndex++) {
                                aItem = item[aIndex];
                                responseMap[aItem] = k;
                            }
                        });
                        //判断当前学生答案是否正确
                        var isAllRight = true;
                        var aNum;
                        for (var item in correctMap) {
                            aNum = correctNumMap[item];
                            if (responseMap[item] && responseMap[item] === correctMap[item]) {
                                stuAnswerStat[aNum].right_userIds = stuAnswerStat[aNum].right_userIds.concat(value.answers[i][j].userIds);
                            } else {
                                isAllRight = false;
                                stuAnswerStat[aNum].wrong_userIds = stuAnswerStat[aNum].wrong_userIds.concat(value.answers[i][j].userIds);
                            }
                        }
                        if (isAllRight) {
                            convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                        }
                    }
                }
            }
        }
        $.each(stuAnswerStat, function (k, item) {
            item.rightNum = item.right_userIds.length;
            item_key.push(item.ref_key);
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var ii = 0; ii < stuAnswerStat.length; ii++) {
            percent[ii] = (onlineNum > 0) ? (stuAnswerStat[ii]["rightNum"] / onlineNum).toFixed(2) : 0;
        }


        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }

    /**
     * 字谜题数据统计
     * @param oriData
     * 提交人数已修改为在线人数
     */
    function wordpuzzlesHandle(oriData) {
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = {
            h: [],
            v: []
        },
        percent = {
            h: [],
            v: []
        },
        stuAnswerStat = {
            h: [],
            v: []
        };
        var convertedData = {};
        var correctMap = {};

        convertedData["allrightStu"] = [];


        if (value.answers) {
            for (var i = 0, ilen = value.answers.length; i < ilen; i++) {
                if (!isArray(value.answers[i])) {
                    break;
                }
                if (value.answers[i].length) {
                    for (var j = 0, jlen = value.answers[i].length; j < jlen; j++) {
                        if (!isObject(value.answers[i][j])) {
                            break;
                        }
                        if (isString(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = JSON.parse(value.answers[i][j].answer);
                        } else if (isObject(value.answers[i][j].answer)) {
                            value.answers[i][j].answer = value.answers[i][j].answer;
                        } else {
                            break;
                        }

                        var isAllRight = true;
                        var isIn = false;
                        for (var k1 = 0, k1len = value.answers[i][j].answer.answerV.correct_response.length; k1 < k1len; k1++) {
                            isIn = true;
                            if (!stuAnswerStat.v[k1]) {
                                stuAnswerStat.v[k1] = {
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k1 + 1)
                                };
                                item_key.v.push(k1 + 1);
                            }
                            if (value.answers[i][j].answer.answerV.correct_response[k1] === value.answers[i][j].answer.answerV.user_response[k1]) {
                                stuAnswerStat.v[k1].right_userIds = stuAnswerStat.v[k1].right_userIds.concat(value.answers[i][j].userIds);
                            } else {
                                isAllRight = false;
                                stuAnswerStat.v[k1].wrong_userIds = stuAnswerStat.v[k1].wrong_userIds.concat(value.answers[i][j].userIds);
                            }
                        }
                        for (var k2 = 0, k2len = value.answers[i][j].answer.answerH.correct_response.length; k2 < k2len; k2++) {
                            isIn = true;
                            if (!stuAnswerStat.h[k2]) {
                                stuAnswerStat.h[k2] = {
                                    right_userIds: [],
                                    wrong_userIds: [],
                                    unfinished_userIds: value.unfinishedUserIds,
                                    ref_key: (k2 + 1)
                                };
                                item_key.h.push(k2 + 1);
                            }
                            if (value.answers[i][j].answer.answerH.correct_response[k2] === value.answers[i][j].answer.answerH.user_response[k2]) {
                                stuAnswerStat.h[k2].right_userIds = stuAnswerStat.h[k2].right_userIds.concat(value.answers[i][j].userIds);
                            } else {
                                isAllRight = false;
                                stuAnswerStat.h[k2].wrong_userIds = stuAnswerStat.h[k2].wrong_userIds.concat(value.answers[i][j].userIds);
                            }
                        }
                        if (isAllRight && isIn) {
                            convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                        }
                    }
                } else {

                    for (var k1 = 0, k1len = value.correctAnswerTeacher.answerV.correct_response.length; k1 < k1len; k1++) {
                        if (!stuAnswerStat.v[k1]) {
                            stuAnswerStat.v[k1] = {
                                rightNum: 0,
                                right_userIds: [],
                                wrong_userIds: [],
                                unfinished_userIds: value.unfinishedUserIds,
                                ref_key: (k1 + 1)
                            };
                            item_key.v.push(k1 + 1);
                        }
                    }
                    for (var k2 = 0, k2len = value.correctAnswerTeacher.answerH.correct_response.length; k2 < k2len; k2++) {
                        if (!stuAnswerStat.h[k2]) {
                            stuAnswerStat.h[k2] = {
                                rightNum: 0,
                                right_userIds: [],
                                wrong_userIds: [],
                                unfinished_userIds: value.unfinishedUserIds,
                                ref_key: (k2 + 1)
                            };
                            item_key.h.push(k2 + 1);
                        }
                    }
                    convertedData["allrightStu"] = [];
                }
            }
        }
        $.each(stuAnswerStat.v, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        $.each(stuAnswerStat.h, function (k, item) {
            item.rightNum = item.right_userIds.length;
        });
        onlineNum = value.finishedNum + value.unfinishedNum;
        /**计算正确率**/
        for (var iiv = 0; iiv < stuAnswerStat.h.length; iiv++) {
            percent.h[iiv] = (onlineNum > 0) ? (stuAnswerStat.h[iiv]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        /**计算正确率**/
        for (var iih = 0; iih < stuAnswerStat.v.length; iih++) {
            percent.v[iih] = (onlineNum > 0) ? (stuAnswerStat.v[iih]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }
    /**
     * 组词题数据统计
     * @param oriData
     */
    function markpointHandler(oriData) {
        var i, j, k, m;
        var value = oriData.value;
        var onlineNum = 0;
        var correctAnswer, item_key = [],
                percent = [],
                stuAnswerStat = [];
        var convertedData = {};
        convertedData["allrightStu"] = [];

        var answer;
        //获取正确答案并设置编号
        if (!correctAnswer && value.correctAnswerTeacher && value.correctAnswerTeacher.correct_response) {
            correctAnswer = value.correctAnswerTeacher.correct_response;
            if (correctAnswer && $.isArray(correctAnswer)) {
                for (k = 0; k < correctAnswer.length; k++) {
                    item_key.push(k + 1);
                    stuAnswerStat.push({
                        "rightNum": 0,
                        "right_userIds": [],
                        "wrong_userIds": [],
                        "unfinished_userIds": value.unfinishedUserIds,
                        "ref_key": (k + 1)
                    });
                }
            }
        }

        if (value.answers) {
            for (i = 0; i < value.answers.length; i++) {
                if ($.isArray(value.answers[i])) {
                    for (j = 0; j < value.answers[i].length; j++) {
                        answer = value.answers[i][j].answer;
                        if (answer && (typeof answer) == "string") {
                            answer = JSON.parse(answer);

                            if (correctAnswer && answer.user_response) {
                                var judgeIsCorrect = true;
                                for (k = 0; k < correctAnswer.length; k++) {
                                    if (answer.user_response[k] && correctAnswer[k] == answer.user_response[k]) {
                                        //stuAnswerStat[k]["rightNum"] = ((typeof stuAnswerStat[k]["rightNum"]) == "number") ? (stuAnswerStat[k]["rightNum"] + 1) : 1;
                                        for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                            stuAnswerStat[k]["rightNum"] = ((typeof stuAnswerStat[k]["rightNum"]) == "number") ? (stuAnswerStat[k]["rightNum"] + 1) : 1;
                                            stuAnswerStat[k]["right_userIds"].push(value.answers[i][j].userIds[m]);
                                        }
                                    } else {
                                        judgeIsCorrect = false;
                                        for (m = 0; m < value.answers[i][j].userIds.length; m++) {
                                            stuAnswerStat[k]["wrong_userIds"].push(value.answers[i][j].userIds[m]);
                                        }
                                    }
                                }
                                answer.isCorrect = judgeIsCorrect;
                                if (answer.isCorrect) {
                                    convertedData["allrightStu"] = convertedData["allrightStu"].concat(value.answers[i][j].userIds);
                                }
                            }
                        }
                    }
                }
            }
        }

        onlineNum = value.finishedNum + value.unfinishedNum;

        /**计算正确率**/
        for (i = 0; i < stuAnswerStat.length; i++) {
            percent[i] = (onlineNum > 0) ? (stuAnswerStat[i]["rightNum"] / onlineNum).toFixed(2) : 0;
        }

        convertedData["spend_time"] = value.elapsedTime ? value.elapsedTime : 0;
        convertedData["submit_count"] = onlineNum;
        convertedData["answers"] = value.answers;
        convertedData["item_key"] = item_key;
        convertedData["percent"] = percent;
        convertedData["unfinishedNum"] = value.unfinishedNum;
        convertedData["unfinishedUserIds"] = value.unfinishedUserIds;
        convertedData["stuAnswerStat"] = stuAnswerStat;

        if (namespace['fillStatistics']) {
            namespace['fillStatistics'].convertedData = convertedData;
        }
    }

    if (!namespace['fillStatistics']) {
        namespace['fillStatistics'] = new Stat();
    }
})(window.__questionStatObjects || (window.__questionStatObjects = {}))
