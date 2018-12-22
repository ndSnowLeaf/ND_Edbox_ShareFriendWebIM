/**
 * Created by Administrator on 2016/1/18.
 */
(function(namespace) {

    function Render(){
        this.dealQuestionList = [
            "linkup",
            "pointsequencing",
            "memorycard",
            "spellpoem"
        ];
        this.statObj = null;
        this.i18nModel = null;
    }

    Render.prototype = {
        //设置下一个统计渲染库
        setNextHandler:function(handler){
            this.nextHandler = handler;
        },
        //渲染处理
        handle:function(questionType,answerData,detialArea,miniArea,header,i18nModel){
            var self = this;
            var index = $.inArray(questionType,self.dealQuestionList);

            if(index < 0){
                //不在此库处理的题型中,交由下一个库处理
                if(self.nextHandler != null){
                    console.log('交给下一个库渲染');
                    return self.nextHandler.handle(questionType,answerData,detialArea,miniArea,header,i18nModel);
                }
            }else{
                //如果存在排行类型的统计处理
                if(window.__questionStatObjects.rankStatistics){
                    self.statObj = window.__questionStatObjects.rankStatistics;
                    self.i18nModel = i18nModel;
                    var deffer = self.statObj.init(answerData);
                    //统计完成后渲染
                    self.renderStatPanel(detialArea,miniArea,header, self.statObj,self.i18nModel);
                    var correctUsers = self.statObj.convertedData.correctUserIds;
                    deffer.resolve(correctUsers);
                    return deffer;
                }
            }
        },
        //渲染统计面板
        renderStatPanel:function(detialArea,miniArea,header, statObj,i18nModel){
            var self = this;
            console.log('渲染排行类统计界面',detialArea,miniArea,header);
            hidePresenterContainer();
            var html = getRankStaticsHtml(i18nModel);
            detialArea.html(html);
			$(".chart_display").css("border-bottom-left-radius", 0);
            updateRankStatics(header, detialArea, statObj,self.i18nModel);
            clickHandler(detialArea);
            tableScrollerHandler();
            rightAnswerContainerScrollerHandler();
            handleExitExam(statObj.convertedData.questionType);
        },
        //显示完整统计
        showFullPanel:function(){

        },
        //显示mini统计
        showMinPanel:function(){

        },
        //释放渲染占用的对象
        dispose:function(){
            this.statObj = null
            //namespace.rankStatRender = null;
        }
    };
    /**
     * 按钮的点击事件处理
     */
    var clickHandler = function(container){
        //为正确答案按钮添加鼠标点击事件
        $(container).find(".right-answer").on("click", function(){
            $(this).addClass("on");
            $(container).find(".rank-select").removeClass("on");
            $(container).find(".ranking-container").hide();
            $(container).find(".right-answer-container").show();
            $(container).find(".com_answer_main").show();

            var rightAnswerHtml = getRightAnswerHtml();
            $(container).find(".com_answer_content").html(rightAnswerHtml);
			setViewContainerSize();
            setLinkupAnswerLines();
            $(container).find(".right-answer-container").show();
        });

        $(container).find(".rank-select").on("click", function(){
            $(this).addClass("on");
            $(container).find(".right-answer").removeClass("on");
            $(container).find(".right-answer-container").hide();
            $(container).find(".ranking-container").show();
        });

        $(container).find(".btn_flower").on("click",function(){
            var studentId = $(this).attr("studentId");
            var studentName = $(this).attr("studentName");
            if(studentId){
                fireStuffEvent("FLOWER",[studentId]);
                if(window.PresenterFlowerTip){
                    window.PresenterFlowerTip([studentName]);
                }
            }
        });
    };

    //发送事件
    var fireEvent = function(eventName, option) {
        if (!option) {
            option = {};
        }
        if(window.ClassroomUtils && ClassroomUtils.fireEvent){
            ClassroomUtils.fireEvent(eventName, option);
        }
    };

    //发送送花事件
    var fireStuffEvent = function(item,usrIds,num){
        fireEvent("Stuff", {
            "source": "ObjectiveQuestionStatistics",
            "item":item,
            "value": {
                "num": num?num:1,//默认送1
                "userIds": usrIds // 答对的用户ID
            },
            isApp: true
        });
    };

    /**
     * 区域的滚动处理
     */
    var tableScrollerHandler = function(){
        var isMouseDown = false;
        $(".charts_main").on("mousedown",function(){
            isMouseDown = true;
            return false;
        }).on("mouseup", function(){
            isMouseDown = false;
            return false;
        }).on("mousemove", function(e){
            if(isMouseDown){
                //鼠标按下
                var height = e.pageY;
                var containerHeight = $(".charts_main").offset().top;
                $(".charts_main").scrollTop(height - containerHeight)
            }
        });
    };

    /**
     * 正确答案部分的区域滚动处理
     */
    var rightAnswerContainerScrollerHandler = function(){
        var isMouseDown = false;
        $(".com_answer_wp").on("mousedown",function(){
            isMouseDown = true;
            return false;
        }).on("mouseup", function(){
            isMouseDown = false;
            return false;
        }).on("mousemove", function(e){
            if(isMouseDown){
                //鼠标按下
                var height = e.pageY;
                var containerHeight = $(".com_answer_wp").offset().top;
                $(".com_answer_wp").scrollTop(height - containerHeight)
            }
        });
    };

    var getRightAnswerHtml = function(){
        var statObj = window.__questionStatObjects.rankStatistics;
        var convertedData = statObj.convertedData;
        var questionType = convertedData.questionType;
        var rightAnswers = convertedData.correctAnswer.correctAnswer;
        var rightAnswerHtml = '';
        if(questionType === 'linkup'){
            var player = window.player;
            rightAnswerHtml = player.getPlayerServices().getModule('LinkUp')._getService().showAnswer(rightAnswers);
        }
        else if(questionType === 'memorycard'){
            var player = window.player;
            rightAnswerHtml = player.getPlayerServices().getModule('MemoryCard')._getService().showAnswer(rightAnswers);
        }
        else{
            rightAnswerHtml = rightAnswers;
        }

        return rightAnswerHtml;
    };
    /**
     * 更新排行榜类统计的基本信息
     */
    var updateRankStatics = function(header, detail, statObj,i18nModel){
        updateHeader(header, statObj,i18nModel);
        updateRankStaticsInfo(detail, statObj);
        initTableRank(detail, statObj);
    };

    /**
     * 更新头部统计区域
     * header为头部显示区域
     */
    var updateHeader = function(header, statObj,i18nModel){
        var convertedData = statObj.convertedData;
        console.log("排行榜统计数据为:")
        console.log(convertedData)
        var elapseTime = convertedData.elapsedTime;
        var min = Math.floor(elapseTime / 60);
        var sec = elapseTime % 60;
        //时间显示
        $(header).find('.spend_time .time_m').text(min+''+i18nModel['minute']);
        $(header).find('.spend_time .time_s').text(sec+''+i18nModel['second']);
        //已提交人数显示
        var spanHtml = [i18nModel['submit_count']+': ',
                '<span class="num">',
                convertedData.committed + "/" + convertedData.total,
                        '</span>'].join("");
        $(header).find('.submitCount').html(spanHtml);
    };
    /**
     * 更新排名和作答信息
     */
    var updateRankStaticsInfo = function(detail, statObj){
        var convertedData = statObj.convertedData;
        $(detail).find(".num-finished").text(convertedData.finished);
        $(detail).find(".num-unfinished").text(convertedData.unfinished);
        $(detail).find(".num-all").text(convertedData.total);

        //更新进度条
        var width = ( convertedData.finished / convertedData.total ) * 100 + "%";
        $(detail).find(".process-bar-finished").css("width", width);
        width = ( convertedData.unfinished / convertedData.total ) * 100 + "%";
        $(detail).find(".process-bar-unfinished").css("width", width);

        //更新排名信息
        var finishList = convertedData.finishList;
        var length = finishList.length;
        var $li;
        for(var i = 0; i < length; i ++){
            //只显示前3名的信息
            if(i < length && i < 3){
                var student = finishList[i];
                switch (i){
                    case 0:
                        //第一名
                        $li = $(detail).find(".rank-first");
                        break;
                    case 1:
                        //第二名
                        $li = $(detail).find(".rank-second");
                        break;
                    case 2:
                        //第三名
                        $li = $(detail).find(".rank-third");
                        break;
                }
                var studentHtml = [
                    '<span class="stu_pic">',
                        '<img src="' + student.headIconOffline + '">',
                    '</span>',
                    '<p class="stu_info">',
                        '<span class="name">' + formatStudentName(student) + '</span>',
                        '<span class="time">' + formatElapseTime(student, student.submitTime) + '</span>',
                    '</p>'
                ].join("");
                $li.append(studentHtml);
            }
        }
    };

    var initRank = function(student, index){
        if(student.answerStatus === "finished"){
            return index + 1;
        }
        else{
            return "-";
        }
    };

    var initTableRank = function(detail, statObj){
        var convertedData = statObj.convertedData;
        var submitList = convertedData.submitList;
        var length = submitList.length;
        var $ul = $(detail).find(".charts_main").children("ul");
        for(var i = 0; i < length; i ++){
            var student = submitList[i];
            var studentHtml = [
                '<li>',
                    '<span class="num">' + initRank(student, i) + '</span>',
                    '<span class="fullname">' + formatStudentName(student) + '</span>',
                    '<span class="taketime">' +formatElapseTime(student, student.submitTime) + '</span>',
                    '<a class="btn_flower" studentName="'+student.studentName+'" studentId="'+student.studentId+'"></a>',
                '</li>'
            ].join("");
            var $li = $(studentHtml);
            if(student.answerStatus !== "finished"){
                $li.addClass("overtime");
            }
            else if(student.answerStatus === "finished" && i < 3){
                $li.addClass("rank-on");
            }
            $ul.append($li);
        }
    };

    /**
     * 格式化学生姓名
     */
    var formatStudentName = function(student){
        var length = student.studentName.length;
        if(length > 6){
            return student.studentName.substring(0, 6) + "...";
        }
        else{
            return student.studentName;
        }
    };

    /**
     * 格式化时间
     * type = 1 显示1分12秒，否则显示01:12
     */
    var formatElapseTime = function(student, elapseTime){
        if(student.answerStatus === "finished"){
            var time = parseInt(elapseTime);
            if(time === NaN){
                return '';
            }
            else{
                var min = Math.floor(elapseTime / 60);
                var sec = elapseTime % 60;
                var result = "";
                if(min > 0){
                    if(min < 10){
                        result = "0" + min;
                    }
                    else{
                        result = min;
                    }
                }
                else{
                    result = "00";
                }
                if(sec > 0){
                    if(sec < 10){
                        result = result + ":0" + sec;
                    }
                    else{
                        result = result + ":" + sec;
                    }
                }
                else{
                    result = result + ":00";
                }
                return result;
            }
        }
        else{
            return "-:-";
        }

    };

    /**
     * 隐藏题目内容和按钮
     */
    var hidePresenterContainer = function(){
        $(".layout_presenter").hide();
        $(".layout_handle").hide();
    };

    /**
     * 监听退出本题按钮的点击处理
     */
    var handleExitExam = function(questionType){
        $(document).on("statisticEvent", function(e, data) {
            if (data.eventData && data.eventData.type !== questionType) {
                return;
            }
            if (data.eventName === "exitExam") {
                $(".layout_presenter").show();
                $(".layout_handle").show();
            }
        });
    };
    /**
     * 设置分割线的高度
     */
    var setViewContainerSize = function(){
		var length = $(".com_answer_cosspan_l li").length;
		if(length > 8){
			var scale = length / 8;
			var $com_answer_content = $(".com_answer_content");
			var $com_answer_m = $(".com_answer_m");
			var height = $com_answer_content.height() * 0.9 * scale;
			//$com_answer_m.css("height", height);
		}
    };

    /**
     * 设置连连看和记忆卡牌中间连线
     */
    var setLinkupAnswerLines = function(){
        var $leftDiv = $(".com_answer_l");
		var $leftUl = $(".com_answer_cosspan_l");
        var $leftLis = $leftDiv.find(".com_answer_cosspan_l li");
        var length = $leftLis.length;
        for(var i = 0; i < length; i ++){
            var $line = $('<a class="link_up_line"></a>');
			var top = 2.5 + i * 6;
			$line.css("top", top + "em");
            $leftUl.append($line)
        }
        var $rightDiv = $(".com_answer_r");
		var $rightUl = $(".com_answer_cosspan_l");
        var $rightLis = $rightDiv.find(".com_answer_cosspan_l li");
        var length = $rightLis.length;
        for(var i = 0; i < length; i ++){
			var top = 2.5 + i * 6;
			$line.css("top", top + "em");
            var $line = $('<a class="link_up_line"></a>');
            $rightUl.append($line)
        }
    };

    /**
     * 排行榜统计类的页面基本机构
     */
    var getRankStaticsHtml = function(i18nModel){
        var html = [
            '<div class="stat_wood">',
			'<div class="ranking_content" id="layout">',
			'<div class="com_wrapper" id="wrapper" style="height:43.25em">',
			'<!--主体内容-->',
			'<div class="com_layout_container">',
			'<!-- tab -->',
			'<div class="tab_box">',
			'<a href="javascript:;" class="btn_tab on rank-select">' + i18nModel['ranking_list'] + '</a>',
			'<a href="javascript:;" class="btn_tab right-answer">' + i18nModel['correct_answer'] + '</a>',
			'</div>',
			'<!-- /tab -->',
			'<div class="com_rank_layout">',
			'<!-- 排行榜 -->',
			'<div class="tabmain on ranking-container">',
			'<div class="ranking_title">',
			'<em></em>排行榜',
			'</div>',
			'<div class="gradient_xbg">',
			'<!-- 左边概况 -->',
			'<div class="overview">',
			'<!-- 奖台名次 -->',
			'<div class="podium">',
			'<ul>',
			'<li>',
			'<div class="stu_rank second rank-second">',
			'</div>',
			'</li>',
			'<li>',
			'<div class="stu_rank first rank-first">',
			'</div>',
			'</li>',
			'<li>',
			'<div class="stu_rank third rank-third">',
			'</div>',
			'</li>',
			'</ul>',
			'</div>',
			'<!-- /奖台名次 -->',
			'<div class="chart_title">' + i18nModel['answer_summary'] + '</div>',
			'<div class="chart_main">',
			'<ul>',
			'<li>',
			'<em class="chart_text">' + i18nModel['finished'] + '</em>',
			'<div class="chart_body">',
			'<span class="progress process-bar-finished"></span>',
			'</div>',
			'<span class="percentage">',
			'<em class="num num-finished"></em>/<em  class="den num-all"></em>',
			'</span>',
			'</li>',
			'<li>',
			'<em class="chart_text">' + i18nModel['unfinished'] + '</em>',
			'<div class="chart_body">',
			'<span class="progress process-bar-unfinished"></span>',
			'</div>',
			'<span class="percentage">',
			'<em class="num num-unfinished"></em>/<em  class="den num-all"></em>',
			'</span>',
			'</li>',
			'</ul>',
			'</div>',
			'</div>',
			'<!-- /左边概况 -->',
			'<!-- 右边排名 -->',
			'<div class="rank_charts">',
			'<div class="charts_title">',
			'<ul>',
			'<li><em>名&nbsp;&nbsp;&nbsp;次</em></li>',
			'<li><em>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</em></li>',
			'<li><em>' + i18nModel['answer_time'] + '</em></li>',
			'</ul>',
			'</div>',
			'<div class="charts_main">',
			'<ul>',
			'</ul>',
			'</div>',
			'</div>',
			'<!-- /右边排名 -->',
			'</div>',
			'</div>',
			'<!-- /排行榜 -->',
			'<!-- 正确答案 -->',
			'<div class="tabmain right-answer-container">',
			'<div class="com_answer_title">',
			'<em></em>正确答案',
			'</div>',
			'<div class="com_answer_main">',
			'<div class="com_answer_box">',
			'<div class="com_answer_wp">',
			'<span class="com_answer_content pos_top box_square">            <!--不管外部容器多大，始终上下左右居中-->',
			'</span>',
			'</div>',
			'</div>',
			'</div>',
			'</div>',
			'<!-- /正确答案 -->',
			'</div>',
			'</div>',
			'<!--/主体内容-->',
			'</div>',
			'</div>',
			'</div>'].join("");

        return html;
    };

    namespace.rankStatRender = new Render();
})(window.__StatisticsRender || (window.__StatisticsRender = {}));