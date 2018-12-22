import * as Vue from 'vue'
import { mapState } from 'vuex'
import Component from 'vue-class-component'
import GradeItem from "./components/GradeItem"
import { chapterStore } from './store'

require('./style.css');

@Component({
    template: require('./index.html'),
    components: {
        'grade-item': GradeItem,
        'base-list': __ModuleComponent.BaseList
    },
    computed: {
        ...mapState(['env'])
    },
    props: ['result']
})
export default class ChapterPronunciation extends Vue {
    result: any;
    
    beforeCreate() {
        
    }

    get listData() {
        let listData: any = {};
        let answerList: any[] = [
            { grade: 'A', users: [] },
            { grade: 'B', users: [] },
            { grade: 'C', users: [] },
            { grade: 'D', users: [] }
        ];
        let noAnswerList: any[] = [
            { grade: 'NO_ANSWER', users: [] },
        ];
        this.result.forEach(userData => {
            if (userData.answerState === 'NO_ANSWER') {
                noAnswerList[0].users.push(userData);
            } else if (userData.answer.user_response && userData.answer.user_response.length > 0) {
                if (userData.answer.user_response[0].evaluationResult) {
                    let grade = userData.answer.user_response[0].evaluationResult.overall;
                    switch (grade) {
                        case 'A':
                            answerList[0].users.push(userData);
                            break;
                        case 'B':
                            answerList[1].users.push(userData);
                            break;
                        case 'C':
                            answerList[2].users.push(userData);
                            break;
                        case 'D':
                            answerList[3].users.push(userData);
                            break;
                        default:
                            break;
                    }
                }
            }
        });
        listData.answerList = answerList;
        listData.noAnswerList = noAnswerList;
        return listData;
    }
}