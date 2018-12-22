import Vue from 'vue';
import Vuex from 'vuex';
import Store from '../store/index.js';
import templete from './index.html';
import StudentListPanel from '../components/StudentListPanel/index.js';
import PanelBtn from '../components/PanelBtn/index.js';
import CONSTANT from '../store/constant.js';

/**
 *外部事件和内部事件名键值对
 */
const EVENTS = {
  'onSeeDetail': 'EVENT_SEE_DETAIL'
};

/**
 * Vue应用
 * 
 * @export
 * @class App
 */
export default class App {
  constructor(chartContainer, statObj, lang) {
    chartContainer.innerHTML = templete;

    let store = new Vuex.Store(Store(statObj, lang));

    let _self = this;

    let mapState = Vuex.mapState;
    this.app = new Vue({
      el: chartContainer,
      data:{
        'showTip':false
      },
      store: store,
      components: {
        'StudentListPanel': StudentListPanel,
        'PanelBtn': PanelBtn
      },
      computed: mapState({
        showStudentListPanel: state => state.showStudentListPanel
      }),
      mounted: function() {
        var lang = this.$store.state.lang;
        _self.internationalization.call(this, lang);
      }
    });
  }

  /**
   * 显示或隐藏右下角底部文本
   * 
   * @param {any} show
   * 
   * @memberOf App
   */
  toggleTip(show){
    this.app.$data.showTip = show;
  }

  /**
   * 收起学生列表
   * 
   * 
   * @memberOf App
   */
  hideStudentListPanel() {
    let curState = this.app.$store.state.showStudentListPanel;
    if(curState){
      let nextState = !curState;
      this.app.$store.commit(CONSTANT.mutations.CLICK_PANEL_BTN,nextState);
    }
  }

  /**
   * 注册事件回调，外部使用
   * 
   * @param {any} eventName
   * @param {any} callback
   * 
   * @memberOf App
   */
  registerEvent(eventName, callback) {
    if (EVENTS[eventName]) {
      this.app.$on(EVENTS[eventName], callback); //注册查看详情事件
    }
  }

  internationalization(langObj) {

    var regStart = /^lang_/;
    var regEnd = /_ig\d+$/;
    var key;
    for (var k in this.$refs) {
      key = k.replace(regStart, '').replace(regEnd, '');
      if (this.$refs[k] instanceof Array) { //若为数组
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
   * 
   * 
   * @readonly
   * 
   * @memberOf App
   */
  get $el() {
    return this.app.$el;
  }

  destroy() { 
    this.app && this.app.$destroy && this.app.$destroy();
  }
}