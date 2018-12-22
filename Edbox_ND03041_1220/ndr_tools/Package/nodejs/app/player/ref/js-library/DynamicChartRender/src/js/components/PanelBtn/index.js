import CONSTANT from '../../store/constant.js';
import { mapState } from 'vuex'

export default  {
    template: require('./index.html'),
    data: function () { 
        return {
        }
    },
    computed: mapState({
        txt (state) {
            let curState = state.showStudentListPanel;//获得当前状态
            //文本做响应改变
            return curState?state.lang.hideList:state.lang.seeList;
        }
    }),
    methods:{
        changePanel:function() {//点击面板开关按钮
            let curState = this.$store.state.showStudentListPanel;
            let nextState = !curState;
            this.$store.commit(CONSTANT.mutations.CLICK_PANEL_BTN,nextState);
            this.$store.commit(CONSTANT.mutations.EXECUTE_STULIST_ANIM,nextState);
        }
    }
}