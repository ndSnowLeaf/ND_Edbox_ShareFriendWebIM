import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props: ['userData']
})

export default class User extends Vue {
    userData: any;
    defaultImgUrl : string = require('../../resources/icons_df.png')

    /**
     * 头像url
     */
    get imgUrl() {
        let imgUrl = this.userData.user.img === '' ? this.defaultImgUrl : this.userData.user.img;
        return imgUrl;
    }

    /**
     * 查看详细统计
     */
    getDetailStat() {
         let userDetailPage = {
            show: true,
            userData: this.userData
        }
         this.$store.commit('SENTENCE_CURRENT_USER_DETAIL_PAGE', userDetailPage);
     }
}