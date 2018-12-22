/**
 * 为基础习题重构进行的修改
 */
(function (namespace) {
    function Stat() {
        //原始数据
        this.originalData = {};
        //最终的统计数据
        this.statisticsData = {};
        //答题统计的摘要信息
        this.summary = {};
        //题目信息
        this.model = {};
        //获取到的指定作答结果的统计信息
        this.specificalAnswerUsers = {};
    }

    Stat.prototype = {
        //统计
        init: function (originalDataSet) {
            var deffer = $.Deferred();
            var tempAnswers = {};
            var correctAnswer = [];
            //TODO:统计过程
            var convertedData = this.convertData(originalDataSet);
            //获取题目数据
            if (originalDataSet.QtiAssessmentModel == undefined) {
                throw Error('无法找到QTI数据对象!');
            }
            this.model = originalDataSet.QtiAssessmentModel;
            if (this.model.correctAnswer && this.model.correctAnswer['RESPONSE_1-1']) {
                correctAnswer = this.model.correctAnswer['RESPONSE_1-1'].value;
            }
            //修复课堂总结查看详情没有显示正确答案bug
            if(originalDataSet.value.correctFromClassSummary && (originalDataSet.value.questionType == "choice" || originalDataSet.value.questionType == "judge")){
                correctAnswer = originalDataSet.value.correctFromClassSummary;
            }

            //统计处理
            var convertedAnswers = convertedData.answers;
            var len = convertedAnswers.length;
            var key, answer, answerLen;

            ////如果是投票题
            if (convertedData.questionType == 'vote') {
                for (var i = 0; i < len; i++) {
                    answer = convertedAnswers[i].answer;
                    if($.isArray(answer)){
                        answerLen = answer.length;
                        for (var j = 0; j < answerLen; j++) {
                            key = answer[j].toUpperCase();
                            if (!tempAnswers[key]) {
                                tempAnswers[key] = {
                                    count: convertedAnswers[i].userIds.length,
                                    correct_answer: false,//convertedAnswers[i].isCorrect
                                    userIds: convertedAnswers[i].userIds
                                };
                            } else {
                                tempAnswers[key].count += convertedAnswers[i].userIds.length;
                                tempAnswers[key].userIds = tempAnswers[key].userIds.concat(convertedAnswers[i].userIds);
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < len; i++) {
                    if ($.isArray(convertedAnswers[i].answer)) {
                        key = convertedAnswers[i].answer.join('').toUpperCase();
                    } else if ((typeof convertedAnswers[i].answer) == "string") {
                        key = convertedAnswers[i].answer.toUpperCase();
                    }

                    if (key && !tempAnswers[key]) {
                        tempAnswers[key] = {
                            count: convertedAnswers[i].userIds.length,
                            correct_answer: convertedAnswers[i].isCorrect,
                            userIds: convertedAnswers[i].userIds
                        };
                    }
                }
            }

            this.statisticsData = convertedData;
            this.statisticsData.answers = tempAnswers;
            this.statisticsData.correctAnswer = correctAnswer.sort(function (a, b) {
                return a.localeCompare(b)
            });
            var summary = this.getSummary();
            this.statisticsData.allrightStu = summary.allrightStu;
            console.log('statisticsData', this.statisticsData);
            //统计完成执行回调
            //initCallback(data);
            
            return deffer;
        },
        //获取作答统计的摘要信息
        getSummary: function (langProperties) {
            var yes = (langProperties&&langProperties.yes)?langProperties.yes:"是";
            var no = (langProperties&&langProperties.no)?langProperties.no:"否";
            var noAnswer = (langProperties&&langProperties.noAnswer)?langProperties.noAnswer:"未作答";
            var statData = this.statisticsData;
            var questionType = statData.questionType;
            var summaryData = {
                spend_time: statData.elapsedTime,
                submit_count: statData.finishedNum + statData.unfinishedNum,
                answers: []
            };
            //备选答案
            var alternativeAnswers = [];

            var simpleChoice = this.model.modelMap['RESPONSE_1-1'].simpleChoice;
            var isCorrectAnswer = false;


            //for(var key in statData.answers){
            //    tempData = statData.answers[key];
            //    tempData['content'] = key;
            //    tempData['percent'] = (tempData.count / statData.totalNum).toFixed(3);
            //    summaryData.answers.push(tempData);
            //}
            var tempData = {};
            if (questionType == 'choice' || questionType == 'judge') {
                /**
                 * 取到备选答案，用来渲染横轴
                 * 单选题,单选，多选，投票 ['A','B','C','D'...]
                 * 判断 ['YES'，'NO']
                 */
                for (var i = 0, len = simpleChoice.length; i < len; i++) {
                    alternativeAnswers.push(simpleChoice[i].identifier);
                }

                //单选题渲染数据
                for (var i = 0, len = alternativeAnswers.length; i < len; i++) {
                    if (questionType == 'choice' || questionType == 'vote') {
                        tempData.content = alternativeAnswers[i];
                    } else {
                        if (alternativeAnswers[i] == 'YES') {
                            tempData.content = yes;
                        } else {
                            tempData.content = no;
                        }
                    }

					tempData.key = alternativeAnswers[i];
                    if (!statData.answers[alternativeAnswers[i]]) {
                        tempData.count = 0;
                        tempData.percent = '0.000';
                        tempData.correct_answer = statData.correctAnswer == alternativeAnswers[i];
                        tempData.userIds = [];
                        tempData.info = simpleChoice[i].content;
                    } else {
                        tempData.count = statData.answers[alternativeAnswers[i]].count;
                        tempData.percent = (tempData.count / statData.totalNum).toFixed(3);
                        //tempData.correct_answer = statData.correctAnswer == alternativeAnswers[i];
                        tempData.correct_answer = (statData.answers[alternativeAnswers[i]].correct_answer === true)?true:false;//修复bug#80954
                        tempData.userIds = statData.answers[alternativeAnswers[i]].userIds;
                        tempData.info = simpleChoice[i].content;
                    }
                    summaryData.answers.push(tempData);
                    tempData = {};
                }

                //如果是投票题,投票人数从多到少排序
                if (questionType == 'vote') {
                    summaryData.answers.sort(function (a, b) {
                        return b.count - a.count
                    });
                }

            } else if (questionType == 'multiplechoice' || questionType == 'multichoice' || questionType == 'vote') {
                for (var key in statData.answers) {
                    tempData.key = key;
                    tempData.content = key;
                    tempData.count = statData.answers[key].count;
                    tempData.percent = (tempData.count / statData.totalNum).toFixed(3);
                    tempData.correct_answer = statData.answers[key].correct_answer;
                    tempData.userIds = statData.answers[key].userIds;
                    summaryData.answers.push(tempData);
                    tempData = {};
                }
                //多选题，答案选择人数从多到少排序
                summaryData.answers.sort(function (a, b) {
                    return b.count - a.count
                });
            }

            //如果有未作答的学生
            if (statData.unfinishedNum > 0) {
                tempData = {
					key : 'noanswer',
                    content: noAnswer,
                    count: statData.unfinishedNum,
                    percent: (statData.unfinishedNum / statData.totalNum).toFixed(3),
                    correct_answer: false,
                    userIds: statData.unfinishedUserIds
                }
                if (summaryData.answers.length > 8) {
                    //多选题截取前八个答案
                    //if(questionType == 'multiplechoice'){
                    //    summaryData.answers = summaryData.answers.slice(0,8);
                    //    summaryData.answers.push(tempData);
                    //}else{
                    summaryData.answers.splice(8, 0, tempData);
                    //}
                } else {
                    summaryData.answers.push(tempData);
                }

                //summaryData['unfinised_answer'] = tempData;
            }

            //不是投票题，获取正确答案学生ID
            if (questionType != 'vote') {
                for (var j = 0, len = summaryData.answers.length; j < len; j++) {
                    console.log(summaryData.answers[j].correct_answer);
                    if (summaryData.answers[j].correct_answer == true) {
                        summaryData['allrightStu'] = summaryData.answers[j].userIds;
                    }
                }
            }

            //正确答案
            summaryData.correct_answer = statData.correctAnswer;
            console.log('summary', summaryData);
            return summaryData;

        },
        //获取指定作答结果(可能是正确或错误)的统计信息
        getSpecifical: function (answer) {

        },
        //获取正确答案的数据(排行榜类需要实现)
        getCorrectAnswer: function () {

        },
        //转换数据，得到需要的数据
        convertData: function (originalData) {
            var value = originalData.value;
            var answers = value.answers[0];
            var convertedAnswers = [];
            console.log(answers);
            var convertedData = {
                //题目类型
                questionType: value.questionType,
                //用时
                elapsedTime: value.elapsedTime,
                //已作答人数
                finishedNum: value.finishedNum,
                //未作答人数
                unfinishedNum: value.unfinishedNum,
                //未作答id
                unfinishedUserIds: value.unfinishedUserIds,
                //总人数
                totalNum: value.unfinishedNum + value.finishedNum,
                //答对人数
                correctNum: 0
            };

            //学生答题数据转换
            if (answers.length > 0) {
                //convertedAnswers.length = answers.length;
                var answerTemp;
                for (var i = 0, len = answers.length; i < len; i++) {
                    answerTemp = {};
                    if ((typeof answers[i].answer) == "string") {//&& answers[i].answer.indexOf("RESPONSE_") > 0 兼容重构前统计数据 modified by wth
                        answers[i].answer = JSON.parse(answers[i].answer);
                        //如果对象中包含RESPONSE_1-1对象
                        if(answers[i].answer['RESPONSE_1-1'] !== undefined &&
                            (value.questionType == "multiplechoice" || value.questionType == "multichoice" || value.questionType == "judge" || value.questionType == "choice")) {
                            //需要做答题器数据的适配
                            answers[i].answer = this._adapterAnsweringDevice(answers[i].answer, originalData.QtiAssessmentModel.correctAnswer);
                        }
                        if(answers[i].answer.user_response[0]['RESPONSE_1-1']){
                            answers[i].answer['RESPONSE_1-1'] = answers[i].answer.user_response[0]['RESPONSE_1-1'];
                        }else{
                            answers[i].answer['RESPONSE_1-1'] = {
                                state:"FAILED",
                                value:[]
                            };
                        }

                        //(value.questionType == "multiplechoice" || value.questionType == "vote")
                        if (value.questionType == "vote" &&
                            answers[i].answer && answers[i].answer['RESPONSE_1-1'] && answers[i].answer['RESPONSE_1-1'].value &&
                            $.isArray(answers[i].answer['RESPONSE_1-1'].value) && answers[i].answer['RESPONSE_1-1'].value.length == 0) {
                            if($.isArray(answers[i].userIds) && answers[i].userIds.length >=0) {
                                $.each(answers[i].userIds, function (index, user) {
                                    if ($.inArray(user, convertedData.unfinishedUserIds) < 0) {
                                        convertedData.unfinishedUserIds.push(user);
                                        convertedData.unfinishedNum++;
                                        convertedData.finishedNum--;
                                    }
                                });
                            }
                            continue;//修复投票题统计选项缺失问题
                        }

                        if (answers[i].answer && answers[i].answer['RESPONSE_1-1'] && answers[i].answer['RESPONSE_1-1'].value) {
                            answerTemp.answer = answers[i].answer['RESPONSE_1-1'].value;
                        }
                        if (answers[i].answer && answers[i].answer['RESPONSE_1-1'] && answers[i].answer['RESPONSE_1-1'].state == 'PASSED') {
                            answerTemp.isCorrect = true;
                            convertedData.correctNum += answers[i].userIds.length;
                        } else {
                            answerTemp.isCorrect = false;
                        }
                    } else {//兼容重构前统计数据 modified by wth
                        answerTemp.answer = answers[i].answer;
                        answerTemp.isCorrect = answers[i].isCorrect;

                        if (answers[i].isCorrect == true) {
                            convertedData.correctNum++;
                        }
                    }
                    answerTemp.userIds = answers[i].userIds;
                    convertedAnswers.push(answerTemp);
                }
            }
            //如果是多选, 单选或判断, 要做一次结果合并
            if(value.questionType == "multiplechoice" || value.questionType == "multichoice" || value.questionType == "judge" || value.questionType == "choice") {
                //以answer字段进行分组
                var finalAnswers = [];
                var groupedAnswers = _.groupBy(convertedAnswers, 'answer');
                $.each(groupedAnswers, function (key, item) {
                    if(item.length >= 2) {
                        for(var i=1; i<item.length; i++) {
                            item[0].userIds = _.union(item[0].userIds, item[i].userIds);
                        }
                    }
                    finalAnswers.push(item[0]);
                });
                //学生作答结果
                convertedData.answers = finalAnswers;
            } else {
                convertedData.answers = convertedAnswers;
            }

            //修复课堂总结查看详情没有显示正确答案bug 101118
            if(value.correctFromClassSummary && (value.questionType == "choice" || value.questionType == "judge") && convertedData.answers && $.isArray(convertedData.answers)){
                var answer;
                for(var i= 0,len=convertedData.answers.length; i<len; i++){
                    answer = convertedData.answers[i];
                    if(answer.answer[0] == value.correctFromClassSummary[0]){
                        answer.isCorrect = true;
                    }
                }
            }

            //答错人数
            convertedData.wrongNum = convertedData.totalNum - convertedData.correctNum;
            //正确率
            convertedData.correctRate = (convertedData.correctNum / convertedData.totalNum).toFixed(3);

            console.log('convertedData', convertedData);
            return convertedData;
        },
        //释放统计过程中使用的内存对象
        dispose: function () {
            //原始数据
            this.originalData = null;
            //最终的统计数据
            this.statisticsData = null;
            //答题统计的摘要信息
            this.summary = null;
            //题目信息
            this.model = null;
            //获取到的指定作答结果的统计信息
            this.specificalAnswerUsers = null;
        },
        //适配答题器的内容
        _adapterAnsweringDevice: function (answer, correctAnswer) {
            var adapterData = {
                answer_result: false,
                correct_response: [],
                user_response: []
            };
            adapterData.correct_response.push(correctAnswer);
            //获取答题器的答案
            var answerArray = answer['RESPONSE_1-1'].value;
            //获取正确答案
            var correctArray = correctAnswer['RESPONSE_1-1'].value;
            var isAllCorrect = true;
            //检查答题器答案跟正确答案是否一致
            if(answerArray.length === correctArray.length) {
                //在答案数量相同的情况下,正确答案中的每个元素总能在用户答案中找到
                for(var i=0; i<correctArray.length; i++) {
                    var isMatch = false;
                    for(var j=0; j<answerArray.length; j++) {
                        if(correctArray[i] === answerArray[j]) {
                            isMatch = true;
                            break;
                        }
                    }
                    if(isMatch == false) {
                        isAllCorrect = false;
                        break;
                    }
                }
            } else {
                isAllCorrect = false;
            }
            adapterData.answer_result = isAllCorrect;
            adapterData.user_response.push({
                "RESPONSE_1-1": {
                    "state": isAllCorrect === true ? "PASSED" : "FAILED",
                    "value": answerArray
                }
            });
            return adapterData;
        }

    };

    if (!namespace['choiceStatistics']) {
        namespace['choiceStatistics'] = new Stat();
    }
})(window.__questionStatObjects || (window.__questionStatObjects = {}))