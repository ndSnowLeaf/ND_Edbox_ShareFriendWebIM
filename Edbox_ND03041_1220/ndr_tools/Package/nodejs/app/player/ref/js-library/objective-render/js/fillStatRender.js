/**
 * Created by Administrator on 2016/1/18.
 */
(function(namespace) {

    /*var rightStu = [],wrongStu = [],unfinishedStu = [],curStuList = [];
    var currentStudent = [];
    var stuList = {
        rightStu:[],
        wrongStu:[],
        unfinishedStu:[],
        curStuList:[]
    };*/

    var _self;

    function Render(){
        this.dealQuestionList = [
            'guessword',
            'compare',
            'imagemark',
            'arithmetic',
            'magicbox',
            'fillblank',
            'table',
            'wordpuzzles',
            'textentry',
            'match',
            'classified',
            'markpoint'
        
        ];
        this.statObj = null;
        this.miniArea = null;
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
                //如果存在选择类型的统计处理
                if(window.__questionStatObjects.fillStatistics){
                    self.detialArea = detialArea;
                    self.miniArea = miniArea;
                    self.statObj = window.__questionStatObjects.fillStatistics;
                    self.i18nModel = i18nModel;
                    var deffer = self.statObj.init(answerData);
                    //统计完成后渲染
                    self.renderStatPanel(detialArea,miniArea,header);
                    deffer.resolve(self.statObj.convertedData);
                    return deffer;
                }
            }
        },
        //渲染统计面板
        renderStatPanel:function($detialArea,$miniArea,$header){

            var self = this;
            self.miniArea = $miniArea;
            var convertedData = self.statObj.convertedData;
            var $ul, i, $miniUl;

            //渲染头部信息
            if($header && convertedData){
                var spendTime = convertedData.spend_time;
                if(spendTime && (typeof spendTime) == "number"){
                    var min = Math.floor(spendTime/60);
                    var sec = spendTime%60;
                    $header.find(".spend_time .time_m em").html(min);
                    $header.find(".spend_time .time_s em").html(sec);
                }
                $header.find(".submitCount .num").html((typeof convertedData.submit_count)=="number"?convertedData.submit_count:"");
            }


            //渲染统计
            if(convertedData && $detialArea && $miniArea){

                $detialArea.find(".rp-ul").children().off("click");
                $miniArea.find(".fill-mini-ul").children().off("click");
                $detialArea.empty();
                $miniArea.empty();

                var panelWidth = $miniArea.parent().width();
                var liWidth = (panelWidth+20)/ 7,miniUlWidth = 0;

                var detialHtml,$detialHtml;

                if(convertedData.percent && convertedData.item_key && $.isArray(convertedData.percent) && convertedData.percent.length == convertedData.item_key.length){
                    detialHtml = '<div class="fill-detial-area"><ul class="rp-ul"></ul></div>';
                    $detialHtml = $(detialHtml);
                    $ul = $detialHtml.find(".rp-ul");
                    $miniUl = $("<div class='fill-mini-area'><ul class='fill-mini-ul' style='left: 0'></ul></div>");

                    if(convertedData["unfinishedNum"] > 0){//如果未作答人数为0,在尾部加上未作答项
                        convertedData.item_key.push("unfinish");
                        var unfn = convertedData["unfinishedNum"];
                        var unfnp = (convertedData["submit_count"] > 0) ? (unfn / convertedData["submit_count"]).toFixed(2) : 0;
                        convertedData.percent.push(unfnp);//
                    }


                    var $li,key,value, c,mini_c,$miniLi,tmpHtml;
                    for(i=0; i<convertedData.item_key.length; i++){
                        if((typeof convertedData.item_key[i]) == "number"){
                            key = convertedData.item_key[i];
                            //value = (convertedData.percent[i]*100*100)/100;
                            value = parseFloat((convertedData.percent[i]*100).toFixed(2));
                            c = value<30?"fill-detial-rp-li hist_list color-red":"fill-detial-rp-li hist_list";
                            mini_c = value<30?"fill-mini-li hist_list color-red":"fill-mini-li hist_list";

                        }else if(convertedData.item_key[i] == "unfinish"){
                            key = "未答题";
                            //value = (convertedData.percent[i]*100*100)/100;
                            value = parseFloat((convertedData.percent[i]*100).toFixed(2));
                            c = "fill-detial-rp-li hist_list noanswer";
                            mini_c = "fill-mini-li hist_list noanswer";
                        }

                        tmpHtml = "<a class='hist_a'><span class='letter'></span><span class='text'><em></em>%</span></a>";
                        $li = $("<li class='"+c+"'></li>");//详细统计项
                        $li.append(tmpHtml);
                        $li.find("span.letter").html(key);
                        $li.find("span.text em").html(value);

                        $miniLi = $("<li class='"+mini_c+"' style='width: "+liWidth+"px;'></li>");//mini统计项
                        $miniLi.append(tmpHtml);
                        $miniLi.find("span.letter").html(key);
                        $miniLi.find("span.text em").html(value);

                        $li.attr("item-key",convertedData.item_key[i]);
                        $miniLi.attr("item-key",convertedData.item_key[i]);
                        if(convertedData.item_key[i] == "unfinish"){
                            $miniLi.addClass("noanswer");
                        }
                        //详细统计项事件绑定
                        (function(key){
                            $li.find("a.hist_a").on("click",function(ev){
                                var key = $(this).parent().attr("item-key");
                                self.buildAnswerDetialDialog(key);
                                ev.stopPropagation();
                            });
                            /*$miniLi.find("a.hist_a").on("mousedown",function(ev){
                                var key = $(this).parent().attr("item-key");
                                //self.buildAnswerDetialDialog(key);
                                $(this).parent().parent().attr("click-item-key",key);
                                //ev.stopPropagation();
                            });*/
                        })(key);

                        $ul.append($li);
                        $miniUl.find(".fill-mini-ul").append($miniLi);
                    }

                    miniUlWidth = liWidth*convertedData.percent.length;

                    $miniUl.find(".fill-mini-ul").off("mousedown touchstart");
                    //if(miniUlWidth > panelWidth){
                        $miniUl.find(".fill-mini-ul").on("mousedown touchstart",handleMiniDragStart);
                    //}
                    //$miniUl.find(".fill-mini-ul").css({"width":miniUlWidth+"px","position":"relative"});
                    $detialArea.append($detialHtml);
                    $miniArea.append($miniUl);

                    var mb = $li.css("margin-bottom");
                    mb = parseFloat(mb)+2;
                    var ih = $li.height()>0?$li.height():38;
                    var mh = (mb+ih)*2;
                    if($ul.children().length <= 20){
                        $ul.css({"max-height":mh+"px","overflow":"hidden"});
                    }else{
                        $ul.css({"max-height":mh+"px","overflow":"auto"});
                    }

                }else{//字谜游戏数据结构不一样，分横向和纵向，单独处理
                    var $miniHtml = $("<div class='fill-mini-area'></div>");
                    detialHtml = '<div class="fill-detial-area"></div>';
                    $detialHtml = $(detialHtml);
                    var row,tmpHtml;
                    tmpHtml = "<a class='hist_a'><span class='letter'></span><span class='text'><em></em>%</span></a>";


                    for(row in convertedData.item_key){
                        if(convertedData.percent[row]){
                            var $li,key,value, c,mini_c,$miniLi,$mul;
                            $ul = $('<ul class="rp-ul"></ul>');
                            $mul = $("<ul class='fill-mini-ul'></ul>");


                            for(i=0; i<convertedData.item_key[row].length; i++){
                                if((typeof convertedData.item_key[row][i]) == "number"){
                                    key = convertedData.item_key[row][i];
                                    //value = (convertedData.percent[row][i]*100*100)/100;
                                    value = parseFloat((convertedData.percent[row][i]*100).toFixed(2));
                                    c = value<30?"fill-detial-rp-li color-red":"fill-detial-rp-li";
                                    mini_c = value<30?"fill-mini-li hist_list color-red":"fill-mini-li hist_list";
                                }else if(convertedData.item_key[row][i] == "unfinish"){
                                    continue;
                                }

                                $li = $("<li class='"+c+"'></li>");//详细统计项
                                $li.append(tmpHtml);
                                $li.find("span.letter").html(key);
                                $li.find("span.text em").html(value);

                                $miniLi = $("<li class='"+mini_c+"' style='width: "+liWidth+"px;'></li>");//mini统计项
                                $miniLi.append(tmpHtml);
                                $miniLi.find("span.letter").html(key);
                                $miniLi.find("span.text em").html(value);

                                $li.attr("item-key",convertedData.item_key[row][i]);
                                $miniLi.attr("item-key",convertedData.item_key[row][i]);
                                //详细统计项事件绑定
                                (function(key,attr){
                                    $li.find("a.hist_a").on("click",function(ev){
                                        var key = $(this).parent().attr("item-key");
                                        self.buildAnswerDetialDialog(key,attr);
                                        ev.stopPropagation();
                                    });
                                    /*$miniLi.find("a.hist_a").on("mousedown",function(ev){
                                        var key = $(this).parent().attr("item-key");
                                        //self.buildAnswerDetialDialog(key,attr);
                                        $(this).parent().parent().attr("click-item-key",key);
                                        //ev.stopPropagation();
                                    });*/
                                })(key,row);

                                $ul.append($li);
                                $mul.append($miniLi);
                            }
                            miniUlWidth = liWidth*convertedData.percent[row].length + 100;
                            $mul.off("mousedown touchstart");
                            //if(miniUlWidth > panelWidth){
                                $mul.on("mousedown touchstart",handleMiniDragStart);
                            //}

                            if(row == "h"){
                                //$ul.addClass("rp-ul-h").prepend('横向：');
                                $mul.addClass("rp-ul-h").prepend(self.i18nModel['horizontal'] +'：');
                            }else if(row == "v"){
                                //$ul.addClass("rp-ul-v").prepend('纵向：');
                                $mul.addClass("rp-ul-v").prepend(self.i18nModel['vertical'] +'：');
                            }
                            //$mul.css({"width":miniUlWidth+"px","position":"relative"});
                            $miniHtml.append($mul);
                            $detialHtml.append($ul);
                            if(row == "h"){
                                $ul.addClass("rp-ul-h").before(self.i18nModel['horizontal'] +'：');
                                //$mul.addClass("rp-ul-h").prepend('横向：');
                            }else if(row == "v"){
                                $ul.addClass("rp-ul-v").before(self.i18nModel['vertical'] +'：');
                                //$mul.addClass("rp-ul-v").prepend('纵向：');
                            }

                        }
                    }

                    $miniHtml.find(".fill-mini-ul").off("mousedown touchstart");
                    //if(miniUlWidth > panelWidth){
                        $miniHtml.find(".fill-mini-ul").on("mousedown touchstart",handleMiniDragStart);
                    //}

                    //若存在未作答，则未作答
                    if(convertedData["unfinishedNum"] > 0){
                        var unfn = convertedData["unfinishedNum"];
                        var unfnp = (convertedData["submit_count"] > 0) ? (unfn / convertedData["submit_count"]).toFixed(2) : 0;
                        //unfnp = (unfnp*100*100)/100;
                        unfnp = parseFloat((unfnp*100).toFixed(2));

                        $li = $("<li class='fill-detial-rp-li noanswer'></li>");
                        $li.append(tmpHtml);
                        $li.find("span.letter").html(self.i18nModel['do_not_answer_2']);
                        $li.find("span.text em").html(unfnp);
                        $miniLi = $("<li class='fill-mini-li noanswer' style='width: "+liWidth+"px;'></li>");//mini统计项
                        $miniLi.append(tmpHtml);
                        $miniLi.find("span.letter").html(self.i18nModel['do_not_answer_2']);
                        $miniLi.find("span.text em").html(unfnp);
                        $li.attr("item-key","unfinish");
                        $miniLi.attr("item-key","unfinish");
                        $ul = $('<ul class="rp-ul"></ul>');
                        $mul = $("<ul class='fill-mini-ul'></ul>");
                        $mul.append($miniLi);
                        //$mul.css({"width":miniUlWidth+"px","position":"relative"});
                        $ul.append($li);
                        $detialHtml.append($ul);
                        $miniHtml.append($mul);

                        $li.find("a.hist_a").on("click",function(ev){
                            var key = $(this).parent().attr("item-key");
                            self.buildAnswerDetialDialog(key);
                            ev.stopPropagation();
                        });
                        /*$miniLi.find("a.hist_a").on("mousedown",function(ev){
                            var key = $(this).parent().attr("item-key");
                            self.buildAnswerDetialDialog(key);
                            ev.stopPropagation();
                        });*/
                    }

                    $detialArea.append($detialHtml);
                    $miniArea.append($miniHtml);

                    var mb = $li.css("margin-bottom");
                    mb = parseFloat(mb)+2;
                    var ih = $li.height()>0?$li.height():38;
                    var mh = (mb+ih)*2;
                    $detialHtml.find("ul.rp-ul").css({"max-height":mh+"px"});
                }
            }
        },
        buildAnswerDetialDialog:function(key,attr){//构造做题情况对话框
            var self = this;
            var data  = self.statObj.convertedData;

            //检验是否需要显示
            var i,index = -1,item_key,stuAnswerStat;
            if(!attr){//非字谜游戏
                item_key = data.item_key;
                stuAnswerStat = data.stuAnswerStat;
            }else{
                item_key = data.item_key[attr];
                stuAnswerStat = data.stuAnswerStat[attr];
            }
            for(i=0; i<item_key.length; i++){
                if(key == item_key[i]){
                    index = i;
                    break;
                }
            }
            if(index != -1 && stuAnswerStat){
                if(index < stuAnswerStat.length){
                    var right_userIds = stuAnswerStat[index].right_userIds;
                    var wrong_userIds = stuAnswerStat[index].wrong_userIds;
                    if(right_userIds && right_userIds.length == 0 && wrong_userIds && wrong_userIds.length == 0){
                        return;
                    }
                }
            }

            var oqs = player.getPlayerServices().getModule('ObjectiveQuestionStatistics');
            if(oqs && oqs._getService){
                var service = oqs._getService();

                var views = service.showAnswerDetial();

                var stuList = service.getOnlineStu(data,key,attr);

                var $statistic_item_content = views.statistic_item_content;
                $statistic_item_content.find("li").off("click");
                $statistic_item_content.empty();

                var $statistic_stu_list = views.statistic_stu_list;
                $statistic_stu_list.empty();
                $statistic_stu_list.attr("show-type-tab","rightAnswer");//首次切换到答对标签

                //设置答对的学生列表
                var isSet = false;
                var currentType = "";
                if(stuList.rightStu && stuList.rightStu.length>0 && !isSet){
                    service.setStuList(views,"rightAnswer");
                    currentType = "rightAnswer";
                    isSet == true;
                }else if(stuList.wrongStu && stuList.wrongStu.length>0 && !isSet){
                    service.setStuList(views,"wrongAnswer");
                    currentType = "wrongAnswer";
                    isSet == true;
                }else if(stuList.unfinishedStu && stuList.unfinishedStu.length>0 && !isSet && key == "unfinish"){
                    service.setStuList(views,"unfinished");
                    currentType = "unfinished";
                    isSet == true;
                }

                var h = $statistic_stu_list.height();
                var b = $statistic_stu_list.css("bottom");
                b = parseFloat(b) + h-1;
                //$statistic_item_content.css("bottom",b+"px");

                //填空类要顶部为标签
                var html = "<ul class='tabbox'>" +
                    "<li type-tab='rightAnswer'><a class='tabbox_a'>" + self.i18nModel['answer_correct'] + "</a></li>" +
                    "<li type-tab='wrongAnswer'><a class='tabbox_a'>" + self.i18nModel['answer_wrong'] + "</a></li>" +
                    "<li type-tab='unfinished'><a class='tabbox_a'>" + self.i18nModel['do_not_answer_1'] + "</a></li>" +
                    "</ul>";
                var $tabs = $(html);
                if(key != "unfinish"){
                    $tabs.find(">li[type-tab=unfinished]").addClass("invisible");
                }
                $statistic_item_content.append($tabs);
                $tabs.find("li").each(function(){
                    var type = $(this).attr("type-tab");
                    if(currentType == type){
                        $(this).addClass("tab-on");
                    }
                    if(type == "rightAnswer" && stuList.rightStu && stuList.rightStu.length==0){
                        $(this).addClass("invisible");
                    }else if(type == "wrongAnswer" && stuList.wrongStu && stuList.wrongStu.length==0){
                        $(this).addClass("invisible");
                    }else if(type == "unfinished" && stuList.unfinishedStu && stuList.unfinishedStu.length==0){
                        $(this).addClass("invisible");
                    }
                }).on("click",function(){
                    var type = $(this).attr("type-tab");
                    if(type == "rightAnswer"){
                        service.setStuList(views,"rightAnswer");
                    }else if(type == "wrongAnswer"){
                        service.setStuList(views,"wrongAnswer");
                    }else if(type == "unfinished"){
                        service.setStuList(views,"unfinished");
                    }
                    $(this).addClass("tab-on");
                    $(this).siblings("li").removeClass("tab-on");
                });

                //去除留白
                var tabheight = $tabs.height()>0?$tabs.height():38;
                //$statistic_item_content.parent().height(b+tabheight);
            }
        },
        //显示完整统计
        showFullPanel:function(){

        },
        //显示mini统计
        showMinPanel:function(){

        },
        //释放渲染占用的对象
        dispose:function(){
            this.statObj = null;
            //namespace.fillStatRender = null;
        },
        getFillView: function() {
            return this.detialArea;
        },
        scroll2Row: function(rowIndex) {
            var wrapper = this.detialArea.find(".rp-ul");
            var rowHeight = parseFloat(wrapper.css('max-height')) / 2;
            wrapper.scrollTop(rowHeight * rowIndex);
        },
        scroll2Column: function(columnIndex,direction) {
            var c = ".fill-mini-ul";
            if(direction){
                if(direction == "h"){
                    c = ".rp-ul-h";
                }else if(direction == "v"){
                    c = ".rp-ul-v";
                }
            }
            var $wrapper = this.miniArea.find(".fill-mini-area");
            var wrapperWidth = $wrapper.width();
            var $ul = $wrapper.find(c);
            var $item = $ul.find("li");
            var itemWidth = $item.width();
            /*var aimLeft = columnIndex * itemWidth;
            var left = wrapperWidth - aimLeft;
            $ul.scrollLeft(-left);*/

            //修复bug#39268，#38978
            var count = $ul.children().length;
            var left = 0;
            if(columnIndex <= 4){
                left = 0;
            }else if(columnIndex >= 5 && columnIndex <= count-3){
                left = itemWidth*(columnIndex-4);
            }else if(columnIndex > count-3 && columnIndex <= count){
                left = itemWidth*(columnIndex-7);
            }
            $ul.scrollLeft(left);
        },
        gotoIndex: function(index, direction) {
            var self = this;
            var oqs = player.getPlayerServices().getModule('ObjectiveQuestionStatistics');
            var currentMode = 'detial';
            if (oqs && oqs._getService){
                if (oqs._getService().getCurrentStatus) {
                    currentMode = oqs._getService().getCurrentStatus();
                }
                if (currentMode === 'show-mini') {
                    currentMode = 'mini';
                }
            }
            var modes = {
                detail: {
                    parent: this.detialArea,
                    klass: '.rp-ul',
                    vhbaseklass: '.rp-ul',
                    itemClass: '.fill-detial-rp-li',
                    mode: 'detail'
                },
                mini: {
                    parent: this.miniArea,
                    klass: '.fill-mini-ul',
                    vhbaseklass: '.rp-ul',
                    itemClass: '.fill-mini-li',
                    mode: 'mini'
                }
            };
            $.each(modes, function(k, item) {
                var parent = item.parent;
                var klass = item.klass;
                var itemClass = item.itemClass;
                var mode = item.mode;
                var vhbaseklass = item.vhbaseklass;
                var innerIndex = index;
                parent.find(klass).find(itemClass).removeClass('select');
                if (innerIndex >= 0) {
                    if (direction === 'h') {
                        klass = vhbaseklass + '-h';
                    } else if (direction === 'v') {
                        klass = vhbaseklass + '-v';
                    }
                    $(parent.find(klass).find(itemClass)[index]).addClass('select');
                }
                innerIndex = parseInt(innerIndex);
                if (innerIndex < 0) {
                    innerIndex = 0;
                }
                if (mode === 'mini' && currentMode === 'mini') {
                    self.scroll2Column(innerIndex + 1,direction);
                } else {
                    var rowIndex = Math.floor(innerIndex / 10);
                    self.scroll2Row(rowIndex);
                }
            });
        }
    };

    function handleMiniDragStart(ev){
        console.log("handleMiniDragStart",ev);
        var $target = $(ev.currentTarget);
        switch (ev.type){
            case "mousedown":
            case "touchstart":
                var left = $target.scrollLeft();
                $target.attr("drag-start-X",ev.clientX);
                $target.attr("drag-start-left",left);
                $target.attr("timestamp",new Date().valueOf());
                $target.attr("dragging",true);

                var shadowClass = "newstatistics-shadow";
                $("body").find(".newstatistics-shadow").off("mousemove mouseup").remove();
                var $shadow = $("<div class='"+shadowClass+"'></div>");
                var style = {
                    "position":"absolute",
                    "left":"0",
                    "top":"0",
                    "width":"100%",
                    "height":"100%",
                    "background-color":"transparent",
                    "z-index":"100000"
                };
                $shadow.css(style);
                $("body").append($shadow);
                $shadow.on("mousemove mouseup",handleDragMove);
                ev.stopPropagation();
                break;
            default :
                break;
        }
    }

    function handleDragMove(ev){
        var miniArea = namespace.fillStatRender.miniArea;
        if(!miniArea){
            return;
        }
        var $target = miniArea.find(".fill-mini-ul[dragging=true]");
        if(!$target){
            return;
        }
        if($target.css("display") != "block"){
            return;
        }
        switch (ev.type){
            case "mousemove":
            case "touchmove":
                var dragging = $target.attr("dragging");
                if (dragging == "true") {
                    var top = $target.offset().top;
                    var bottom = $target.height() + top;
                    var y = ev.clientY;
                    $target.attr("dragging", true);
                    var left = $target.attr("drag-start-left");
                    left = parseInt(left);
                    var x = ev.clientX;
                    var startX = $target.attr("drag-start-X");
                    startX = parseInt(startX);
                    var dif = startX - x;
                    left = left + dif;
                    $target.scrollLeft(left);
                    if($target.is(".rp-ul-h")){
                        $target.siblings(".rp-ul-v").scrollLeft(left);
                    }else if($target.is(".rp-ul-v")){
                        $target.siblings(".rp-ul-h").scrollLeft(left);
                    }
                }
                break;
            case "mouseup":
            case "touchend":
                ev.stopPropagation();
                var dragging = $target.attr("dragging");
                var timestamp = $target.attr("timestamp");
                timestamp = parseInt(timestamp);
                var now = new Date().valueOf();
                if (now - timestamp < 180) {//150ms视为点击
                    $target.attr("dragging", false);
                    $("body").find(".newstatistics-shadow").off("mousemove mouseup").remove();
                    var clickItemKey = $target.attr("click-item-key");
                    if(clickItemKey){
                        _self.buildAnswerDetialDialog(clickItemKey);
                        $target.removeAttr("click-item-key");
                        break;
                    }
                    var oqs = player.getPlayerServices().getModule('ObjectiveQuestionStatistics');
                    if(oqs && oqs._getService){
                        oqs._getService().showDetialStatistics();
                    }
                    console.log("200ms视为点击");

                    break;
                }
                if (dragging == "true") {
                    var top = $target.offset().top;
                    var bottom = $target.height() + top;
                    var y = ev.clientY;
                    var left = $target.attr("drag-start-left");
                    left = parseInt(left);
                    var x = ev.clientX;
                    var startX = $target.attr("drag-start-X");
                    startX = parseInt(startX);
                    var dif = startX - x;
                    left = left + dif;
                    if (left < 0) {
                        left = 0;
                    } else {
                        var w = $target.width();
                        var pw = $target.parent().width();
                        if (w > pw && left > (pw - w)) {
                            left = (pw - w);
                        }
                    }
                    $target.scrollLeft(left);
                    $target.attr("dragging", false);
                }
                $("body").find(".newstatistics-shadow").off("mousemove mouseup").remove();
                break;
            default :
                break;
        }
    }

    namespace.fillStatRender = new Render();
    _self = namespace.fillStatRender;
})(window.__StatisticsRender || (window.__StatisticsRender = {}));
