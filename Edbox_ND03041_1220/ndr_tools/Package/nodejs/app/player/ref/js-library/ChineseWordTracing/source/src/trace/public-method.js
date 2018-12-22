/**
 * Created by Administrator on 2016/12/15.
 * 实例对外暴露的方法
 */

import CONST_NAME from "../constant/const-name";

export default function () {

    var parent = this;

    //作答态提供的方法
    var drawModeMethod = {

        showGuideState: true,

        //允许绘画
        allowDraw(allow) {
            parent.currentWord.allowDraw = !!allow;

        },

        //返回是否书写过的状态
        hasDrawed() {
            return parent.currentWord.hasDrawed;
        },

        //显示引导
        showGuide(show) {
            parent.showCanvasGuide(show);
        },
        //获取base64 data
        getBase64Image() {
            return parent.getBase64Image();
        },
        //获取描绘进度，当前描到第几笔，总共有多少笔
        getTraceProgress() {
            var currentWord = parent.currentWord,
                curStep = parent.isDrawMode ? currentWord.validateStep : currentWord.currentStep,
                totalSteps = parent.isDrawMode ? currentWord.strokesLength : currentWord.autoTraceSteps,
                isInAnimation = currentWord.loop === 0 ? false : true;

            return {
                curStep: curStep,
                totalSteps: totalSteps,
                isInAnimation: isInAnimation
            }
        },
        //重置
        reset() {
            parent.resetCanvasBoards();
        }
    };

    var displayModeMethod = {
        //展示部首
        showRadical() {
            
            parent.initBackBoard(CONST_NAME.REDAW_TYPE.RADICAL);

        },
        //不展示部首
        hideRadical() {
           
            parent.initBackBoard(CONST_NAME.REDAW_TYPE.NORMAL);
        },
        //展示结构
        showStructure() {
           
            parent.initBackBoard(CONST_NAME.REDAW_TYPE.STRUCTURE);
        },
        //不展示结构
        hideStructure() {
           
            parent.initBackBoard(CONST_NAME.REDAW_TYPE.NORMAL);
        },
        //开始自动描红
        startAutoTrace() {
           
            return parent.startAnimation(CONST_NAME.TRACE_TYPE.AUTO);
        },
        //停止自动描红
        stopAutoTrace() {
           
            parent.stopAnimation();
        },

        //开始分步描红
        startSingleStepTrace() {
            parent.startAnimation(CONST_NAME.TRACE_TYPE.STEP);
        },

        //分步描红，下一笔
        nextStep() {
            return parent.draw();
        },

        //分步描红，上一笔，实际是撤销操作
        preStep() {
            var stepInfo = parent.preStep();
            return stepInfo;
        },

        //设置自动描红速度
        setSpeed(speed) {
           
            parent.setSpeed(speed);
        },
        //获取描绘进度，当前描到第几笔，总共有多少笔
        getTraceProgress() {
            var currentWord = parent.currentWord,
                curStep = parent.isDrawMode ? currentWord.validateStep : currentWord.currentStep,
                totalSteps = parent.isDrawMode ? currentWord.strokesLength : currentWord.autoTraceSteps,
                isInAnimation = currentWord.loop === 0 ? false : true;

            return {
                curStep: curStep,
                totalSteps: totalSteps,
                isInAnimation: isInAnimation
            }
        },
        reset() {
            parent.resetCanvasBoards();
        }
    };

    return parent.isDrawMode ? drawModeMethod : displayModeMethod;

}


