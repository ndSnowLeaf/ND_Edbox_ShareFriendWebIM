/**
 * Created by Administrator on 2016/1/18.
 */
(function (namespace) {

    function Render() {
        this.dealQuestionList = [
            'fraction', 'textselect', 'seqencing', 'order' ,'nd_intervalproblem','nd_mathaxis'
        ];
        this.statObj = null;
        this.i18nModel = null;
    }

    Render.prototype = {
        //设置下一个统计渲染库
        setNextHandler: function (handler) {
            this.nextHandler = handler;
        },
        //渲染处理
        handle: function (questionType, answerData, detailArea, miniArea, header,i18nModel) {
            var self = this;
            var index = $.inArray(questionType, self.dealQuestionList);

            if (index < 0) {
                //不在此库处理的题型中,交由下一个库处理
                if (self.nextHandler != null) {
                    console.log('交给下一个库渲染');
                    return self.nextHandler.handle(questionType, answerData, detailArea, miniArea, header,i18nModel);
                }
            } else {
                //如果存在判断类型的统计处理
                if (window.__questionStatObjects.judgeStatistics) {
                    self.statObj = window.__questionStatObjects.judgeStatistics;
                    self.i18nModel = i18nModel;
                    var deffer = self.statObj.init(answerData);
                    //统计完成后渲染
                    self.renderStatPanel(detailArea, miniArea, header);
                    deffer.resolve(self.statObj.convertedData);
                    return deffer;
                }
            }
        },
        //渲染统计面板
        renderStatPanel: function (detailArea, miniArea, header) {
            console.log('渲染判断类统计界面', detailArea, miniArea, header);
            //渲染头部信息
            if (header && this.statObj.convertedData) {
                var spendTime = this.statObj.convertedData.spend_time;
                if (spendTime && (typeof spendTime) == "number") {
                    var min = Math.floor(spendTime / 60);
                    var sec = spendTime % 60;
                    header.find(".spend_time .time_m em").html(min);
                    header.find(".spend_time .time_s em").html(sec);
                }
                header.find(".submitCount .num").html((typeof this.statObj.convertedData.submit_count) == "number" ? this.statObj.convertedData.submit_count : "");
            }

            this.renderDetail(detailArea, this.statObj.convertedData);
            this.renderMini(miniArea, this.statObj.convertedData);
        },
        //显示完整统计
        showFullPanel: function () {

        },
        //显示mini统计
        showMinPanel: function () {

        },
        //释放渲染占用的对象
        dispose: function () {
            this.statObj = null;
            //namespace.judgeStatRender = null;
        },

        renderMini: function (view, data) {
            var self = this;
            var html = '';
            html += '<ul class="histogram">';

            if (data.correctNum) {
                html += '<li class="hist_list correct">';
                html += '<a href="###" class="hist_a">';
                html += '<div><em>' + data.correctNum + '</em><span class="man">人</span></div><span class="answer">' + self.i18nModel['answer_correct'] + '</span></a></li>';
            }

            if (data.wrongNum) {
                html += '<li class="hist_list error"><!-- 选中时加on -->';
                html += '<a href="###" class="hist_a">';
                html += '<div><em>' + data.wrongNum + '</em><span class="man">人</span></div><span class="answer">' + self.i18nModel['answer_wrong'] + '</span></a></li>';
            }

            if (data.unfinishedNum) {
                html += '<li class="hist_list no_answer"><!-- 没有未作答则不显示 -->';
                html += '<a href="###" class="hist_a">';
                html += '<div><em>' + data.unfinishedNum + '</em><span class="man">人</span></div><span class="answer">' + self.i18nModel['do_not_answer_1'] + '</span></a></li>';
            }
            html += '</ul>';
            $(view).addClass("trueof_content");
            view.html(html);
        },
        renderDetail: function (view, data) {
            view.html('<canvas id="judgeStatRenderCanvas" width="800" height="300" style=" padding-left: 0;padding-right: 0;margin-left: auto;margin-right: auto;display: block;"> ');
            //data.correctNum = 0;
            //data.wrongNum = 1;
            //data.unfinishedNum = 0;
            this.buildPieChart(view, data);
        },
        buildPieChart: function (view, data) {
            var self = this;
            self.data = data;
            var jsondata = [{name: self.i18nModel['answer_correct'], num: data.correctNum},
                {name: self.i18nModel['answer_wrong'], num: data.wrongNum},
                {name: self.i18nModel['do_not_answer_1'], num: data.unfinishedNum}];
            var COLOR = {
                "GREEN": "#5BBB84",
                "RED": "#E57C5C",
                "GRAY": "#949494",
                "LINECOLOR": "#867964",
                "BACKGROUD": "#F8EFDE",
                "CIRCLE": "#EBE2D0"
            };
            var radius = 60;
            var center = {x: 400, y: 150};
            var colors = [COLOR.GREEN, COLOR.RED, COLOR.GRAY];
            var sum = 0;
            var lastsum = 0;
            var canvas = $(view).find("#judgeStatRenderCanvas");
            if (canvas == null)
                return;
            var ctx = canvas[0].getContext("2d");

            canvas[0].addEventListener('click', function (evt) {
                clickWhichArea(evt);
            }, false);

            function clickWhichArea(evt) {
                for (var index = 0; index < jsondata.length; index++) {
                    if (jsondata[index].num != 0 && jsondata[index].startAngle != undefined && jsondata[index].endAngle != undefined) {
                        var point = {
                            x: evt.clientX - $(canvas).offset().left,
                            y: evt.clientY - $(canvas).offset().top
                        };
                        if (isInsideSector(point, center, radius, jsondata[index].startAngle, jsondata[index].endAngle)) {
                            self.buildAnswerDetialDialog(index, self.data);
                            break;
                        }
                    }
                }
            }

            function isInsideSector(point, center, radius, angle1, angle2) {
                var relPoint = {
                    x: point.x - center.x,
                    y: point.y - center.y
                };

                var firstPart = Math.atan2(relPoint.y - 0, relPoint.x - 1);
                var secondPart = Math.atan2(0 - relPoint.y, 1 - relPoint.x);
                var resultAngle = firstPart >= 0 ? firstPart : Math.PI + secondPart;

                return resultAngle > angle1 && resultAngle < angle2 && (relPoint.x * relPoint.x + relPoint.y * relPoint.y <= radius * radius);
            }

            //求数据总和
            for (var i = 0; i < jsondata.length; i++) {
                sum += jsondata[i].num;
            }
            drawChart();

            //下一个起始
            function lastSum(i) {
                lastsum = 0;//重置为0
                for (var j = 0; j < i; j++) {
                    lastsum += jsondata[j].num;
                }
            }

            function drawChart() {
                ctx.save();
                ctx.strokeStyle = COLOR.CIRCLE;
                ctx.lineWidth = "10";
                ctx.moveTo(center.x, center.y);
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius + 2, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
                for (var i = 0; i < jsondata.length; i++) {
                    if (jsondata[i].num != 0) {
                        lastSum(i);//上一个结束弧度就是下一个起始弧度
                        var startAngle = (Math.PI * 2) * (lastsum / sum);//起始弧度
                        lastSum(i + 1);
                        var endAngle = (Math.PI * 2) * (lastsum / sum);//结束弧度
                        jsondata[i].startAngle = startAngle;
                        jsondata[i].endAngle = endAngle;

                        //draw pi
                        ctx.save();
                        ctx.fillStyle = colors[i];
                        ctx.beginPath();
                        ctx.moveTo(center.x, center.y);
                        ctx.arc(center.x, center.y, radius, startAngle, endAngle, false);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();

                        //drawText(startAngle, endAngle, jsondata[i].name, jsondata[i].num / sum, jsondata[i].num, colors[i]);
                    }
                }

                if (jsondata[0].num != 0 && jsondata[1].num != 0 && jsondata[2].num != 0) {
                    if (jsondata[0].num / sum + jsondata[1].num / sum < 0.4) {
                        drawText(jsondata[0].startAngle, jsondata[0].endAngle, jsondata[0].name, jsondata[0].num / sum, jsondata[0].num, colors[0], false);
                        drawText(jsondata[1].startAngle, jsondata[1].endAngle, jsondata[1].name, jsondata[1].num / sum, jsondata[1].num, colors[1], true);
                        drawText(jsondata[2].startAngle, jsondata[2].endAngle, jsondata[2].name, jsondata[2].num / sum, jsondata[2].num, colors[2], false);
                    } else if (jsondata[1].num / sum + jsondata[2].num / sum < 0.1) {
                        drawText(jsondata[0].startAngle, jsondata[0].endAngle, jsondata[0].name, jsondata[0].num / sum, jsondata[0].num, colors[0], true);
                        drawText(jsondata[1].startAngle, jsondata[1].endAngle, jsondata[1].name, jsondata[1].num / sum, jsondata[1].num, colors[1], false);
                        drawText(jsondata[2].startAngle, jsondata[2].endAngle, jsondata[2].name, jsondata[2].num / sum, jsondata[2].num, colors[2], true);
                    } else if (jsondata[0].num / sum + jsondata[2].num / sum < 0.1) {
                        drawText(jsondata[0].startAngle, jsondata[0].endAngle, jsondata[0].name, jsondata[0].num / sum, jsondata[0].num, colors[0], true);
                        drawText(jsondata[1].startAngle, jsondata[1].endAngle, jsondata[1].name, jsondata[1].num / sum, jsondata[1].num, colors[1], false);
                        drawText(jsondata[2].startAngle, jsondata[2].endAngle, jsondata[2].name, jsondata[2].num / sum, jsondata[2].num, colors[2], false);
                    } else {
                        drawText(jsondata[0].startAngle, jsondata[0].endAngle, jsondata[0].name, jsondata[0].num / sum, jsondata[0].num, colors[0], true);
                        drawText(jsondata[1].startAngle, jsondata[1].endAngle, jsondata[1].name, jsondata[1].num / sum, jsondata[1].num, colors[1], false);
                        drawText(jsondata[2].startAngle, jsondata[2].endAngle, jsondata[2].name, jsondata[2].num / sum, jsondata[2].num, colors[2], true);
                    }
                } else {
                    for (var i = 0; i < jsondata.length; i++) {
                        if (jsondata[i].num != 0) {
                            drawText(jsondata[i].startAngle, jsondata[i].endAngle, jsondata[i].name, jsondata[i].num / sum, jsondata[i].num, colors[i]);
                        }
                    }
                }
            }

            //绘制文本和线段
            function drawText(s, e, name, percent, num, color, isdown) {
                //draw text title
                var x1 = Math.cos((s + e) / 2) * (radius - 10) + center.x;
                var y1 = Math.sin((s + e) / 2) * (radius - 10) + center.y;
                var x2 = Math.cos((s + e) / 2) * (radius + 60) + center.x;
                var y2 = Math.sin((s + e) / 2) * (radius + 60) + center.y;
                var x = Math.cos((s + e) / 2) * (radius + 60) + center.x;
                if (x2 > center.x) {
                    //draw on the right
                    //x = x2 + 180;
                } else {
                    //draw on the left
                    x = x2 - 180;
                }

                if (isdown) {
                    y2 = Math.sin((s + e) / 2 + Math.PI / 8) * (radius + 60) + center.y;
                } else {
                    y2 = Math.sin((s + e) / 2 - Math.PI / 8) * (radius + 60) + center.y;
                }

                var y = y2 - 5;
                //num text
                ctx.save();
                ctx.font = "15px Microsoft Yahei";
                ctx.fillStyle = color;
                ctx.fillText("· " + name, x, y);
                ctx.font = "20px Microsoft Yahei";
                ctx.fillText("  " + num, x + 20 * name.length, y);
                ctx.font = "15px Microsoft Yahei";
                ctx.fillStyle = COLOR.LINECOLOR;
                ctx.fillText("人(" + (Math.round(percent * 100) / 1) + "%)", x + 20 * name.length + 20 + 10 * ("" + num).length, y);
                ctx.restore();

                //draw line
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.arc(x1, y1, 1, 0, 360, false);
                ctx.moveTo(x1, y1);
                ctx.lineWidth = 4;
                ctx.lineTo(x2, y2);
                ctx.lineWidth = 1;
                if (x2 > center.x) {
                    //draw on the right
                    ctx.lineTo(x2 + 180, y2);
                } else {
                    //draw on the left
                    ctx.lineTo(x2 - 180, y2);
                }
                ctx.fillStyle = COLOR.LINECOLOR;
                ctx.stroke();
            }
        },
        buildAnswerDetialDialog: function (key, converteddata) {//构造做题情况对话框
            var oqs = player.getPlayerServices().getModule('ObjectiveQuestionStatistics');
            if (oqs && oqs._getService) {
                var service = oqs._getService();
                var views = service.showAnswerDetial();
                var data = {};
                data.stuAnswerStat = [];
                switch (key) {
                    case 0:
                    {
                        data.stuAnswerStat.push({
                            "rightNum": 1,
                            "right_userIds": converteddata.correctUsers,
                            "wrong_userIds": [],
                            "unfinished_userIds": [],
                            "ref_key": key
                        });
                        break;
                    }
                    case 1:
                    {
                        data.stuAnswerStat.push({
                            "rightNum": 1,
                            "right_userIds": converteddata.wrongUsers,
                            "wrong_userIds": [],
                            "unfinished_userIds": [],
                            "ref_key": key
                        });
                        break;
                    }
                    case 2:
                    {
                        data.stuAnswerStat.push({
                            "rightNum": 1,
                            "right_userIds": converteddata.unfinishedUsers,
                            "wrong_userIds": [],
                            "unfinished_userIds": [],
                            "ref_key": key
                        });
                        break;
                    }
                }
                data.item_key = [key];

                service.getOnlineStu(data, key);

                var $statistic_item_content = views.statistic_item_content;
                $statistic_item_content.find("li").off("click");
                $statistic_item_content.empty();

                var $statistic_stu_list = views.statistic_stu_list;
                $statistic_stu_list.attr("show-type-tab", "rightAnswer");//首次切换到答对标签

                //设置答对的学生列表
                service.setStuList(views, "rightAnswer");

                //去除顶部留白
                //var h = $statistic_stu_list.height();
                //var b = $statistic_stu_list.css("bottom");
                //b = parseFloat(b) + h;
                //$statistic_item_content.parent().height(b+"px");
                $statistic_item_content.parent().removeClass("class_c").addClass("class_c");
            }
        }
    };

    namespace.judgeStatRender = new Render();
})(window.__StatisticsRender || (window.__StatisticsRender = {}));