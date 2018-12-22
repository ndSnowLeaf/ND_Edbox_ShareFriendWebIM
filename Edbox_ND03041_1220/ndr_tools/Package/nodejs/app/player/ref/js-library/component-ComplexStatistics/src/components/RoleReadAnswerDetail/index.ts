import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props:{
        answer:Object
    }
})
export default class RoleReadAnswerDetail extends Vue{
    
    mOrderType : number = 0
    answer : Object
    sections : Array<Object> = []

    beforeMount() {
        this.translatAnswer(this.answer);
    }

    changelist(orderType) {
        if(orderType == 0) {//由高到低
            if(this.mOrderType != 0){
                this.sections.reverse();
            }
            this.mOrderType = 0;
        }else if(orderType == 1) {//由低到高
            if(this.mOrderType != 1){
                this.sections.reverse();
            }
            this.mOrderType = 1;
        }
    }

    translatAnswer(answer : Object) {
        let tmpArr : Array<String> = [];
        for(let id in answer){
            tmpArr.push(answer[id]);
        }
        //按照优秀率，由高到低排序
        this.mOrderType = 0;
        this.sections = tmpArr.sort((a,b) => {
            return b['excellPercent'] - a['excellPercent'];
        });
    }

}