import * as Vuex from 'vuex';

export const chapterStore = {
    state: {
        userDetailPage: {
            show: false,
            userData: null
        }
    },

    getters: {
        userDetailPage(state): any {
            return state.userDetailPage;
        }
    },

    actions: {

    },

    mutations: {
        ['CHAPTER_CURRENT_USER_DETAIL_PAGE'](state, userDetailPage) {
            state.userDetailPage = userDetailPage;
        }
    }
}