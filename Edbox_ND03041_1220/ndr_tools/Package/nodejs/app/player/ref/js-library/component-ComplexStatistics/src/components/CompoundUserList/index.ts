import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props: {
        showingfilter:String,
        students:Array,
        lang:Object
    }
})
export default class CompoundUserList extends Vue{

    lang: any
    showingfilter:String
    mShowingfilter:String = 'all'

    //国际化
    internationalization(){
        var lang = this.lang;

        var langObj = {
            name : lang.name?lang.name:"姓&nbsp;&nbsp;&nbsp;名",
            accuracy : lang.accuracy?lang.accuracy:"正确率",
            spend : lang.spend?lang.spend:"耗&nbsp;&nbsp;&nbsp;时",
            operation : lang.operation?lang.operation:"操&nbsp;&nbsp;&nbsp;作",
            all : lang.all?lang.all:"全部",
            right : lang.right?lang.right:"全对",
            wrong : lang.wrong?lang.wrong:"错误",
            noAnswer : lang.noAnswer?lang.noAnswer:"未作答",
            hideList : lang.hideList?lang.hideList:"收起名单",
            seeDetail : lang.seeDetail?lang.seeDetail:"查看详情",
            minute : lang.minute?lang.minute:"分",
            second : lang.second?lang.second:"秒"
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

    mounted(){
        this.internationalization();
    }

    //method
    detail(ev,userid){
        var $parent = $(ev.currentTarget).closest("li.mixmodule_list_td");
        if($parent.is(".noanswer")){
            return;
        }
        //拿到userid后，往上层发送
        this.$emit("detail",userid);
    }

    toggleUserList(ev,type){
        // var $this = $(ev.currentTarget);
        // if ($this.hasClass('on')) return;
        // $this.addClass('on').siblings().removeClass('on');
        // var $item = $(this.$el).find('.mixmodule_list_body').children();
        // if (index === 0) {
        //     $item.show();
        // } else {
        //     $item.hide().eq(index - 1).show();
        // }
        const $this = $(ev.currentTarget);

        if ($this.hasClass('on')) return;
        this.mShowingfilter = type;

        const $userlist = $(this.$refs['userlist']);
        if(type == 'all'){
            $userlist.find('>li').show();
        }else{
            $userlist.find('>li').hide();
            $userlist.find('>li.'+type).show();
        }
        this.$emit('clicktab',type);
    }

    hideuser(){
        this.$emit("toggleuserlist");
    }
}