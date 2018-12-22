/**
 * Created by Administrator on 2016/1/18.
 */
(function(namespace) {
    function Stat(){
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
        init:function(originalDataSet){
            var deffer = $.Deferred();
            var tempAnswers = {};
            var correctAnswer = [];
            //TODO:统计过程
            var convertedData = this.convertData(originalDataSet);
            //获取题目数据
            this.model = player.getPlayerServices().getModulesByType('BasicQuestionViewer')[0].getDataQuestionAssessmentModel();
            correctAnswer = this.model.correctAnswer['RESPONSE_1-1'].value;
            //统计处理
            var convertedAnswers = convertedData.answers;
            var len = convertedAnswers.length;
            var key,answer,answerLen;

            ////如果是投票题
            if(convertedData.questionType == 'vote'){
                for(var i = 0;i < len;i++){
                    answer = convertedAnswers[i].answer;
                    answerLen = answer.length;

                    for(var j = 0;j < answerLen;j++){
                        key = answer[j].toUpperCase();
                        if(!tempAnswers[key]){
                            tempAnswers[key] = {
                                count:convertedAnswers[i].userIds.length,
                                correct_answer:convertedAnswers[i].isCorrect,
                                userIds:convertedAnswers[i].userIds
                            };
                        }else{
                            tempAnswers[key].count += convertedAnswers[i].userIds.length;
                            tempAnswers[key].userIds = tempAnswers[key].userIds.concat(convertedAnswers[i].userIds);
                        }
                    }
                }
            }else{
                for(var i = 0;i < len;i++){
                    key = convertedAnswers[i].answer.join('').toUpperCase();

                    if(!tempAnswers[key]){
                        tempAnswers[key] = {
                            count:convertedAnswers[i].userIds.length,
                            correct_answer:convertedAnswers[i].isCorrect,
                            userIds:convertedAnswers[i].userIds
                        };
                    }
                }
            }

            this.statisticsData = convertedData;
            this.statisticsData.answers = tempAnswers;
            this.statisticsData.correctAnswer = correctAnswer.sort(function(a,b){return a.localeCompare(b)});
            console.log('statisticsData',this.statisticsData);
            //统计完成执行回调
            //initCallback(data);
            return deffer;
        },
        //获取作答统计的摘要信息
        getSummary:function(){
            var statData = this.statisticsData;
            var questionType = statData.questionType;
            var summaryData = {
                spend_time:statData.elapsedTime,
                submit_count:statData.finishedNum + statData.unfinishedNum,
                answers:[]
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
            if(questionType == 'choice' || questionType == 'judge'){
                /**
                 * 取到备选答案，用来渲染横轴
                 * 单选题,单选，多选，投票 ['A','B','C','D'...]
                 * 判断 ['YES'，'NO']
                 */
                for(var i = 0,len = simpleChoice.length;i < len;i++){
                    alternativeAnswers.push(simpleChoice[i].identifier);
                }

                //单选题渲染数据
                for(var i = 0,len = alternativeAnswers.length;i < len;i++){
                    if (questionType == 'choice' || questionType == 'vote' ) {
                        tempData.content = alternativeAnswers[i];
                    } else {
                        if (alternativeAnswers[i] == 'YES') {
                            tempData.content = '是';
                        } else {
                            tempData.content = '否';
                        }
                    }

                    if(!statData.answers[alternativeAnswers[i]]) {
                        tempData.count = 0;
                        tempData.percent = '0.000';
                        tempData.correct_answer = statData.correctAnswer == alternativeAnswers[i];
                        tempData.userIds = [];
                        tempData.info = simpleChoice[i].content;
                    }else{
                        tempData.count = statData.answers[alternativeAnswers[i]].count;
                        tempData.percent = (tempData.count / statData.totalNum).toFixed(3);
                        tempData.correct_answer = statData.correctAnswer == alternativeAnswers[i];
                        tempData.userIds = statData.answers[alternativeAnswers[i]].userIds;
                        tempData.info = simpleChoice[i].content;
                    }
                    summaryData.answers.push(tempData);
                    tempData = {};
                }

                //如果是投票题,投票人数从多到少排序
                if(questionType == 'vote'){
                    summaryData.answers.sort(function(a,b){
                        return b.count - a.count
                    });
                }

            }else if(questionType == 'multiplechoice' || questionType == 'vote'){
                for(var key in statData.answers){
                    tempData.content = key;
                    tempData.count = statData.answers[key].count;
                    tempData.percent = (tempData.count / statData.totalNum).toFixed(3);
                    tempData.correct_answer = statData.answers[key].correct_answer;
                    tempData.userIds = statData.answers[key].userIds;
                    summaryData.answers.push(tempData);
                    tempData = {};
                }
                //多选题，答案选择人数从多到少排序
                summaryData.answers.sort(function(a,b){
                    return b.count - a.count
                });
            }

            //如果有未作答的学生
            if(statData.unfinishedNum > 0){
                tempData = {
                    content: "未作答",
                    count: statData.unfinishedNum,
                    percent: (statData.unfinishedNum / statData.totalNum).toFixed(3),
                    correct_answer: false,
                    userIds:statData.unfinishedUserIds
                }
                if(summaryData.answers.length > 8){
                    //多选题截取前八个答案
                    //if(questionType == 'multiplechoice'){
                    //    summaryData.answers = summaryData.answers.slice(0,8);
                    //    summaryData.answers.push(tempData);
                    //}else{
                        summaryData.answers.splice(8,0,tempData);
                    //}
                }else{
                    summaryData.answers.push(tempData);
                }

                //summaryData['unfinised_answer'] = tempData;
            }

            //不是投票题，获取正确答案学生ID
            if(questionType != 'vote'){
                for(var j = 0,len = summaryData.answers.length;j < len;j++){
                    console.log(summaryData.answers[j].correct_answer);
                    if(summaryData.answers[j].correct_answer == true){
                        summaryData['allrightStu'] = summaryData.answers[j].userIds;
                    }
                }
            }

            //正确答案
            summaryData.correct_answer = statData.correctAnswer;
            console.log('summary',summaryData);
            return summaryData;

        },
        //获取指定作答结果(可能是正确或错误)的统计信息
        getSpecifical:function(answer) {

        },
        //获取正确答案的数据(排行榜类需要实现)
        getCorrectAnswer:function() {

        },
        //转换数据，得到需要的数据
        convertData:function(originalData){
            var value = originalData.value;
            var answers = value.answers[0];
            var convertedAnswers = [];
            console.log(answers);
            var convertedData = {
                //题目类型
                questionType:value.questionType,
                //用时
                elapsedTime:value.elapsedTime,
                //已作答人数
                finishedNum:value.finishedNum,
                //未作答人数
                unfinishedNum:value.unfinishedNum,
                //未作答id
                unfinishedUserIds:value.unfinishedUserIds,
                //总人数
                totalNum:value.unfinishedNum + value.finishedNum,
                //答对人数
                correctNum:0
            };

            //学生答题数据转换
            if(answers.length > 0){
                convertedAnswers.length = answers.length;
                for(var i = 0,len = answers.length;i < len;i++){
                    convertedAnswers[i] = {};
                    answers[i].answer = JSON.parse(answers[i].answer);

                    convertedAnswers[i].answer = answers[i].answer['RESPONSE_1-1'].value;
                    if(answers[i].answer['RESPONSE_1-1'].state == 'PASSED'){
                        convertedAnswers[i].isCorrect = true;
                        convertedData.correctNum++;
                    }else{
                        convertedAnswers[i].isCorrect = false;
                    }
                    convertedAnswers[i].userIds = answers[i].userIds;
                }
            }

            //学生作答结果
            convertedData.answers = convertedAnswers;
            //答错人数
            convertedData.wrongNum = convertedData.totalNum - convertedData.correctNum;
            //正确率
            convertedData.correctRate = (convertedData.correctNum / convertedData.totalNum).toFixed(3);

            console.log('convertedData',convertedData);
            return convertedData;
        },
        //释放统计过程中使用的内存对象
        dispose:function() {
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
        }

    };

    if(!namespace['choiceStatistics']){
        namespace['choiceStatistics'] = new Stat();
    }
})(window.__questionStatObjects || (window.__questionStatObjects = {}))