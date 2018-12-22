/**
 * Created by Administrator on 2016/1/18.
 */
(function(namespace) {
    var QuestionType = {
        LINKUP: "linkup",
        POINTSEQUENCE:"pointsequencing",
        MEMORYCARD:"memorycard",
        SPELLPOEM:"spellpoem"
    };

    var studentList = [];
    //保存学生信息的数组
    function Stat(){
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
        init:function(orignalDataSet){
            var deffer = $.Deferred();
            //TODO:统计过程

            //统计完成执行回调
            getStudentByUserId();
            this.convertedData = this.convertData(orignalDataSet);
            return deffer;
        },
        //获取作答统计的摘要信息
        getSummary:function(){

        },
        //获取指定作答结果(可能是正确或错误)的统计信息
        getSpecifical:function(answer) {

        },
        //获取正确答案的数据(排行榜类需要实现)
        getCorrectAnswer:function() {
            var convertedData = this.convertData;
            if(convertedData.correctAnswer){
                return convertedData.correctAnswer;
            }
            else{
                return null;
            }
        },
        //转换数据，得到需要的数据
        convertData:function(originalData){
            studentList = getAllStudents();
            var value = originalData.value;
            console.log("------------------")
            console.log(originalData.value);
            var users = value.users;
            var submitList = addStudentSubmitTime(users);
            var correctAnswerObj = parseRightAnswer(value);
            var answers = value.answers[0];
            var questionType = value.questionType;
            updateStudentAnswerStatus(questionType, submitList, correctAnswerObj, answers);
            var finishList = getFinishStudents(submitList);
            var correctUsers = getFinishedStudents(finishList);
            var unFinishList = getUnfinishStudents(submitList);
            submitList = finishList.concat(unFinishList);
            var convertedData = {
                questionType:questionType,                                     //题目类型
                finished:finishList.length || 0,                               //已作答人数
                unfinished:(unFinishList.length) || 0,       //未完成人数
                committed:(submitList.length) || 0,      //提交总人数
                total:studentList.length,                                      //班级总人数
                elapsedTime:value.elapsedTime || 0,                            //作业用时
                submitList:submitList,                                         //学生列表
                correctAnswer:correctAnswerObj,                                //正确答案
                finishList:finishList,                                         //已完成学生列表
                unFinishList:unFinishList,                                     //未完成学生列表
                correctUserIds:correctUsers                                    //正确的学生ID
            };
            return convertedData;
        },
        //释放统计过程中使用的内存对象
        dispose:function() {
            studentList = [];
        }
    };

    /**
     * 获取学生的信息
     */
    var getStudentByUserId = function(userId, studentList){
        var options = {
            order:[{
                orderProperty:"seatNumberValue",
                orderType:"asc"
            },{
                orderProperty:"studentNo",
                orderType:"asc"
            }]
        };
        if(!studentList){
            studentList = ClassroomUtils.getCurrentStudents(options);
        }

        if(userId){
            for(var i = 0; i < studentList.length; i ++){
                var student = studentList[i];
                if(userId === student.studentId){
                    return student;
                }
            }
        }
    };

    /**
     * 获取全部学生人数
     */
    var getAllStudents = function(){
        var options = {
            order:[{
                orderProperty:"seatNumberValue",
                orderType:"asc"
            },{
                orderProperty:"studentNo",
                orderType:"asc"
            }]
        };
        var studentList = ClassroomUtils.getCurrentStudents(options);
        return studentList;
    };

    /**
     * 为每个学生增加提交时间
     * submitList为学生的提交信息
     * -submitTime
     * -userId
     */
    var addStudentSubmitTime = function(submitList){
        var result = [];
        if(submitList && submitList.length > 0) {
            var length = submitList.length;
            for (var i = 0; i < length; i++) {
                var item = submitList[i];
                var userId = item.userId;
                var student = getStudentByUserId(userId, studentList);
                if (student) {
                    student.submitTime = item.submitTime;
                    if(student.submitTime === 0){
                        if(student.onlineStatus){
                            student.answerStatus = "unfinished";
                        }
                    }
                    result.push(student);
                }
            }
        }
        return result;
    };

    /**
     * 获取已完成的学生列表
     * @param submitList
     * @returns {Array}
     */
    var getFinishStudents = function(submitList){
        var result = [];
        if(submitList && submitList.length > 0) {
            var length = submitList.length;
            for (var i = 0; i < length; i++) {
                var item = submitList[i];
                if(item.answerStatus == "finished"){
                    result.push(item);
                }
            }
        }

        result.sort(function(a, b){
            if(a.submitTime > b.submitTime){
                return 1;
            }
            else if(a.submitTime < b.submitTime){
                return -1;
            }
            else{
                //判断学号是否为数字
                var numA = parseInt(a.studentNo);
                var numB = parseInt(b.studentNo);
                if(isNaN(numA) || isNaN(numB)){
                    if(a.studentNo > b.studentNo){
                        return 1;
                    }
                    else if(a.studentNo < b.studentNo){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                }
                else{
                    if(numA > numB){
                        return 1;
                    }
                    else if(numA < numB){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                }
            }
        });
        return result;
    };

    /**
     * 获取只做一半的学生列表(未完成)
     * @param submitList
     * @returns {Array}
     */
    var getUnfinishStudents = function(submitList){
        var result = [];
        if(submitList && submitList.length > 0) {
            var length = submitList.length;
            for (var i = 0; i < length; i++) {
                var item = submitList[i];
                if(item.answerStatus == "unfinished"){
                    result.push(item);
                }
            }
        }

        result.sort(function(a, b){
            var numA = parseInt(a.studentNo);
            var numB = parseInt(b.studentNo);
            if(isNaN(numA) || isNaN(numB)){
                if(a.studentNo > b.studentNo){
                    return 1;
                }
                else if(a.studentNo < b.studentNo){
                    return -1;
                }
                else{
                    return 0;
                }
            }
            else{
                if(numA > numB){
                    return 1;
                }
                else if(numA < numB){
                    return -1;
                }
                else{
                    return 0;
                }
            }
        });
        return result;
    };

    /**
     * 获取在线但是未作答的学生列表
     * @param submitList
     */
    var getUndoStudents = function(submitList){
        var result = [];
        if(submitList && submitList.length > 0) {
            var length = submitList.length;
            for (var i = 0; i < length; i++) {
                var item = submitList[i];
                if(item.answerStatus == "undo"){
                    result.push(item);
                }
            }
        }

        result.sort(function(a, b){
            if(a.submitTime > b.submitTime){
                return 1;
            }
            else if(a.submitTime < b.submitTime){
                return -1;
            }
            else{
                //判断学号是否为数字
                var numA = parseInt(a.studentNo);
                var numB = parseInt(b.studentNo);
                if(isNaN(numA) || isNaN(numB)){
                    if(a.studentNo > b.studentNo){
                        return 1;
                    }
                    else if(a.studentNo < b.studentNo){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                }
                else{
                    if(numA > numB){
                        return 1;
                    }
                    else if(numA < numB){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                }
            }
        });
        return result;
    };

    /**
     * 解析正确答案
     * @param statData
     * @returns {{key: string, correctAnswer: {}}}
     */
    var parseRightAnswer = function(statData){
        var questionType = statData.questionType;
        var player = window.player;
        var model = null;
        var correctAnswerObj = {
            key:'',
            correctAnswer:{}
        };
        if(QuestionType.LINKUP === questionType){
            if (player.getPlayerServices().getModule('LinkUp') != null){
                model = player.getPlayerServices().getModule('LinkUp').getDataQuestionAssessmentModel();
            }
            if(model != null){
                var correctAnswer = model.correctAnswer;
                var keys = [];
                for (var key in correctAnswer) {
                    if (correctAnswer.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                if (keys.length > 0) {
                    correctAnswerObj.key = keys[0];
                    correctAnswerObj.correctAnswer = correctAnswer[keys[0]].value;
                }
            }
        }
        else if(QuestionType.MEMORYCARD === questionType){
            if (player.getPlayerServices().getModule('MemoryCard') != null){
                model = player.getPlayerServices().getModule('MemoryCard').getDataQuestionAssessmentModel();
            }
            if(model != null){
                var correctAnswer = model.correctAnswer;
                var keys = [];
                for (var key in correctAnswer) {
                    if (correctAnswer.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                if (keys.length > 0) {
                    correctAnswerObj.key = keys[0];
                    correctAnswerObj.correctAnswer = correctAnswer[keys[0]].value;
                }
            }

        }
        else if(QuestionType.POINTSEQUENCE === questionType){
            if (player.getPlayerServices().getModule('PointSequencing') != null){
                var correctAnswerDom = player.getPlayerServices().getModule('PointSequencing')._getService().showAnswer();
                correctAnswerObj.correctAnswer = correctAnswerDom;
            }
        }
        else if(QuestionType.SPELLPOEM === questionType){
            if (player.getPlayerServices().getModule('SpellPoem') != null){
                var correctAnswerDom = player.getPlayerServices().getModule('SpellPoem')._getService().showAnswer();
                correctAnswerObj.correctAnswer = correctAnswerDom;
            }
        }
        return correctAnswerObj;
    };

    /**
     * 获取学生作答的答案
     * 连连看-记忆卡牌
     */
    var getStudentAnswerForLinkup = function(userId, answer, key){
        var userIds = answer.userIds;
        if(userIds.indexOf(userId) != -1){
            var answer = JSON.parse(answer.answer);
            return answer;
        }
    };

    /**
     * 获取学生作答的答案
     * 点排序
     */
    var getStudentAnswerForPointSequence = function(userId, answer, key){
        var userIds = answer.userIds;
        if(userIds.indexOf(userId) != -1){
            var answer = JSON.parse(answer.answer);
            return answer;
        }
    };

    /**
     * 获取学生作答的答案
     * 连词拼诗
     */
    var getStudentAnswerForSpellPoem = function(userId, answer, key){
        var userIds = answer.userIds;
        if(userIds.indexOf(userId) != -1){
            var answer = JSON.parse(answer.answer);
            return answer;
        }
    };
    /**
     * 更新学生的完成状态
     * @param questionType      题目类型
     * @param submitList        提交信息
     * @param correctAnswerObj  正确答案
     * @param answers           学生答案
     */
    var updateStudentAnswerStatus = function(questionType, submitList, correctAnswerObj, answers){
        switch(questionType){
            case QuestionType.LINKUP:
            case QuestionType.MEMORYCARD:
                updateStudentAnswerStatusForLinkup(submitList, correctAnswerObj, answers);
                break;
            case QuestionType.POINTSEQUENCE:
                updateStudentAnswerStatusForPointSequence(submitList, correctAnswerObj, answers);
                break;
            case QuestionType.SPELLPOEM:
                updateStudentAnswerStatusForSpellPoem(submitList, correctAnswerObj, answers);
                break;
        }
    };

    /**
     * 更新连词拼诗题型的学生完成状态
     */
    var updateStudentAnswerStatusForSpellPoem = function(submitList, correctAnswerObj, answers){
        for(var i = 0; i < answers.length; i ++){
            var answer = answers[i];
            var userIds = answer.userIds;
            for(var j = 0; j < userIds.length; j ++){
                var userId = userIds[j];
                var student = getStudentByUserId(userId, submitList);
                if(student){
                    var correctAnswer = correctAnswerObj.correctAnswer;
                    var key = correctAnswerObj.key;
                    var studentAnswer = getStudentAnswerForSpellPoem(userId, answer, key);
                    console.log("sa=")
                    console.log(studentAnswer)
                    console.log("ca=")
                    console.log(correctAnswer);
                    if(student.submitTime === 0){
                        //判断学生是否在线
                        if(student.onlineStatus){
                            student.answerStatus = "unfinished";
                        }
                        else{
                            student.answerStatus = "offline";
                        }
                    }
                    else{
                        if(studentAnswer){
                            var status = studentAnswer["isComplete"];
                            if(status){
                                student.answerStatus = "finished";
                            }
                            else{
                                student.answerStatus = "unfinished";
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * 更新点排序题型的学生完成状态
     */
    var updateStudentAnswerStatusForPointSequence = function(submitList, correctAnswerObj, answers){
        for(var i = 0; i < answers.length; i ++){
            var answer = answers[i];
            var userIds = answer.userIds;
            for(var j = 0; j < userIds.length; j ++){
                var userId = userIds[j];
                var student = getStudentByUserId(userId, submitList);
                if(student){
                    var correctAnswer = correctAnswerObj.correctAnswer;
                    var key = correctAnswerObj.key;
                    var studentAnswer = getStudentAnswerForPointSequence(userId, answer, key);
                    console.log("sa=")
                    console.log(studentAnswer)
                    console.log("ca=")
                    console.log(correctAnswer);
                    if(student.submitTime === 0){
                        //判断学生是否在线
                        if(student.onlineStatus){
                            student.answerStatus = "unfinished";
                        }
                        else{
                            student.answerStatus = "offline";
                        }
                    }
                    else{
                        if(studentAnswer){
                            var status = studentAnswer.status;
                            if(status === "complete"){
                                student.answerStatus = "finished";
                            }
                            else{
                                student.answerStatus = "unfinished";
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     * 学生完成状态判定
     * 连连看-记忆卡牌
     */
    var updateStudentAnswerStatusForLinkup = function(submitList, correctAnswerObj, answers){
        for(var i = 0; i < answers.length; i ++){
            var answer = answers[i];
            var userIds = answer.userIds;
            for(var j = 0; j < userIds.length; j ++){
                var userId = userIds[j];
                var student = getStudentByUserId(userId, submitList);
                if(student){
                    var correctAnswer = correctAnswerObj.correctAnswer;
                    var key = correctAnswerObj.key;
                    var studentAnswerObj = getStudentAnswerForLinkup(userId, answer, key);
                    console.log("sa=")
                    console.log(studentAnswerObj)
                    console.log("ca=")
                    console.log(correctAnswer);
                    if(student.submitTime === 0){
                        //判断学生是否在线
                        if(student.onlineStatus){
                            student.answerStatus = "unfinished";
                        }
                        else{
                            student.answerStatus = "offline";
                        }
                    }
                    else{
                        if(studentAnswerObj){
                            var answerStatus = studentAnswerObj[key].answerStatus;
                            if(answerStatus == 2 || answerStatus == 3){
                                student.answerStatus = "finished";
                            }
                            else{
                                student.answerStatus = "unfinished";
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     * 获取已完成的学生的学号信息
     */
    var getFinishedStudents = function(finishList){
        var userIds = [];
        for(var i = 0; i < finishList.length; i ++){
            var stu = finishList[i];
            if(stu && stu.studentId){
                userIds.push(stu.studentId);
            }
        }
        return {
            "allrightStu":userIds
        };
    };

    /**
     * 获取正确的学生的学号信息
     */
    var getCorrectStudents = function(answers, questionType){
        var userIds = [];
        for(var i = 0; i < answers.length; i ++){
            var answer = answers[i];
            if(isAnswerRight(answer, questionType)){
                userIds = userIds.concat(answer["userIds"]);
            }
        }
        return {
            "allrightStu":userIds
        };
    };

    var isAnswerRight = function(answer, questionType){
        var answer = JSON.parse(answer.answer);
        if(questionType === QuestionType.LINKUP || questionType === QuestionType.MEMORYCARD){
            for(var key in answer){
                if(answer.hasOwnProperty(key)){
                    var state = answer[key].state;
                    if(state === "PASSED"){
                        return true;
                    }
                }
            }
            return false;
        }
        else if(questionType === QuestionType.POINTSEQUENCE){
            if(answer.status && answer.status === "complete"){
                return true;
            }
            else{
                return false;
            }
        }
        else if(questionType === QuestionType.SPELLPOEM){
            var status = answer["isComplete"];
            if(status){
                return true;
            }
            else{
                return false;
            }
        }
        return false;
    }


    if(!namespace['rankStatistics']){
        namespace['rankStatistics'] = new Stat();
    }
})(window.__questionStatObjects || (window.__questionStatObjects = {}))
