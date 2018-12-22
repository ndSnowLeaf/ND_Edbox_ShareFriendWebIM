import CONSTANT from './constant.js';

export default function (convertedData,lang) {
    return {
        state: {
            convertedData:convertedData,
            showStudentListPanel:false,//是否显示学生列表面板
            hasExecuteStulistAnim:false,//是否已经执行学生列表动画
            currentUserListTab:'all',//默认选择“全部”
            lang:lang//国际化json
        },
        mutations: {
            [CONSTANT.mutations.CLICK_PANEL_BTN]:function(state,isShow) {//点击面板切换按钮，修改面板状态
                state.showStudentListPanel = isShow;
            },
            [CONSTANT.mutations.EXECUTE_STULIST_ANIM]:function(state,anim) {//执行学生列表动画
                if(!state.hasExecuteStulistAnim && anim){
                    state.hasExecuteStulistAnim = anim;
                }
            },
            [CONSTANT.mutations.CLICK_USERLIST_TAB] : function(state,type) {
                state.currentUserListTab = type;
            }
        }
    };
}