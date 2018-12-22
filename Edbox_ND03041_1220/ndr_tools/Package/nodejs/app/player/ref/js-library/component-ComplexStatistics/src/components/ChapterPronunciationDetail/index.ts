import * as Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters,mapState } from 'vuex'

@Component({
    template: require('./index.html'),
    computed: {
        ...mapState(['env']),
        ...mapGetters(['userDetailPage'])
    }
})
export default class ChapterPronunciationDetail extends Vue {
    private MESSAGE: Object = {
        loading: this.$store.state.lang['detail.msg.receive.audio'],
        noAudio: this.$store.state.lang['detail.msg.no.audio']
    }
    msg: string = ''
    popMsg: Boolean = false
    msgHasShowed: Boolean = false;
    env: string;
    userDetailPage: any;
    audio: any;
    audioPath: String = ''
    audioClass = {
        's-disabled': false,
        's-pause': false
    }
    defaultImgUrl: string = require('./resources/icons_df.png')

    /**
     * 是否隐藏送花按钮
     * 
     * @readonly
     * 
     * @memberOf ChapterPronunciationDetail
     */    
    get hideFlower() {
        let hide = this.env !== 'ppt';
        this.audioClass["hide_dom"] = hide;
        return hide;
    }

    /**
     * 页面是否隐藏
     */
    get hideDom() {
        var isShow = true;
        if (this.userDetailPage) {
            isShow = this.userDetailPage.show;
        }
        return { 'hide_dom': !isShow }
    }

    /**
     * 用户信息
     */
    get userInfo() {
        let userInfo = {
            imgUrl: '',
            name: '',
            userId: '',
            submitTime: 0
        };
        if (this.userDetailPage && this.userDetailPage.userData) {
            userInfo.imgUrl = this.userDetailPage.userData.user.img === '' ? this.defaultImgUrl : this.userDetailPage.userData.user.img;
            userInfo.name = this.userDetailPage.userData.user.name;
            userInfo.userId = this.userDetailPage.userData.user.userId;
            userInfo.submitTime = this.userDetailPage.userData.user.submitTime;
        }
        return userInfo;
    }

    /**
     * 总用时
     */
    get getTime() {
        let time = {
            minute: 0,
            second: 0
        }
        if (this.userDetailPage && this.userDetailPage.userData && this.userDetailPage.userData.user) {
            let t = this.userDetailPage.userData.user.submitTime ? this.userDetailPage.userData.user.submitTime : 0;
            let min = t / 60;
            time.minute = Math.floor(min);
            time.second = t % 60;
        }
        return time;
    }

    /**
     * 成绩
     */
    get getGrade() {
        let grade = {
            "overall": '',/*篇章得分*/
            "accuracy": '', /*准确度*/
            "integrity": '',/*完整度*/
            "fluency": '',/*流畅度*/
            "scores": []
        }
        if (this.userDetailPage && this.userDetailPage.userData) {
            if (this.userDetailPage.userData.answer.user_response.length > 0) {
                let evaluationResult = this.userDetailPage.userData.answer.user_response[0].evaluationResult;
                grade.overall = evaluationResult.overall;
                grade.accuracy = evaluationResult.accuracy;
                grade.integrity = evaluationResult.integrity;
                grade.fluency = evaluationResult.fluency;
                grade.scores = evaluationResult.scores;
            }
        }
        return grade;
    }

    /**
     * 录音地址
     */
    get audioUrl() {
        let audioUrl = '';
        if (this.userDetailPage && this.userDetailPage.userData) {
            if (this.userDetailPage.userData.answer.user_response.length > 0) {
                audioUrl = this.userDetailPage.userData.answer.user_response[0].audioPath;
            }
        }
        if (audioUrl != '') {
            this.audioPath = audioUrl;
            this.playAudio();
        }
        return audioUrl;
    }

    play(event) {
        if (this.audioClass['s-disabled']) {
            return;
        }

        let msg = '';

        let audioUrl: String = this.userDetailPage.userData.answer.user_response[0]['audioPath'];
        let isEvaluated = this.userDetailPage.userData.answer.user_response[0]['isEvaluated'];

        //没有评测        
        if (!isEvaluated) {
            //提示音频不存在
            msg = this.MESSAGE['noAudio'];
            this.showMsg(msg);
            return;
        } else if (audioUrl === '') { //已评测，未收取
            //发起二次收题
            if (!this.msgHasShowed) {
                msg = this.MESSAGE['loading'];
                this.showMsg(msg);
                this.msgHasShowed = true;
            }
            let userId = this.userDetailPage.userData.user.userId;
            let myRecordAuio: String = this.userDetailPage.userData.answer.user_response[0]['myRecordAuio'];
            let sectionId = myRecordAuio.substring(myRecordAuio.lastIndexOf("/") + 1, myRecordAuio.lastIndexOf(".wav"));
            this.$root.$emit("requestanswercallback", userId, sectionId);
        } else {
            this.playAudio();
        }
    }

    playAudio() {
        this.$nextTick(() => {
            if (this.audio.paused) {//不在播放状态
                this.audio.play();
                this.audioClass['s-pause'] = true;
            } else { 
                this.audio.pause();
                this.audioClass['s-pause'] = false;
            }
        });
    }

    /**
     * 设置等级样式
     * @param grade 等级
     */
    setGradeClass(grade) {
        let gradeClass = {};
        gradeClass['grade-' + grade.toLowerCase()] = true;
        return gradeClass;
    }

    /**
     * 送花
     */
    sendFlower(event) {
        let users = [this.userInfo.userId];
        let names = [this.userInfo.name];
        this.$root.$emit('CHAPTER_THUMBS_UP', users, names);
    }

    /**
     * 关闭详情窗口
     */
    closeDetail() {
        let i, len = this.userDetailPage.userData.answer.user_response.length;
        for (i = 0; i < len; i++) {
            this.userDetailPage.userData.answer.user_response[i]['audioPath'] = '';
        }
        let userDetailPage = {
            show: false,
            userData: this.userDetailPage.userData
        }
        this.$store.commit('CHAPTER_CURRENT_USER_DETAIL_PAGE', userDetailPage);
        this.audio.pause();
        this.audioClass['s-disabled'] = false;
        this.audioClass['s-pause'] = false;
    }

    showMsg(msg) {
        this.popMsg = true;
        this.msg = msg;
        setTimeout(() => {
            this.popMsg = false;
        }, 1500);
    }

    //国际化
    internationalization() {
        var regStart = /^lang_/;
        var regEnd = /_ig\d+$/;
        var key;
        let langObj = this.$store.state.lang;
        for (var k in this.$refs) {
            key = k.replace(regStart, '').replace(regEnd, '');
            if (this.$refs[k] instanceof Array) {//若为数组
                for (var i = 0, len = this.$refs[k]['length']; i < len; i++) {
                    if (key && langObj[key]) {
                        this.$refs[k][i]["innerHTML"] = langObj[key];
                    }
                }
            } else {
                if (key && langObj[key]) {
                    this.$refs[k]["innerHTML"] = langObj[key];
                }
            }
        }
    }

    mounted() {
        this.audio = this.$el.querySelector('.ndui__btn--play audio');
        if (this.audio) {
            this.audio.addEventListener('ended', function () {
                this.audioClass['s-disabled'] = false;
                this.audioClass['s-pause'] = false;
            }.bind(this));
        }
        this.internationalization();
    }
}