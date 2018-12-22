/**
 * author:付君春
 * 2015/12/9
 * version:1.0.0
 *
 * options:{
 *     timerType:sequence countdown,
 *     timeLimit:60,
 *     timeoutCallback:function(){},
 *     clickCallback:function(){}
 * }
 */

function PPTShellBtn(container,options){
    this.container = $(container);
    this.options = options;
    this.spendTime = 0;
    this.init();
}

PPTShellBtn.prototype = {
    //初始化
    init:function(){
        this.createHtml();
        this.clickEventBind();
        this.startTimer();
    },
    //生成视图html代码
    createHtml:function(){
        var btnBox = this.container.find('div.pptshell_btn');
        var startTime= this.initTime();
        if(btnBox.length === 0){
            this.container.append('<div class="pptshell_btn"><a href="#" class="btn_submit" data-action="submit"><span>提交</span><span class="min">' + startTime.min + '</span>:<span class="sec">' + startTime.sec + '</span></a></div>')
        }
    },
    //初始化时间
    initTime:function(){
        var type = this.options.timerType;
        var timeLimit = this.options.timeLimit;
        console.log(this.options.timeLimit);
        return type === 'sequence' ? {min:'00',sec:'00'} : this.formatTime(timeLimit);
    },
    //设置时间
    showTime:function(time){
        this.container.find('.pptshell_btn .min').text(time.min);
        this.container.find('.pptshell_btn .sec').text(time.sec);
    },
    //开始计时
    startTimer:function(){
        var self = this;
        var type = this.options.timerType;
        var leftTime = this.options.timeLimit;
        this.intervaler = setInterval(function(){
            self.spendTime++;
            if(type == 'sequence'){
                self.showTime(self.formatTime(self.spendTime));
            }else{
                leftTime = self.options.timeLimit - self.spendTime;
                self.showTime(self.formatTime(leftTime));

                if(leftTime <= 0){
                    clearInterval(self.intervaler);
                    self.stopTimer();
                    if(self.options.timeoutCallback && $.isFunction(self.options.timeoutCallback)){
                        self.options.timeoutCallback(self.spendTime);
                    }
                }
            }
        },1000);
    },
    //停止计时
    stopTimer:function(){
        if(this.intervaler){
            clearInterval(this.intervaler);
        }
    },
    //重新计时
    restartTimer:function(){
        if(this.intervaler){
            clearInterval(this.intervaler);
        }

        this.spendTime = 0;
        this.startTimer();
    },
    //时间格式化
    formatTime:function(seconds){
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;

        min = min > 9 ? min : '0' + min;
        sec = sec > 9 ? sec : '0' + sec;

        return {"min":min,"sec":sec}
    },
    //点击事件绑定
    clickEventBind:function(){
        var self = this;
        var isMouseDown = false;
        var isAllowSubmit = true;
        this.container.find('.btn_submit').on('mousedown touchstart',function(e){
            e.preventDefault();
            if(isAllowSubmit){
                isMouseDown = true;
            }
        }).on('mouseup touchend',function(e){
            e.preventDefault();
            e.stopPropagation();
            var action = $(this).attr('data-action');
            if(isMouseDown){
                if(self.options.clickCallback && $.isFunction(self.options.clickCallback)){
                    self.options.clickCallback(action);
                }
            }

            isMouseDown = false;
            isAllowSubmit = false;
            setTimeout(function(){
                isAllowSubmit = true;
            },1000);
        });
    },
    //切换显示视图
    toggleView:function(){
        var btn = this.container.find('.btn_submit');
        var startTime = this.initTime();
        if(btn.find('.min').length == 0){
            btn.attr('data-action','submit').html('<span>提交</span><span class="min">' + startTime.min + '</span>:<span class="sec">' + startTime.sec + '</span>').attr('data-action','do');
            this.restartTimer();
        }else{
            this.stopTimer();
            btn.empty().attr('data-action','redo').text('重新作答');
        }
    },
    //显示时间界面并初始化
    showTimerBtnView:function(){
        var btn = this.container.find('.btn_submit');
        var startTime = this.initTime();
        btn.attr('data-action','submit').html('<span>提交</span><span class="min">' + startTime.min + '</span>:<span class="sec">' + startTime.sec + '</span>').attr('data-action','do');
        this.restartTimer();
    },
    //销毁
    onDestory:function(){
        this.options = null;
        this.container.find('.btn_submit').off('click');
        if(this.intervaler){
            clearInterval(this.intervaler);
        }
    }
};
