/**
 * Created by Administrator on 2016/1/18.
 */
(function(namespace) {

    function Render(){
        this.dealQuestionList = [
            'choice',
            'judge',
            'vote',
            'multiplechoice'
        ];
        this.i18nModel = null;
        this.statObj = null;
        this.questionType = null;
        this.detailArea = null;
        this.miniArea = null;
        //用于详细统计的数据js
        this.answers = null;
        //mini统计的数据
        this.miniAnswers = null;
    }

    Render.prototype = {
        //设置下一个统计渲染库
        setNextHandler:function(handler){
            this.nextHandler = handler;
        },
        //渲染处理
        handle:function(questionType,answerData,detailArea,miniArea,header,i18nModel){
            var self = this;
            var index = $.inArray(questionType,self.dealQuestionList);

            if(index < 0){
                //不在此库处理的题型中,交由下一个库处理
                if(self.nextHandler != null){
                    console.log('交给下一个库渲染');
                    return self.nextHandler.handle(questionType,answerData,detailArea,miniArea,header,i18nModel);
                }
            }else{
                //如果存在选择类型的统计处理
                if(window.__questionStatObjects.choiceStatistics){
                    self.questionType = questionType;
                    self.statObj = window.__questionStatObjects.choiceStatistics;
                    this.detailArea = detailArea;
                    this.miniArea = miniArea;
                    this.i18nModel = i18nModel;
                    var deffer = self.statObj.init(answerData);
                    //统计完成后渲染
                    self.renderStatPanel(detailArea,miniArea,header);
                    deffer.resolve(self.statObj.getSummary());
                    return deffer;
                }
            }
        },
        //渲染统计面板
        renderStatPanel:function(detailArea,miniArea,header){
            console.log('渲染选择统计界面',detailArea,miniArea,header);
            var statData = this.statObj.getSummary();
            var answers = statData.answers;
            this.answers = answers;
            var min = Math.floor(statData.spend_time / 60);
            var sec = statData.spend_time % 60;

            //时间显示
            $(header).find('.spend_time .time_m em').eq(0).text(min);
            $(header).find('.spend_time .time_s em').eq(0).text(sec);
            //已提交人数显示
            $(header).find('.submitCount .num').text(statData.submit_count);

            console.log(answers);
            //渲染判断题柱状图,第九个显示未作答
            this.createBarColumn(answers,detailArea);

            //渲染mini统计结,第八个显示未作答，对数据重新处理一遍
            var miniAnswers = answers.slice();

            this.renderMini(miniAnswers,miniArea);
            //this.interactionEvent();

        },
        //显示完整统计
        showFullPanel:function(){

        },
        //显示mini统计
        showMinPanel:function(){

        },
        showAnswer:function(){
            //正确答案的序号
            var self = this;
            var correctIndex = -1;
            var summaryData = this.statObj.getSummary();
            var answers = summaryData.answers;
            var correctAnswer = summaryData.correct_answer.join('');
            var len = answers.length;
            var unfinishedState = self.hasUnfinished(answers);
            //dom节点index
            var index;

            for(var i = 0,len = answers.length;i < len;i++){
                if(answers[i].correct_answer == true){
                    correctIndex = i;
                    break;
                }
            }

            //详细统计处理，滚动条为0，答案显示在未作答前
            //单选、多选、投票处理,获取在dom节点中的index,用于滚动条处理
            //详细统计选项
            var $columnContainer = self.detailArea.find('.choice_barColumn_container');
            var $columnWrappers= $columnContainer.find('.choice_column_wrapper');
            var columnContainerWidth = $columnContainer.width();
            //mini统计选项
            var $optionContainer = self.miniArea.find('.choice_mini_wrapper').find('.choice_option_list');
            var $options = $optionContainer.find('.choice_option');
            var optionContainerWidth = $optionContainer.width();

            //正确答案在滚动条上的位置
            var columnWidth;
            var correctAnswerPos;
            //滚动条最大滚动的距离
            var scrollDistance;
            //正确答案相对于ul的位置
            var relativePos;

            //如果是多选题
            if(this.questionType == 'multiplechoice'){
                var correctData;
                //正确答案数据，如果不存在于所选的答案中
                if(correctIndex < 0 || correctIndex > 8){
                    if(correctIndex < 0){
                        correctData = {
                            content:correctAnswer,
                            correct_answer:true,
                            count:0,
                            percent:0.000,
                            userIds:[]
                        };
                    }else if(correctIndex > 8){
                        //如果在大于显示的9个选项中
                        correctData = answers[correctIndex];
                    }

                    //var columnWrapper = '<div class="column_wrapper" data-identifier='+ correctData.content +' style="width: 90px; margin-right: 50px;height:'+ this.stepHeight*correctData.percent +'px">';
                    //var header = '<div class="column_header"><span class="num">'+ correctData.count +'人</span><span class="percent">'+ (correctData.percent * 100).toFixed(1) +'%</span></div>';
                    //var option = '<div class="column_option">'+ correctData.content +'</div>';
                    //var bar  = '<div class="column_bar"></div>';
                    //columnWrapper += header;
                    //columnWrapper += bar;
                    //columnWrapper += option;
                    //columnWrapper += '</div>';

                    var $columnWrapper = $columnWrappers.eq(0).clone();
                    var $option = $options.eq(0).clone();
                    var barHeight = self.stepHeight * correctData.percent + '%';
                    if(barHeight == 0){
                        barHeight ='5%';
                    }

                    //柱状图渲染
                    $columnWrapper.attr('data-identifier',correctData.content);
                    $columnWrapper.find('.choice_column_header em').text(correctData.count);
                    $columnWrapper.find('.choice_percent').text('(' + parseFloat((correctData.percent * 100).toFixed(1)) + '%)');
                    $columnWrapper.find('.choice_column_percent').height(barHeight);
                    $columnWrapper.find('.choice_column_option').text(correctData.content);
                    $columnWrapper.addClass('choice_correct_answer');


                    //mini 统计渲染
                    $option.attr('data-identifier',correctData.content);
                    $option.find('.choice_order').text(correctData.content);
                    $option.find('.choice_desc em').text(correctData.count);
                    $option.addClass('choice_correct_answer');

                    //mini统计显示7个的处理
                    if(len > 6){
                        //if(answers[6].content == '未作答'){
                        if(unfinishedState.hasUnfinished){
                            $options.eq(5).replaceWith($option);
                        }else{
                            $options.eq(6).replaceWith($option);
                        }
                    }else{
                        //少于7个最后一个是未作答
                        if(answers[len-1].content == '未作答'){
                            $options.eq(len-1).before($option);
                        }else{
                            $optionContainer.append($option);
                        }
                    }

                    //详细统计显示9个的处理
                    if(len > 8){
                        //有9个并且最后一个是未作答
                        if(answers[8].content == '未作答'){
                            $columnWrappers.eq(7).replaceWith($columnWrapper);
                        }else{
                            $columnWrappers.eq(8).replaceWith($columnWrapper);
                        }
                    }else{
                        //少于9个最后一个是未作答
                        if(answers[len-1].content == '未作答'){
                            $columnWrappers.eq(len-1).before($columnWrapper);
                            console.log($columnWrappers);
                        }else{
                            $columnContainer.append($columnWrapper);
                        }
                    }

                }else {
                    $columnWrappers.eq(correctIndex).addClass('choice_correct_answer');
                    $options.eq(correctIndex).addClass('choice_correct_answer');
                    console.log($('.choice_barColumn_container').eq(correctIndex));
                }
            }else{
                if(len > 9){
                    var correctPos = $columnWrappers.eq(correctIndex).position();
                    //正确答案在滚动条上的位置
                    columnWidth = $($columnWrappers).eq(0).width() + Number($($columnWrappers).eq(0).css('margin-right').slice(0,-2));
                    correctAnswerPos = correctIndex * columnWidth;
                    //滚动条最大滚动的距离
                    scrollDistance = correctAnswerPos - columnContainerWidth;
                    //正确答案相对于ul的位置
                    relativePos = correctAnswerPos - $columnContainer.scrollLeft();
                    if(relativePos < 0){
                        scrollDistance -= 4 * columnWidth;
                    }else if(relativePos > columnContainerWidth){
                        scrollDistance += 4 * columnWidth;
                    }

                    if(relativePos < 0 || relativePos > columnContainerWidth){
                        self.detailArea.find('.choice_barColumn_container').animate({
                            'scrollLeft':scrollDistance
                        },500);
                    }

                    //正确答案索引大于8
                    //if(correctIndex > 8){
                    //    $columnWrappers.eq(8).after($columnWrappers.eq(7)).before($columnWrappers.eq(correctIndex));
                    //}
                }
                //mini统计处理，滚动条为0，答案显示在未作答前
                if(len > 7){
                    //正确答案在滚动条上的位置
                    columnWidth = $options.eq(0).width() + Number($options.eq(0).css('margin-right').slice(0,-2));
                    correctAnswerPos = correctIndex * columnWidth;
                    //滚动条最大滚动的距离
                    scrollDistance = correctAnswerPos - optionContainerWidth;
                    //正确答案相对于ul的位置
                    relativePos = correctAnswerPos - $optionContainer.scrollLeft();
                    if(relativePos < 0){
                        scrollDistance -= 3 * columnWidth;
                    }else if(relativePos > optionContainerWidth){
                        scrollDistance += 3 * columnWidth;
                    }

                    if(relativePos < 0 || relativePos > optionContainerWidth){
                        self.miniArea.find('.choice_option_list').animate({
                            'scrollLeft':scrollDistance
                        },500);
                    }
                }

                $columnWrappers.eq(correctIndex).addClass('choice_correct_answer');
                $options.eq(correctIndex).addClass('choice_correct_answer');
            }
        },
        //生成柱状图
        createBarColumn:function(data,container){
            var self = this;
            self.data = data;
            //柱状图间距
            var columnDistance;
            var unfinisedState = this.hasUnfinished(self.data);

            //是否有未作答
            //var hasUnfinished = false;
            //for(var i = 0,len = data.length;i < len;i++){
            //    if(data[i].content == '未作答'){
            //        hasUnfinished = true;
            //        break;
            //    }
            //}

            //如果是多选题，截取前9个显示
            if(self.questionType == 'multiplechoice' && self.data.length > 9){
                self.data = self.data.slice(0,9);
            }

            //要渲染的柱子个数
            var len = self.data.length;

            //生成html
            var choiceBarColumn = '<div class="choice_container"><ul class="choice_barColumn_container"></ul><p class="choice_line"><span class="choice_round"></span></p></div>';
            var bar  = '<div class="choice_column_bar"><span class="choice_column_percent"></span></div>';
            var header,option,columnWrapper;
            var columnWrappers = '';

            for(var i = 0;i < len;i++){
                columnWrapper = '<li class="choice_column_wrapper" data-identifier='+ self.data[i].content +'><a href="javascript:void(0)" class="choice_hist_a">';
                header = '<p class="choice_column_header"><em>'+ self.data[i].count +'</em>人<span class="choice_percent">('+ parseFloat((self.data[i].percent * 100).toFixed(1)) +'%)</span></p>';
                option = '<span class="choice_column_option">'+ self.data[i].content +'</span>';
                columnWrapper += option;
                columnWrapper += header;
                columnWrapper += bar;
                columnWrapper += '</a></li>';
                columnWrappers += columnWrapper;
                columnWrapper = '';
            }


            //将dom结构放入容器
            $(container).html(choiceBarColumn);
            //计算间距,ul的宽度
            //var ulWidth = $(container).find('.choice_barColumn_container').eq(0).width();
            var $columnContainer = $(container).find('.choice_barColumn_container').eq(0);
            var ulWidth = $(container).parent().width() - parseFloat($columnContainer.css('left')) - parseFloat($columnContainer.css('right'));
            //ObjectiveQuestionStatistics
            var _module_stat = player.getPlayerServices().getModule('ObjectiveQuestionStatistics');
            var _service_stat = _module_stat._getService();
            var $_view_stat = _service_stat.getPresenterView();
            self.emSize = Number($_view_stat.css('font-size').slice(0,-2));

            if(len < 6){
                columnDistance = ((ulWidth - 2.5 * self.emSize * 5 - 2 * self.emSize - 2 * self.emSize)/(4 * self.emSize)).toFixed(2);
            }else{
                columnDistance = ((ulWidth - 2.5 * self.emSize * 9 - 2 * self.emSize - 2 * self.emSize)/(8 * self.emSize)).toFixed(2);
            }

            $(container).find('.choice_barColumn_container').html(columnWrappers);
            console.log($(container).find('.column_wrapper'));
            $(container).find('.choice_column_wrapper').css('margin-right',columnDistance + 'em');
            //如果答案多余9个并且有未作答，则未作答浮动
            if(len > 9){
                //答案大于九个，拖动事件绑定
                choiceDragEvent($(container).find('.choice_barColumn_container'));
                //如果有未作答选项，固定该选项位置
                if(unfinisedState.hasUnfinished){
                    //var left = $(container).find('.choice_column_wrapper').eq(unfinisedState.index+1).position().left - 3 *self.emSize;
                    $(container).find('.choice_column_wrapper').eq(unfinisedState.index).addClass('unfinished');
                    // css({
                    //     'right':0,
                    //     'padding-left': (columnDistance / 2) + 'em'
                    // });
                    //最后一个li的margin值增大
                    var marginRight = Number(columnDistance) + Number(4);
                    $(container).find('.choice_column_wrapper').eq(len - 1).css('margin-right',marginRight + 'em');
                }
            }

            //柱状图动画效果
            var tempData = self.data.slice();
            tempData.sort(function(a,b){
                return b.percent - a.percent;
            });
            self.stepHeight = Math.floor(100 / tempData[0].percent);
            var height;
            setTimeout(function(){
                $(container).find('.choice_column_percent').each(function(index,ele){
                    if(self.data[index].percent > 0.05){
                        height = (self.data[index].percent * self.stepHeight) + '%';
                    }else{
                        height = '5%';
                    }
                    $(ele).animate({
                        'height':height
                    },1000);
                    //$(ele).height(data[index].count * 2);
                });
                $(container).find('.choice_column_header').show();
            },500);

            //事件绑定
            var detailData = {
                stuAnswerStat:[]
            };
            for(var i = 0,len = self.data.length;i < len;i++){
                detailData.stuAnswerStat.push({
                    "rightNum":0,
                    "right_userIds":self.data[i].userIds,
                    "wrong_userIds":[],
                    "unfinished_userIds":0,
                    "ref_key":self.data[i].content
                });
            }
            $(container).on('mouseup','.choice_column_bar',function(e){
                e.stopPropagation();
                //ObjectiveQuestionStatistics
                var _module_stat = player.getPlayerServices().getModule('ObjectiveQuestionStatistics');
                var _service_stat = _module_stat._getService();

                //获取点击的柱状图的identifier
                var identifier = $(this).parent().parent().data('identifier');
                //得到这个identifier在data里的index
                var index = -1;

                for(var i = 0,len = self.data.length;i < len;i++){
                    if(identifier == self.data[i].content){
                        index = i;
                        break;
                    }
                }

                var num,content,userIds;
                var info = '<div class="choice_detail_header"><p class="choice_pop_title">';

                if(index < 0){
                    num = 0;
                    content = $(e.target).parent().parent().attr('data-identifier');
                    userIds = [];
                }else{
                    num = self.data[index].count;
                    content = self.data[index].content;
                    userIds = self.data[index].userIds;
                }

                //如果人数为0，则不弹窗
                if(num === 0) return;

                if(content != '未作答'){
                    info += '共<span class="choice_num">' + num + '</span>人选择了选项<span class="choice_option">' + content + "</span></p></div>";
                    //点击显示的选项内容
                    //if(self.questionType == 'choice'){
                    //    info += '</p><div class="choice_question_info">' + identifier +'.' + data[i].info + '</div></div>';
                    //}else{
                    //    info += '</p></div>';
                    //}
                }else{
                    info += '共<span class="choice_num">' + num + '</span>人<span class="choice_option">' + content + "</span></p></div>";
                }


                var $detail = _service_stat.showAnswerDetial();
                var stuList = _service_stat.getOnlineStu(detailData,identifier);
                _service_stat.setStuList($detail,"rightAnswer");
                $detail.statistic_item_content.html('').html(info);

                //去除留白
                /*var h = $detail.statistic_stu_list.height();
                var b = $detail.statistic_stu_list.css("bottom");
                b = parseFloat(b) + h;
                $detail.statistic_item_content.css("bottom",b+"px");
                var sh = $detail.statistic_item_content.children().height();
                $detail.statistic_item_content.parent().height(sh + b);*/
                $detail.statistic_stu_list.parent().removeClass("class_a").addClass("class_a");
            });
        },
        renderMini:function(data,container){
            var self = this;
            var answers = data;
            var $miniArea = $(container);
            var tempAnswer;
            var unfinisedState = this.hasUnfinished(answers);
            var miniHtml = '<div class="choice_mini_wrapper"><ul class="choice_option_list"></ul></div>';
            var options = '';

            if(answers.length > 6 && unfinisedState.hasUnfinished){
                //tempAnswer = answers[unfinisedState.index];
                //answers[unfinisedState.index] = answers[6];
                //answers[6] = tempAnswer;
                tempAnswer = answers[unfinisedState.index];
                answers.splice(unfinisedState.index,1);
                answers.splice(6,0,tempAnswer);
            }

            //如果是多选题，截取前七个显示
            if(this.questionType == 'multiplechoice' && answers.length > 7){
                answers = answers.splice(0,7);
            }

            var len = answers.length;
            for(var i = 0;i < len;i++){
                options += '<li class="choice_option" data-identifier='+ answers[i].content +'><a href="javascript:void(0)" class="choice_hist_a"><span class="choice_order">' + answers[i].content + '</span><p class="choice_desc"><em>' + answers[i].count + '</em>人</p>'  + '</a></li>'
            }

            $miniArea.html(miniHtml);
            $miniArea.find('.choice_option_list').html(options);
            //ul的宽度
            var $optionList = $miniArea.find('.choice_option_list');
            var ulWidth = $miniArea.parent().width() - parseFloat($optionList.css('left')) - parseFloat($optionList.css('right'));
            var optionWidth = ulWidth / 7;
            $(container).find('.choice_option').css('width',optionWidth);
            //如果答案多余7个并且有未作答，则未作答浮动
            if(len > 7){
                //答案大于7个可以拖动
                choiceDragEvent($miniArea.find('.choice_option_list'));
                //有未作答选项则固定未作答位置
                if(unfinisedState.hasUnfinished){
                    var selfWidth = $(container).find('.choice_option').eq(6).width();
                    //var left = $(container).find('.choice_option').eq(7).position().left - selfWidth -self.emSize * 2;
                    //var left = optionWidth * 7 - parseFloat($miniArea.parent().parent().parent().css('padding-left')) + parseFloat($miniArea.css('padding-left')) - parseFloat($miniArea.css('border-left-width')) * 2;
                    // var left = optionWidth * 6 + parseFloat($miniArea.parent().parent().parent().css('padding-left')) + parseFloat($optionList.css('left')) + parseFloat($miniArea.css('border-left-width')) - 0.5*self.emSize;
                    $(container).find('.choice_option').eq(6).addClass('unfinished')
                    //.css({
                    //     'left':left,
                    //     'width':optionWidth + self.emSize
                    // });
                    var marginRight = Number(15.7) + Number((selfWidth / self.emSize).toFixed(2));
                    $(container).find('.choice_option').eq(len - 1).css('margin-right',Number((optionWidth / self.emSize).toFixed(2)) + 'em');
                }
            }

            this.miniAnswers = answers;
        },
        hasUnfinished:function(data){
            var hasUnfinished = false,index = -1;

            for(var i = 0,len = data.length;i < len;i++){
                if(data[i].content == '未作答'){
                    hasUnfinished = true;
                    index = i;
                    break;
                }
            }

            return {hasUnfinished:hasUnfinished,index:index};
        },
        //滚动到答案位置
        gotoCorrectAnswer:function(){

        },
        //释放渲染占用的对象
        dispose:function(){
            this.i18nModel = null;
            this.statObj = null;
            $(this.detailArea).find('.choice_column_bar').off();
            this.detailArea = null;
            this.data = null;
            this.miniArea = null;
            this.miniWidth = null;
            this.columnWidth = null;
            this.columnDistance = null;
            //用于详细统计的数据
            this.answers = null;
            //mini统计的数据
            this.miniAnswers = null;
            this.questionType = null;
            this.stepHeight = null;
            this.emSize = null;
        }
    };

    //左右拖动事件
    function choiceDragEvent(element){
        var x, y,xOld,yOld,xDiff,pos,curTarget;
        var isMouseDown = false,
            startTime = null,
            originalTarget= null,
            originalEvent = null;

        $(element).on('mousedown touchstart',function(e){
            console.log('test:',e);
            isMouseDown = true;
            pos = getCurPos(e);
            xOld = pos.x;
            yOld = pos.y;
            startTime = new Date().getTime();
            originalTarget = e.target;
            originalEvent = e.type;
            console.log('originalTarget:',originalTarget);
            console.log('originalEvent:',originalEvent);

            $('body').find('.statistic_choice_mask').off('mousemove touchmove mouseup touchend').remove();
            //添加一个遮罩层用于监听事件
            var $mask = $('<div class="statistic_choice_mask"></div>');
            var style = {
                'position':'absolute',
                'z-index':100000,
                'top':0,
                'left':0,
                'width':'100%',
                'height':'100%'
            };
            $mask.css(style);
            $('body').append($mask);
            $mask.on('mousemove touchmove',function(e){
                if(!isMouseDown){
                    return;
                }
                pos = getCurPos(e);
                x = pos.x;
                y = pos.y;
                xDiff = x - xOld;

                $(element)[0].scrollLeft -= xDiff;
                xOld = x;
                yOld = y;
            });
            $mask.on('mouseup touchend',function(e){
                var now = new Date().getTime();
                $(this).off('mousemove touchmove mouseup touchend').remove();
                if(now - startTime > 300){
                    e.stopPropagation();
                }
                if(now - startTime < 300){
                    console.log('点击事件');
                    $(originalTarget).trigger('mouseup');
                }
                isMouseDown = false;
                xOld = null;
                yOld = null;
            });
        });
    }

    function getCurPos(e){
        var eventType = e.type;
        var pos = {};

        switch(eventType){
            case 'mousedown':
            case 'mousemove':
                pos.x = e.clientX;
                pos.y = e.clientY;
                break;
            case 'touchstart':
                pos.x = e.originalEvent.touches[0].clientX;
                pos.y = e.originalEvent.touches[0].clientY;
                break;
            case 'touchmove':
                pos.x = e.originalEvent.changedTouches[0].clientX;
                pos.y = e.originalEvent.changedTouches[0].clientY;
                break;
        }

        return pos;
    }


    namespace.choiceStatRender = new Render();
})(window.__StatisticsRender || (window.__StatisticsRender = {}));