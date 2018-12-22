import * as Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: require('./index.html'),
    props: {
        overviewdata: Object,
        converteddata:Object,
        lang: Object,
        showuserlist:Boolean
    },
    watch : {
        showuserlist : function(val){
            this['txttoggle'] = val === true?this['langObj']['hideList']:this['langObj']['seeList'];
        }
    }
})
export default class RoleReadOverView extends Vue {

    converteddata: any
    lang: any
    langObj: Object
    txttoggle: string = ''
    showuserlist:boolean

    beforeMount(){
        this.init();
    }

    mounted() {
        this.internationalization();
        this.drawPie(this.$el, this.converteddata);
    }

    init(){
        const lang = this.lang;

        const langObj = {
            avgRight : lang.avgRight?lang.avgRight:"平均优秀率",
            noAnswer : lang.noAnswer?lang.noAnswer:"未作答",
            person : lang.person?lang.person:"人",
            seeList : lang.seeList?lang.seeList:"查看完整名单",
            hideList : lang.hideList?lang.hideList:"收起名单"
        };
        this.langObj = langObj;
        this.txttoggle = langObj.seeList;
    }

    //国际化
    internationalization(){
        const regStart = /^lang_/;
        const regEnd = /_ig\d+$/;
        let key;
        for(let k in this.$refs){
            key = k.replace(regStart,'').replace(regEnd,'');
            if(key && this.langObj[key]){
                this.$refs[k]["innerHTML"] = this.langObj[key];
            }
        }
    }

    drawPie($view, data) {
        var $view = $(this.$el);
        var canvas:any = this.$refs['chartcanvas'];
        var ctx = canvas.getContext('2d');
        canvas.style.border = 0;
        canvas.width = 300;
        canvas.height = 300;

        var startAngle = 0;
        var endAngle = 0;

        ctx.translate(150, 150);
        ctx.rotate(-Math.PI * 2 * 0.25);

        //边框绘制
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#E9DFD3';
        ctx.stroke();
        ctx.closePath();

        //扇形绘制
        [{
            percent: data.excellentStudents.length / data.commitNum,
            style: '#5bbb84'
        }, {
            percent: data.improveStudents.length / data.commitNum,
            style: '#e57b5c'
        }, {
            percent: data.undoStudents.length / data.commitNum,
            style: '#949494'
        }].forEach(function (item) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            endAngle = startAngle + Math.PI * 2 * item.percent;
            ctx.arc(0, 0, 140, startAngle, endAngle, false);
            ctx.fillStyle = item.style;
            ctx.fill();
            ctx.closePath();
            startAngle = endAngle;
        });
    }

    toggleuserlist(ev){
        this.$emit("toggleuserlist");
    }
}