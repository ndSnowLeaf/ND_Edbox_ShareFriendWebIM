import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props:{
        questions:Array,
        lang: Object
    }
})
export default class CompoundAnswerDetail extends Vue{

    lang: any
    questions:Array<any>

    //生命周期
    mounted(){//挂载完成
        this.internationalization();
        this.initArrowDisplay();
    }

    //私有方法
    private initArrowDisplay(){
        var $view = $(this.$el);
        var arrowRight = $view.find("a.column_arrow_right"),
            answers = this.questions;
        if($.isArray(answers) && answers.length>8){
            arrowRight.removeClass("js_arrow_hide");
        }
    }

    //国际化
    internationalization(){
        var lang = this.lang;

        var langObj = {
            tag : lang.tag?lang.tag:"注：主观类题目无法统计正确率，此表中显示数值为已作答人数的比例",
            answerDetail: lang.answerDetail?lang.answerDetail:"答题详情统计"
        };

        var regStart = /^lang_/;
        var regEnd = /_ig\d+$/;
        var key;
        for(var k in this.$refs){
            key = k.replace(regStart,'').replace(regEnd,'');
            if(this.$refs[k] instanceof Array){//若为数组
                for(var i=0,len=this.$refs[k]['length']; i<len; i++){
                    if(key && langObj[key]){
                        this.$refs[k][i]["innerHTML"] = langObj[key];
                    }
                }
            } else {
                if(key && langObj[key]){
                    this.$refs[k]["innerHTML"] = langObj[key];
                }
            }
        }
    }
    
    //事件
    /**点击柱状图 */
    clickItem(question){
        this.$emit("clickitem",question);
    }

    /**移动柱状图 */
    onScroll(ev){
        var ts = ev.currentTarget;
        var scrollLeft = ts.scrollLeft,
            scrollWidth = ts.scrollWidth,
            containerWidth = $(ts).width(),
            ignore = 10,
            $parent = $(ts).parent(),
            arrowLeft = $parent.find("a.column_arrow_left"),
            arrowRight = $parent.find("a.column_arrow_right");
            if(scrollLeft <= ignore){//判定为在最左侧
                arrowLeft.addClass("js_arrow_hide");
                arrowRight.removeClass("js_arrow_hide");
            }else if(scrollLeft>=(scrollWidth-containerWidth-ignore)){//判定为最右侧
                arrowLeft.removeClass("js_arrow_hide");
                arrowRight.addClass("js_arrow_hide");
            }else{
                arrowLeft.removeClass("js_arrow_hide");
                arrowRight.removeClass("js_arrow_hide");
            }
    }

    /** 点击箭头 */
    moveHistogram(ev,dire){
        var $view = $(this.$el);
        var $content = $view.find('.column_container');
        var $li = $content.find(".column_single");
        var width = 8*($li.width() + parseFloat($li.css("margin-right")));
        var offset = $content.scrollLeft();
        offset = offset + (dire === 'left' ? -width : width);
        $content.animate({scrollLeft:offset},350);
    }

}