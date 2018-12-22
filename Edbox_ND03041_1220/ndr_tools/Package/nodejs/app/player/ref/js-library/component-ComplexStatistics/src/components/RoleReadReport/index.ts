import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props:{
        env:String,
        lang:Object,
        reportinfo: Object,
        showingreport : Boolean
    },
    watch: {
        showingreport : function (val){
            if(val === true){
                this['popMsg'] = false;
            }
        }
    }
})
export default class RoleReadReport extends Vue{

    private MESSAGE : Object = {
        loading:'正在向学生收取音频数据...',
        noAudio:'没有该句子音频'
    }

    lang:any
    reportinfo : any
    audioPath : string = ''
    audioplayer : any
    currentIndex : number = 0
    popMsg : boolean = false
    msg : string = ''
    showingreport : boolean
    env:string
    canplay:boolean = this.env === 'ppt'

    //国际化
    internationalization(){
        
    }

    mounted(){
        this.internationalization();
        this.audioplayer = this.$refs['audioplayer'];
        if(this.audioplayer){
            this.audioplayer.addEventListener('play',this.onPlay.bind(this));
            this.audioplayer.addEventListener('pause',this.onPause.bind(this));
            this.audioplayer.addEventListener('ended',this.onPlayEnd.bind(this));
        }
    }

    onClose() {//关闭
        this.$emit("closedialog");
        this.audioplayer.src = '';
    }

    nextStu() {//下一个学生
        if(this['reportinfo']['nextindex'] < 0){
            return;
        }
        this.$emit("changestudentreport", 1);
        this.pauseCurrentAudio();
    }

    preStu() {//上一个学生
        if(this['reportinfo']['preindex'] < 0){
            return;
        }
        this.$emit("changestudentreport", -1);
        this.pauseCurrentAudio();
    }

    playAudio(index) {
        console.info('======playAudio======');
        this.currentIndex = index;
        if(!this.reportinfo.student.result[index]['playing']){//向pc端请求二次收题后，播放音频
            //先判断该音频是否存在
            if(this.reportinfo.student.result[index]['evaluated'] === false){
                //提示音频不存在
                this.msg = this.MESSAGE['noAudio'];
                this.popMsg = true;
                setTimeout(() => {
                    this.popMsg = false;
                },1500);
                return;
            }

            //若存在，向Pc端请求
            this.$emit("requestanswercallback",this.reportinfo.student['userId'],this.reportinfo.student.result[index]['record']);
            this.msg = this.MESSAGE['loading'];
            this.popMsg = true;
        } else {
            //暂停播放音频
            this.pauseCurrentAudio();
        }
    }

    /**
     * 
     * 暂停播放音频
     * 
     * @memberOf RoleReadReport
     */    
    pauseCurrentAudio() { 
        if(this.audioplayer){
            this.audioplayer.pause();
            for (let i = 0, len = this.reportinfo.student.result.length; i < len; i++) { 
                this.reportinfo.student.result[i]['playing'] = false;
            }
        }
    }

    onPlayAudio(src){
        if(this.audioplayer){
            this.audioPath = src;
            this.audioplayer.src = this.audioPath;
            this.audioplayer.play();
        }
    }

    onPlayEnd(){
        this.reportinfo.student.result[this.currentIndex]['playing'] = false;
    }

    onPause(){
        this.reportinfo.student.result[this.currentIndex]['playing'] = false;
    }

    onPlay(){
        this.popMsg = false;
        //其他正在播放的音频状态要改为false
        for(let i=0,len=this.reportinfo.student.result.length; i<len; i++){
            if(i != this.currentIndex){
                this.reportinfo.student.result[i]['playing'] = false;
            }else{
                this.reportinfo.student.result[i]['playing'] = true;
            }
        }
    }
}