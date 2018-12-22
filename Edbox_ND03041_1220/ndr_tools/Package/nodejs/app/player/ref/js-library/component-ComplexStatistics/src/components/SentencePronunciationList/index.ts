import * as Vue from 'vue'
import { mapState } from 'vuex'
import Component from 'vue-class-component'
import SentenceItem from './components/SentenceItem'

require('./style.css');

@Component({
    template: require('./index.html'),
    components: {
        'sentence-item': SentenceItem,
        'base-list': __ModuleComponent.BaseList
    },
    computed: {
        ...mapState(['env'])
    },
    props: ['result']
})

export default class SentencePronunciationList extends Vue {
    result: any;

    /**
     * 解析数据
     */
    get listData() {
        let initData = false;
        let listData: any = [];
        let correctAnswerTeacher = this.$store.state.correctAnswerTeacher;

        /**初始化数据，给每个句子设置ABCD和未作答 */
        correctAnswerTeacher.user_response.forEach((sentenceData, index) => {
            let grades: any[] = [
                { grade: 'A', users: [] },
                { grade: 'B', users: [] },
                { grade: 'C', users: [] },
                { grade: 'D', users: [] },
                { grade: 'NO_ANSWER', users: [] }
            ];
            let sentence = {
                'index': index,
                'content': sentenceData['content'],
                'grades': grades
            };
            listData.push(sentence);
        });

        if (this.result.length > 0) {
            this.result.forEach(userData => {
                let user_response = userData.answer.user_response || correctAnswerTeacher.user_response;
                user_response.forEach((sentenceData, index) => {
                        let sentence = listData[index];
                        if (sentenceData.evaluationResult) {
                            switch (sentenceData.evaluationResult.overall) {
                                case 'A':
                                    sentence.grades[0].users.push(userData);
                                    break;
                                case 'B':
                                    sentence.grades[1].users.push(userData);
                                    break;
                                case 'C':
                                    sentence.grades[2].users.push(userData);
                                    break;
                                case 'D':
                                    sentence.grades[3].users.push(userData);
                                    break;
                                default:
                                    sentence.grades[4].users.push(userData);
                                    break;
                            }
                        } else {
                            sentence.grades[4].users.push(userData);
                        }
                    });
            });
        }

        return listData;
    }
}