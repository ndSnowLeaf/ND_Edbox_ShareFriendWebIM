import CONSTANT from '../../store/constant.js';
import { mapState } from 'vuex'

export default {
  template: require('./index.html'),
  props: ['data'],
  data: function() {
    return {
      lang: this.$store.state.lang,
      defaultImgUrl: require('../../../resources/icons_df.png'),
      isShow: false
    };
  },
  computed: mapState({
    currentTab(state) {
      let currentUserListTab = state.currentUserListTab;
      if (currentUserListTab == this.data.type || currentUserListTab == 'all') {
        return true;
      }
      return false;
    }
  }),
  methods: {
    execAnim() {
      this.isShow = true;
    },
    seeDetail() { //查看详情
      if (this.data.type == 'undo') {
        return;
      }
      //往上层发送请求
      this.$root.$emit('EVENT_SEE_DETAIL',this.data.userId);
    }
  }
}