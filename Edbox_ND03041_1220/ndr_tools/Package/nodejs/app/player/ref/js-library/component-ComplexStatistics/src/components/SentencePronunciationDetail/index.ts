import * as Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters,mapState } from 'vuex'
import SentenceDetailItem from './components/SentenceDetailItem'

@Component({
    template: require('./index.html'),
    components: {
        'base-list': __ModuleComponent.BaseList,
        'sentence-detail-item': SentenceDetailItem
    },
    computed: {
        ...mapState(['env']),
        ...mapGetters(['userDetailPage'])
    }
})
export default class SentencePronunciationDetail extends Vue {
    msg: string = ''
    popMsg: Boolean = false;
    env: string;
    userDetailPage: any;
    defaultImgUrl: string = require('./resources/icons_df.png')

    /**
     * 是否隐藏送花按钮
     * 
     * @readonly
     * 
     * @memberOf SentencePronunciationDetail
     */    
    get hideFlower() { 
        return this.env !== 'ppt';
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
     * 句子列表
     */
    get getSentences() {
        let sentences = [];
        if (this.userDetailPage && this.userDetailPage.userData) {
            if (this.userDetailPage.userData.answer.user_response.length > 0) {
                this.userDetailPage.userData.answer.user_response.forEach((sentence, index) => {
                    sentence['index'] = index + 1;
                });
                return this.userDetailPage.userData.answer.user_response;
            }
        }
        return sentences;
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
        this.$store.commit('SENTENCE_CURRENT_USER_DETAIL_PAGE', userDetailPage);
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

    showMsg(msg) {
        this.popMsg = true;
        this.msg = msg;
        setTimeout(() => {
            this.popMsg = false;
        }, 1500);
    }

    mounted() {
        this.internationalization();
    }
}