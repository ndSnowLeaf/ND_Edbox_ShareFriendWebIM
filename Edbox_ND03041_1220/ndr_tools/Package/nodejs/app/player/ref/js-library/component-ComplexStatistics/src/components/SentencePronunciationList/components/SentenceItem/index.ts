import * as Vue from 'vue'
import * as Vuex from 'vuex'
import Component from 'vue-class-component'
import User from '../User'

@Component({
    template: require('./index.html'),
    components: {
        'base-list': __ModuleComponent.BaseList,
        'user': User
    },
    props: ['sentence-data']
})
export default class SentenceItem extends Vue {
    sentenceData: any;
    currentIndex = -1; //选中显示的等级
    userContainerClass = {};
    currentUsers = [];

    /**
     * 设置等级样式
     * @param grade 等级
     */
    setGradeColorClass(grade) {
        let gradeClass = {};
        switch (grade) {
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
     * 等级按钮
     * @param index 
     */
    activeGradeBtn(index) {
        if (index === this.currentIndex) {
            return { 'ui_btn_active': true };
        } else {
            return { 'ui_btn_active': false };
        }
    }

    /**
     * 用户列表容器样式
     */
    get getUserContainerClass() {
        if (this.currentIndex === -1) {
            this.userContainerClass['state-close'] = true;
            return this.userContainerClass;
        }
        let itemBg = "";
        switch (this.currentIndex) {
            case 0:
                itemBg = "green";
                break;
            case 1:
                itemBg = "blue";
                break;
            case 2:
                itemBg = "orange";
                break;
            case 3:
                itemBg = "red";
                break;
            case 4:
                itemBg = "gray";
                break;
        }
        this.userContainerClass = {};
        this.userContainerClass['state-close'] = false;
        this.userContainerClass['bg-' + itemBg] = true;
        let usersNum = this.sentenceData.grades[this.currentIndex].users.length;
        let row = Math.floor(usersNum / 14) + 1;
        if(row > 6) { //样式最多只支持显示6行
            row = 6;
        }
        this.userContainerClass['row-' + row] = true;
        return this.userContainerClass;
    }

    /**
     * 当前用户
     */
    get getCurrentUsers() {
        if (this.currentIndex !== -1) {
            this.currentUsers = this.sentenceData.grades[this.currentIndex].users;
        }
        return this.currentUsers;
    }

    /**
     * 点击等级按钮
     * @param index 
     * @param event 
     */
    clickGradeTab(index, event) {
        if (this.currentIndex === index) {
            this.currentIndex = -1;
        } else {
            this.currentIndex = index;
        }
    }

    get langNoAnswer() {
        return this.$store.state.lang['chapters.list.noanswer'];
    }

    //国际化
    internationalization() {
        var regStart = /^lang_/;
        var regEnd = /_ig\d+$/;
        var key;
        
        let langObj = this.$store.state.lang;
        for(var k in this.$refs) {
            key = k.replace(regStart, '').replace(regEnd, '');
            if (this.$refs[k] instanceof Array) {//若为数组
                for (var i = 0, len = this.$refs[k]['length']; i < len; i++) {
                    if (key && langObj[key] && this.$refs[k][i]) {
                        this.$refs[k][i]["innerHTML"] = langObj[key];
                    }
                }
            } else {
                if (key && langObj[key] && this.$refs[k]) {
                    this.$refs[k]["innerHTML"] = langObj[key];
                }
            }
        }
    }

    mounted() {
        //默认展开显示第一句A等级的学生信息
        this.currentIndex = this.sentenceData.index === 0 ? 0:-1;
    }

    updated() { 
        this.internationalization();
    }
}