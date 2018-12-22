import * as Vue from 'vue'
import Component from 'vue-class-component'
import { mapState } from 'vuex'
import User from '../User'

@Component({
    template: require('./index.html'),
    components: {
        'base-list': __ModuleComponent.BaseList,
        'user': User
    },
    computed: {
        ...mapState(['env'])
    },
    props: ['gradeData']
})
export default class GradeItem extends Vue {
    gradeData: any;
    env: string;

    /**
     * 是否未作答
     */
    get isNoAnswer() {
        if (this.gradeData.grade == 'NO_ANSWER') {
            return true;
        }
        return false;
    }

    /**
     * 该等级用户人数
     */
    get gradeUserNumber() {
        return this.gradeData.users.length;
    }

    /**
     * 等级显示样式
     */
    get gradeClass() {
        let gradeClass = {};
        switch (this.gradeData.grade) {
            case 'A':
                gradeClass = { 'skin-green': true };
                break;
            case 'B':
                gradeClass = { 'skin-blue': true };
                break;
            case 'C':
                gradeClass = { 'skin-orange': true };
                break;
            case 'D':
                gradeClass = { 'skin-red': true };
                break;
            default:
                gradeClass = { 'skin-gray': true };
                break;
        }
        return gradeClass;
    }

    /**
     * 是否可以送花状态
     */
    get ableSendFlower() {
        if (this.gradeData.users.length > 0) {
            return { 'click_disabled': false, 'hide_dom': this.env !== 'ppt' }
        }
        return { 'click_disabled': true, 'hide_dom': this.env !== 'ppt' }
    }
    /**
     * 送花
     */
    sendFlower(event) {
        if ($(event.target).hasClass('click_disabled')) {
            return;
        }
        let users: any = [], names: any = [];
        let i = 0, len = this.gradeData.users.length, u: any;

        for (; i < len; i++) {
            u = this.gradeData.users[i].user;
            users.push(u['userId']);
            names.push(u['name']);
        }
        this.$root.$emit('CHAPTER_THUMBS_UP', users, names);
    }

    /**
     * 展开用户组
     */
    expandUsersGroup(event) {
        $(event.target).parents('.ndui-list-item').toggleClass('state-open')
    }

    userDetail(userData) {
        this.$emit('user-detail', userData);
    }

    get langNoAnswer() {
        let langObj = this.$store.state.lang;
        return langObj['chapters.list.noanswer'];
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
        this.internationalization();
    }
}