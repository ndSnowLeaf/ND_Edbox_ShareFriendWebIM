import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props:{
        showingfilter:String,
        students:Array,
        lang:Object
    }
})
export default class RoleReadUserList extends Vue{

    lang:any
    showingfilter:String
    mShowingfilter:String = 'all'

    //国际化
    internationalization(){
        const lang = this.lang;

        const langObj = {
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

        const regStart = /^lang_/;
        const regEnd = /_ig\d+$/;
        let key;
        for(let k in this.$refs){
            key = k.replace(regStart,'').replace(regEnd,'');
            if(key && langObj[key]){
                this.$refs[k]["innerHTML"] = langObj[key];
            }
        }
    }

    mounted(){
        this.internationalization();
    }

    //method
    //查看详情
    detail(ev,index,userid){
        const $parent = $(ev.currentTarget).closest("li.role_reading_list_td");
        if($parent.is(".noanswer")){
            return;
        }
        //拿到userid后，往上层发送
        this.$emit("detail",index,userid);
    }

    //点击底部标签
    toggleUserList(ev,type){
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

    //收起学生名单
    hideuser(){
        this.$emit("toggleuserlist");
    }
}