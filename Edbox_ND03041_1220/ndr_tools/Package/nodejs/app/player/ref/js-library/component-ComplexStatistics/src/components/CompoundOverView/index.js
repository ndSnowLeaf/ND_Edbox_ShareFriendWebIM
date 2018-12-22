var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Vue = require('vue');
var vue_class_component_1 = require('vue-class-component');
var CompoundOverView = (function (_super) {
    __extends(CompoundOverView, _super);
    function CompoundOverView() {
        _super.apply(this, arguments);
        this.txttoggle = '';
    }
    CompoundOverView.prototype.beforeMount = function () {
        this.init();
    };
    CompoundOverView.prototype.mounted = function () {
        this.internationalization();
        this.drawPie(this.$el, this.converteddata);
    };
    CompoundOverView.prototype.init = function () {
        var lang = this.lang;
        var langObj = {
            avgRight: lang.avgRight ? lang.avgRight : "平均正确率",
            noAnswer: lang.noAnswer ? lang.noAnswer : "未作答",
            person: lang.person ? lang.person : "人",
            seeList: lang.seeList ? lang.seeList : "查看完整名单",
            hideList: lang.hideList ? lang.hideList : "收起名单",
            right: lang.right ? lang.right : "全&nbsp;&nbsp;&nbsp;对",
            wrong: lang.wrong ? lang.wrong : "错&nbsp;&nbsp;&nbsp;误"
        };
        this.langObj = langObj;
        this.txttoggle = langObj.seeList;
    };
    CompoundOverView.prototype.internationalization = function () {
        var regStart = /^lang_/;
        var regEnd = /_ig\d+$/;
        var key;
        for (var k in this.$refs) {
            key = k.replace(regStart, '').replace(regEnd, '');
            if (this.$refs[k] instanceof Array) {
                for (var i = 0, len = this.$refs[k]['length']; i < len; i++) {
                    if (key && this.langObj[key]) {
                        this.$refs[k][i]["innerHTML"] = this.langObj[key];
                    }
                }
            }
            else {
                if (key && this.langObj[key]) {
                    this.$refs[k]["innerHTML"] = this.langObj[key];
                }
            }
        }
    };
    CompoundOverView.prototype.drawPie = function ($view, data) {
        var $view = $(this.$el);
        var canvas = this.$refs['chartcanvas'];
        var ctx = canvas.getContext('2d');
        canvas.style.border = 0;
        canvas.width = 300;
        canvas.height = 300;
        var startAngle = 0;
        var endAngle = 0;
        ctx.translate(150, 150);
        ctx.rotate(-Math.PI * 2 * 0.25);
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#E9DFD3';
        ctx.stroke();
        ctx.closePath();
        [{
                percent: data.correctStudents.length / data.commitNum,
                style: '#5bbb84'
            }, {
                percent: data.errorStudents.length / data.commitNum,
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
    };
    CompoundOverView.prototype.toggleuserlist = function (ev) {
        var type = this.$parent["showuserlist"] == false ? "show" : "hide";
        this.txttoggle = type == "show" ? this.langObj['hideList'] : this.langObj['seeList'];
        this.$emit("toggleuserlist", type);
    };
    CompoundOverView = __decorate([
        vue_class_component_1.default({
            template: require('./index.html'),
            props: {
                overviewdata: Object,
                converteddata: Object,
                lang: Object
            }
        })
    ], CompoundOverView);
    return CompoundOverView;
}(Vue));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompoundOverView;
