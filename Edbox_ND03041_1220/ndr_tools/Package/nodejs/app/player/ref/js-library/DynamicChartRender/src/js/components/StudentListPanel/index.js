import PanelBtn from '../PanelBtn/index.js';
import StudentListItem from '../StudentListItem/index.js';
import CONSTANT from '../../store/constant.js';
import { mapState } from 'vuex'

/**
   * 学生列表对应css样式
   */
let getUserItemStyle = function(accuracy) {
  if (accuracy >= 80) {
    return 'list_font_good';
  } else if (accuracy >= 60) {
    return 'list_font_mid';
  } else {
    return 'list_font_low';
  }
};

/**
 *学生列表排序规则
 */
let compareStudent = function() {
  let compare = function(a, b) {
    if (a.submitTime === b.submitTime) { //如果耗时相同
      return ~~a.studentNo - ~~b.studentNo; //学号 asc
    }
    return ~~a.submitTime - ~~b.submitTime; //耗时 asc
  };
  return {
    objective: function(a, b) {
      if (a.accuracy === b.accuracy) { //如果正确率相同，仅客观题比较正确率
        return compare(a, b);
      }
      return ~~b.accuracy - ~~a.accuracy; //正确率 desc
    },
    subjective: compare
  };
};

export default {
  template: require('./index.html'),
  components: {
    'PanelBtn': PanelBtn,
    'StudentListItem': StudentListItem
  },
  data: function() {
    return {
      students: [],
      execAnim: false
    }
  },
  computed: mapState({
    getExecAnim(state) {
      let execAnim = state.hasExecuteStulistAnim; //获得当前状态
      return execAnim;
    },
    currentTab(state) {
      let currentUserListTab = state.currentUserListTab;
      return currentUserListTab;
    }
  }),
  watch: {
    getExecAnim(val) {
      this.execAnim = val;
      this.execAnim && this.onExecListAnim();
    }
  },
  mounted: function() {
    let convertedData = this.$store.state.convertedData;
    let correctStudents = convertedData.correctStudents;
    let errorStudents = convertedData.errorStudents;
    let undoStudents = convertedData.undoStudents;

    var isAllSubjective = true;
    var answer;
    for (var i = 0, len = convertedData.answer.length; i < len; i++) {
      answer = convertedData.answer[i];
      if (answer.type != "subjective") {
        isAllSubjective = false;
        break;
      }
    }

    let comparator = compareStudent()[isAllSubjective? 'subjective': 'objective'];
    correctStudents.sort(comparator).map((item) => {
      this.finishedFilter(item);
      item.type = "right";
    });
    errorStudents.sort(comparator).map((item) => {
      this.finishedFilter(item);
      item.type = "wrong";
    });
    undoStudents.sort(comparator).map((item) => {
      this.unfinishedFilter(item);
      item.type = 'undo';
    });
    this.students = correctStudents.concat(errorStudents, undoStudents);

    let lang = this.$store.state.lang;
    this.internationalization(lang);
  },
  methods: {
    internationalization(langObj) {

      let regStart = /^lang_/;
      let regEnd = /_ig\d+$/;
      let key;
      for (let k in this.$refs) {
        key = k.replace(regStart, '').replace(regEnd, '');
        if (this.$refs[k] instanceof Array) { //若为数组
          for (let i = 0, len = this.$refs[k]['length']; i < len; i++) {
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
    },
    finishedFilter: function(item) {
      let lang = this.$store.state.lang;
      item.time = ~~(item.submitTime / 60) + lang.minute + ' ' + (item.submitTime % 60) + lang.second;
      item.style = getUserItemStyle(item.accuracy);
      item.accuracy = item.accuracy + '%';
    },
    unfinishedFilter: function(item) {
      item.style = 'noanswer';
      item.accuracy = '--%';
      item.time = '-:-';
    },
    toggleUserList(type) {
      this.$store.commit(CONSTANT.mutations.CLICK_USERLIST_TAB, type);
    },
    onExecListAnim() { //执行列表动画
      let studentlist = this.$refs['studentlist'];
      if (studentlist && studentlist.length > 0) {
        let i,
          len,
          item;
        for (i = 0, len = studentlist.length; i < len && i < 10; i++) {
          (function(index) {
            setTimeout(() => {
              item = studentlist[index];
              item.execAnim();
            }, 300 * index + 800);
          })(i);
        }
      }
    }
  }
}