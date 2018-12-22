import * as Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters,mapState } from 'vuex'

@Component({
    template: require('./index.html'),
    props: ['sentence-detail'],
    computed: {
        ...mapState(['env']),
        ...mapGetters(['userDetailPage'])
    }
})

export default class SentenceDetailItem extends Vue {
    private MESSAGE: Object = {
        loading: this.$store.state.lang['detail.msg.receive.audio'],
        noAudio: this.$store.state.lang['detail.msg.no.audio']
    }
    msgHasShowed: Boolean = false;
    userDetailPage: any;
    sentenceDetail: any;
    audio: any;
    audioPath: String = ''
    env: string;
    audioClass = {
        's-disabled': false,
        's-pause': false
    }

    /**
     * 成绩
     */
    get getGrade() {
        let grade = {
            "overall": '?',/*篇章得分*/
            "accuracy": '?', /*准确度*/
            "integrity": '?',/*完整度*/
            "fluency": '?',/*流畅度*/
            "scores": []
        }
        if (this.sentenceDetail) {
            let evaluationResult = this.sentenceDetail.evaluationResult;
            if (evaluationResult) {
                grade.overall = evaluationResult.overall || grade.overall;
                grade.accuracy = evaluationResult.accuracy || grade.accuracy;
                grade.integrity = evaluationResult.integrity || grade.integrity;
                grade.fluency = evaluationResult.fluency || grade.fluency;
                grade.scores = evaluationResult.scores || grade.scores;
            }
        }
        return grade;
    }
    /**
     * 播放按钮样式
     */
    get getAudioClass() {
        if (!this.sentenceDetail.isEvaluated) {
            this.audioClass['s-disabled'] = true;
        } else {
            this.audioClass['s-disabled'] = false;
        }
        let hide = this.env !== 'ppt';
        this.audioClass["hide_dom"] = hide;
        return this.audioClass;
    }

    /**
     * 录音地址
     */
    get audioUrl() {
        let audioUrl = '';
        if (this.sentenceDetail) {
            audioUrl = this.sentenceDetail.audioPath;
        }
        if (audioUrl != '') {
            this.audioPath = audioUrl;
            this.playAudio();
        }
        return audioUrl;
    }

    /**
     * 播放
     */
    play() {
        if (this.audioClass['s-disabled']) {
            return;
        }
        let _userDetailPage = {
            show: this.userDetailPage,
            playingAudio: this.sentenceDetail.index - 1,
            userData: this.userDetailPage.userData
        }

        let msg = '';

        //判断音频是否存在，不存在需要二次收题
        let audioUrl = this.userDetailPage.userData.answer.user_response[_userDetailPage.playingAudio]['audioPath'];
        let isEvaluated = this.userDetailPage.userData.answer.user_response[_userDetailPage.playingAudio]['isEvaluated'];
        let existAudioPath = this.userDetailPage.userData.answer.user_response[_userDetailPage.playingAudio]['existAudioPath'];

        //没有评测        
        if (!isEvaluated) {
            //提示音频不存在
            msg = this.MESSAGE['noAudio'];
            this.$emit('showmsg', msg);
            return;
        } else if (audioUrl === '') { //已评测，未收取
            //发起二次收题
            if (!this.msgHasShowed && !existAudioPath) {
                msg = this.MESSAGE['loading'];
                this.$emit('showmsg', msg);
            }
            let userId = this.userDetailPage.userData.user.userId;
            let myRecordAuio: String = this.userDetailPage.userData.answer.user_response[_userDetailPage.playingAudio]['myRecordAuio'];
            let sectionId = myRecordAuio.substring(myRecordAuio.lastIndexOf("/") + 1, myRecordAuio.lastIndexOf(".wav"));
            this.$root.$emit("requestanswercallback", userId, sectionId);
        } else {
            this.playAudio();
        }

    }

    playAudio() {
        if (this.audio.paused) {//不在播放状态
            //把其他音频暂停
            let c, i, len;
            for (i = 0, len = this.$parent.$children.length; i < len; i++) {
                c = this.$parent.$children[i];
                if (c != this && c.isAudioPlaying()) {
                    c.pauseAudio();
                    console.log('先暂停',i);
                }
            }
            setTimeout(() => {
                this.audio.play();
                this.audioClass['s-pause'] = true;
            }, 300);
        } else {
            this.pauseAudio();
        }

    }

    /**
     * 暂停播放音频
     * 
     * 
     * @memberOf SentenceDetailItem
     */
    pauseAudio() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audioClass['s-pause'] = false;
    }

    isAudioPlaying() {
        return !this.audio.paused;
    }

    /**
     * 监控详情页面数据
     * @param newVal 
     * @param oldVal 
     */
    watchUserDetailPage(newVal, oldVal) {
        //关闭窗口，关闭录音
        if (!this.userDetailPage.show) {
            if (!this.audio.paused) {
                console.log("关闭窗口，暂停录音");
                this.audio.pause();
            }
            this.audio.currentTime = 0;
            this.audioClass['s-pause'] = false;
        }
        // 切换录音播放
        if (newVal.playingAudio !== oldVal.playingAudio) {
            if (this.sentenceDetail.index - 1 !== newVal.playingAudio && this.sentenceDetail.evaluationResult) {
                this.audio.currentTime = 0;
                this.pauseAudio();
            }
        }
    }

    /**
     * 设置等级样式
     * @param grade 等级
     */
    setGradeClass(grade) {
        let gradeClass = {};
        if (grade === '?') {
            gradeClass['grade-not'] = true;
        } else {
            gradeClass['grade-' + grade.toLowerCase()] = true;
        }
        return gradeClass;
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

    /**
     * 录音播放结束事件
     */
    mounted() {
        //this.audio = this.$el.querySelector('.ndui__btn--play audio');
        this.audio = this.$refs['audioPlayer'];
        if (this.audio) {
            this.audio.addEventListener('ended', function () {
                //this.audioClass['s-disabled'] = false;
                this.audioClass['s-pause'] = false;
                // let _userDetailPage = {
                //     show: this.userDetailPage,
                //     playingAudio: -1,
                //     userData: this.userDetailPage.userData
                // }
                //this.$store.commit('SENTENCE_CURRENT_USER_DETAIL_PAGE', _userDetailPage);
            }.bind(this));
        }
        this.internationalization();
        //监控详情页面数据
        this.$watch('userDetailPage', function (newVal, oldVal) {
            this.watchUserDetailPage(newVal, oldVal);
        });
    }
}