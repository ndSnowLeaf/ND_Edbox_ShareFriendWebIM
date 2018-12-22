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

            if (orignalDataSet && orignalDataSet.value) {
                this.convertedData = this.convertData(orignalDataSet);
            }
            return deffer;
        },
        //获取作答统计的摘要信息
        getSummary: function () {

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

            convertedData.unfinishedUsers = value.unfinishedUserIds;
            convertedData.correctUsers = [];
            convertedData.wrongUsers = [];

            if (value.answers && value.answers[0].length > 0) {
                for (var index = 0; index < value.answers[0].length; index++) {
                    var object = value.answers[0][index];
                    if (object && object.userIds) {
                        var data = JSON.parse(object.answer);
						data["RESPONSE_1-1"] = data.user_response[0]['RESPONSE_1-1'];
						
                        if (value.questionType && (value.questionType == "fraction" || value.questionType == "textselect" || value.questionType == "nd_intervalproblem")) {
                            if (data && data.isCorrect) {
                                convertedData.correctUsers = convertedData.correctUsers.concat(object.userIds);
                            } else {
                                if (data && data.correct_response && data.user_response) {
                                    var is_same = (data.correct_response.length == data.user_response.length)
                                        && data.correct_response.every(function (element, index) {
                                            return element === data.user_response[index];
                                        });
                                    if (is_same) {
                                        convertedData.correctUsers = convertedData.correctUsers.concat(object.userIds);
                                    } else {
                                        convertedData.wrongUsers = convertedData.wrongUsers.concat(object.userIds);
                                    }
                                } else {
                                    convertedData.wrongUsers = convertedData.wrongUsers.concat(object.userIds);
                                }
                            }
                        }

                        if (value.questionType && (value.questionType == "seqencing" || value.questionType == "order")) {
                            if (data && data["RESPONSE_1-1"]) {
                                if (data["RESPONSE_1-1"]["state"] == "PASSED") {
                                    convertedData.correctUsers = convertedData.correctUsers.concat(object.userIds);
                                } else {
                                    convertedData.wrongUsers = convertedData.wrongUsers.concat(object.userIds);
                                }
                            } else {
                                $.each(object.userIds,function(i,u){
                                    if($.inArray(u,convertedData.unfinishedUsers) < 0){
                                        convertedData.wrongUsers.push(u);
                                    }
                                });
                                //convertedData.wrongUsers = convertedData.wrongUsers.concat(object.userIds);
                            }
                        }
                    }
                }
            }
            convertedData.allrightStu = [];
            convertedData.allrightStu = convertedData.allrightStu.concat(convertedData.correctUsers);
            convertedData.spend_time = value ? value.elapsedTime ? value.elapsedTime : 0 : 0;
            convertedData.submit_count = value ? value.finishedNum + value.unfinishedNum : 0;
            convertedData.correctNum = convertedData.correctUsers.length;
            convertedData.wrongNum = convertedData.wrongUsers.length;
            return convertedData;
        },
        //释放统计过程中使用的内存对象
        dispose: function () {

        }

    };

    if (!namespace['judgeStatistics']) {
        namespace['judgeStatistics'] = new Stat();
    }
})(window.__questionStatObjects || (window.__questionStatObjects = {}))