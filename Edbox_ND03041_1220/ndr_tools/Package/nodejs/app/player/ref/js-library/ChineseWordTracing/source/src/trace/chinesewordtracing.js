import Line from "../utils/line";
import Point from "../utils/point";
import mathUtil from "../utils/math-util";
import CONST_NAME from "../constant/const-name";
import defaultConfig from "../config/default.config";
import instanceProperty from "./instance-propety";
import PublicMethod from "./public-method";
import $ from "jQuery";
require("../resource/css.css");



/**
 * 汉字描写类
 */

class ChineseWordTracing {

    constructor(param) {
        //展示态
        this.isDisplayMode = param.mode === CONST_NAME.MODE.DISPLAY;
        //作答态
        this.isDrawMode = !this.isDisplayMode;

        this.param = {
            mode: param.mode,
            word: param.word,
            renderTo: param.renderTo,
            height: $(param.renderTo).height(),
            width:$(param.renderTo).width(),
            back_canvas: null,
            fore_canvas: null,
            config: typeof param.config === 'object' ? param.config : {}
        };

        //生成canvas
        this.createCanvas();

        //初始化
        this.init();

        //返回对外暴露的接口
        return PublicMethod.call(this);
    }

    init() {
        //当前实例所需要的一系列数据
        this.currentWord = instanceProperty(this.param);

        var currentWord = this.currentWord;

        //转换坐标
        currentWord.transformedWord = this.coordinateTransform(currentWord.word, currentWord.width, currentWord.height);
        //转换笔画
        this.convertWord();

        //初始化画板
        this.initCanvasBoards();
    }

    createCanvas() {
        var param = this.param;

        //创建canvas前先把需要渲染canvas的dom结构清空以及解绑canvas的click事件
        $(param.renderTo).find('.canvas_back').off('click');
        $(param.renderTo).empty();

        param.back_canvas = document.createElement('canvas');
        param.back_canvas.setAttribute('width', param.width);
        param.back_canvas.setAttribute('height', param.height);
        param.back_canvas.className = 'canvas_normal canvas_back';

        param.renderTo.appendChild(param.back_canvas);
        //如果是作答态
        if (this.isDrawMode) {
            param.fore_canvas = document.createElement('canvas');
            param.fore_canvas.setAttribute('width', param.width);
            param.fore_canvas.setAttribute('height', param.height);
            param.fore_canvas.className = 'canvas_normal canvas_fore';

            param.renderTo.appendChild(param.fore_canvas);
        }

    }

    //初始化canvas画板
    initCanvasBoards() {

        //先做一次事件解绑
        //初始化背景层
        this.initBackBoard();

        //如果是作答态
        if (this.isDrawMode) {
            //初始化前景层
            this.initForeBoard();
            //事件绑定
            this.eventBind();
        }
    }

    //重置画板
    resetCanvasBoards() {
        //初始化背景层
        this.initBackBoard();

        //如果是作答态
        if (this.isDrawMode) {
            this.currentWord.allowDraw = true;
            this.currentWord.validateStep = 0;
            //初始化前景层
            this.initForeBoard();
        }

        this.currentWord.currentStep = 0;
        this.currentWord.currentStroke = 0;
    }

    //初始化背景层
    initBackBoard(type) {
        console.debug('初始化背景字：', new Date());
        var currentWord = this.currentWord,
            steps = currentWord.convertedWord.steps,
            context = currentWord.back_context,
            radicalInfo = currentWord.radicalInfo,
            structureInfo = currentWord.structureInfo,
            i, j, k, iLen, jLen, kLen;

        context.restore();
        currentWord.back_imageData = null;
        context.clearRect(0, 0, currentWord.width, currentWord.height);


        context.lineWidth = 3;
        for (i = 0, iLen = steps.length; i < iLen; i++) {
            context.fillStyle = this.isDrawMode ?
                currentWord.config.wordColor : currentWord.config.displayColor;
            //根据type来显示特定笔画的颜色
            //显示部首
            if (type && type === CONST_NAME.REDAW_TYPE.RADICAL) {
                if (radicalInfo.stepIndex && radicalInfo.stepIndex.indexOf(i) > -1) {
                    context.fillStyle = radicalInfo.color;
                }
            }

            //显示结构
            if (type && type === CONST_NAME.REDAW_TYPE.STRUCTURE) {
                for (k = 0, kLen = structureInfo.length; k < kLen; k++) {
                    if (structureInfo[k].stepIndex.indexOf(i) > -1) {
                        context.fillStyle = structureInfo[k].color;
                        break;
                    }
                }
            }

            var points = steps[i].points;
            context.beginPath();
            for (j = 0, jLen = points.length; j < jLen; j++) {
                var point = points[j];
                context.lineTo(point.x, point.y);
            }
            context.closePath();
            context.fill();

            //console.log('绘制背景字：', new Date());
        }

        //绘制中线
        if (this.isDrawMode && this.currentWord.showCenterLine) {
            this.drawCenterLine(context, currentWord.convertedWord.strokes);
        }

        currentWord.back_imageData = context.getImageData(0, 0, currentWord.width, currentWord.height);

    }

    /**
     * 绘制中线 绘制所有笔画的中线（实线）
     * @param context canvas绘图上下文对象
     * @param centers 中线坐标点
     */
    drawCenterLine(context, strokes) {
        context.lineWidth = 5;
        context.strokeStyle = 'rgb(0,0,0)';

        strokes.forEach(function (stroke, strokeIndex, strokeArray) {
            context.beginPath();

            //绘制中线
            stroke.centers.forEach(function (center, centerIndex, centerArray) {
                if (centerIndex === 0) {
                    context.moveTo(center.x, center.y);
                }

                context.lineTo(center.x, center.y);
            });

            context.stroke();
        });

    }

    //绘制起点和终点
    //绘制当前引导笔画的中线（虚线）
    drawCurStepCenterLine(context, points) {
        var c = context;

        c.save();
        c.beginPath();
        c.strokeStyle = this.currentWord.config.dashLineColor;

        //步长为4，outLen 为需要循环绘制的次数
        var pointsLen = points.length;
        var outerLen = Math.floor(pointsLen / 4);
        //最后的几个点，即少于4个的点
        var lastPoints = pointsLen % 4;

        for (var i = 0; i < outerLen; i++) {
            var startIndex = i * 4;

            c.moveTo(points[startIndex].x, points[startIndex].y);
            c.lineTo(points[startIndex + 1].x, points[startIndex + 1].y);
            c.lineTo(points[startIndex + 2].x, points[startIndex + 2].y);
        }

        if (lastPoints) {
            startIndex = outerLen * 4;
            c.moveTo(points[startIndex].x, points[startIndex].y);
            c.lineTo(points[pointsLen - 1].x, points[pointsLen - 1].y);
        }

        c.closePath();
        c.stroke();

        c.restore();

    }

    //开启或关闭
    showCanvasGuide(show) {
        if (this.isDisplayMode) return;

        this.currentWord.showGuide = !!show;
        this.nextStep();
    }

    //初始化前景层
    initForeBoard() {
        if (this.isDisplayMode) return;

        var currentWord = this.currentWord,
            context = currentWord.fore_context;

        context.restore();
        currentWord.fore_imageData = null;
        context.clearRect(0, 0, currentWord.width, currentWord.height);
        context.save();

        this.nextStep();

    }

    //绘制一条线，board 画板，points 坐标点[{x:10,y:10},{..}]
    drawLine(board, points) {
        var len = points.length;

        board.beginPath();
        board.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < len; i++) {
            board.lineTo(points[i].x, points[i].y);
        }
        board.stroke();
    }

    //事件绑定
    eventBind() {
        if (this.isDisplayMode) return;

        var fore_canvas = this.currentWord.fore_canvas;

        $(fore_canvas).on('mousedown touchstart', this.startEvent.bind(this));
        $(fore_canvas).on('mousemove touchmove', this.moveEvent.bind(this));
        $(fore_canvas).on('mouseup touchend mouseleave touchleave touchcancel', this.endEvent.bind(this));

    }

    //开始描绘
    startEvent(e) {
        if (!this.currentWord.allowDraw) return;

        this.currentWord.hasDrawed = true;

        var currentWord = this.currentWord,
            context = currentWord.fore_context,
            config = currentWord.config,
            p, p1;

        p1 = mathUtil.getPosition(e.originalEvent);

        p = mathUtil.windowToCanvas(context.canvas, p1.x, p1.y);

        currentWord.isMouseDown = true;

        //设置画笔属性
        context.lineWidth = config.lineWidth;
        context.strokeStyle = config.strokeColor;
        context.lineCap = config.lineCap;
        context.lineJoin = config.lineJoin;

        context.beginPath();
        context.lineTo(p.x, p.y);

        this.pushPoints(p.x, p.y);
    }

    //滑动过程
    moveEvent(e) {

        if (!this.currentWord.isMouseDown || !this.currentWord.allowDraw)
            return;

        var currentWord = this.currentWord,
            context = currentWord.fore_context,
            p, p1;

        p1 = mathUtil.getPosition(e.originalEvent);

        p = mathUtil.windowToCanvas(context.canvas, p1.x, p1.y);

        context.lineTo(p.x, p.y);
        context.stroke();
        this.pushPoints(p.x, p.y);
    }

    //描绘结束
    endEvent(e) {
        if (!this.currentWord.isMouseDown) return;

        this.currentWord.isMouseDown = false;

        if (!this.currentWord.allowDraw)
            return;

        var currentWord = this.currentWord,
            context = currentWord.fore_context;

        context.closePath();

        if (this.validate()) {
            currentWord.isWrongStep = false;
            currentWord.validateStep++;

            this.initBackBoard();

            if (currentWord.validateStep == 1) {
                context.clearRect(0, 0, currentWord.width, currentWord.height);
                //重绘当前笔画
                this.drawLine(context, currentWord.points);
            } else {
                //清空画布
                context.clearRect(0, 0, currentWord.width, currentWord.height);
                context.putImageData(currentWord.fore_imageData, 0, 0);
                //重绘当前笔画
                this.drawLine(context, currentWord.points);
            }

            //重绘后的数据放入fore_imageData
            currentWord.fore_imageData = context.getImageData(0, 0, currentWord.width, currentWord.height);
            //checkImageData(currentWord.fore_imageData);

            if (currentWord.validateStep >= currentWord.convertedWord.strokes.length) {
                currentWord.allowDraw = false;
                return;
            }
            this.nextStep();
        }
        else {
            //c.fillRect(0, 0, currentWord.width, currentWord.height);
            currentWord.isWrongStep = true;
            //c.restore();
            context.clearRect(0, 0, currentWord.width, currentWord.height);
            if (currentWord.fore_imageData) {
                context.putImageData(currentWord.fore_imageData, 0, 0);
            }

            //如果是关闭引导状态，笔画写错
            if (!currentWord.showGuide) {
                this.nextStep(currentWord.isWrongStep);
            } else {
                this.nextStep(!currentWord.isWrongStep);
            }
        }
    }

    nextStep(isWrong) {
        var currentWord = this.currentWord;

        //每次进入都要把闪烁动画的计时器清空
        clearInterval(currentWord.flickerTimer);

        if (currentWord.validateStep >= currentWord.convertedWord.strokes.length) {
            return
        }

        var c = currentWord.back_context, points, point,
            validateStep = currentWord.validateStep,
            strokes = currentWord.convertedWord.strokes,
            segments = strokes[validateStep].segments,
            flickerTimes = 0;

        currentWord.lastPoint = null;
        currentWord.points = [];

        c.restore();


        if (currentWord.showGuide || isWrong) {
            c.save();


            c.fillStyle = currentWord.config.guideColor;
            c.strokeStyle = currentWord.config.guideColor;
            c.beginPath();

            for (var i = 0, iLength = segments.length; i < iLength; i++) {
                points = segments[i].points;
                for (var j = 0; j < points.length; j++) {
                    point = points[j];
                    if (j == 0)
                        c.moveTo(point.x, point.y);
                    c.lineTo(point.x, point.y);
                }
            }

            c.closePath();
            c.fill();
            c.clip();

            //绘制引导线
            this.drawCurStepCenterLine(c, strokes[validateStep].centers);
            //如果是关闭引导状态下，书写错误，则闪烁显示正确笔画
            if (!currentWord.showGuide && isWrong) {
                currentWord.flickerTimer = setInterval(function () {

                    if (flickerTimes++ % 2 === 0) {
                        c.strokeStyle = currentWord.config.dashLineColor;
                    } else {
                        c.strokeStyle = currentWord.config.guideColor;
                    }

                    c.stroke();

                    if (flickerTimes >= currentWord.flickerTimes) {
                        flickerTimes = 0;
                        clearInterval(currentWord.flickerTimer);
                        c.clearRect(0, 0, currentWord.width, currentWord.height);
                        c.putImageData(currentWord.back_imageData, 0, 0);
                    }
                }, currentWord.flickerInterval);
            }

        } else {
            c.clearRect(0, 0, currentWord.width, currentWord.height);
            c.putImageData(currentWord.back_imageData, 0, 0);
        }
    }

    //校验
    validate() {
        //当前需要判断的笔划
        var currentWord = this.currentWord,
            config = currentWord.config,
            validateRange = config.validateRange,
            stroke = currentWord.convertedWord.strokes[currentWord.validateStep],
        //笔划边框坐标
            framePoints = stroke.segments,
        //中心线
            centers = stroke.centers,
        //手写的坐标点
            points = currentWord.points,
            pointsLen = currentWord.points.length,
            centersLen = centers.length,
        //相似点的个数
            similarCount1 = 0, similarCount2 = 0,
        //在笔划区域内点的个数
            insideCount = 0,
        //点相似度
            centerRate1 = 0, centerRate2 = 0,
        //填充率
            fillRate = 0,

            first = 0, last = 0,//头坐标距离，尾坐标距离
            p2pDis1 = 0, p2pDis2 = 0;

        first = mathUtil.pointToPoint(centers[0], points[0]);
        last = mathUtil.pointToPoint(centers[centersLen - 1], points[pointsLen - 1]);

        //首尾点的比对
        if (first > validateRange.hLimit || last > validateRange.tLimit) {
            return false;
        }

        for (var i = 0; i < pointsLen; i++) {
            //判断点是否在笔画内
            if (mathUtil.isPointInPoly(points[i], framePoints)) {
                insideCount++;
            }

        }

        fillRate = insideCount / pointsLen;

        if (fillRate < config.fillRate || pointsLen < validateRange.minCount) {
            return false;
        }

        return true;
    }

    //将书写的坐标点存入points
    pushPoints(x, y) {
        var currentWord = this.currentWord,
            lastPoint = currentWord.lastPoint,
            points = currentWord.points;

        if (!lastPoint || lastPoint.getDistance({"x": x, "y": y}) >= 2) {
            lastPoint = new Point(x, y);
            points.push(lastPoint);
        }
    }

    //笔画转换，转换为可用的笔画
    convertWord() {
        var currentWord = this.currentWord,
            transformedWord = $.extend({}, currentWord.transformedWord),
            strokes = transformedWord.strokes,
            strokeInfo = transformedWord.strokeInfo,
            radicalStepindex = [],
            structureStepIndex = [],
            color, structureInfo, info, temp,
            i, j, k, m, len, iLen, jLen, kLen, mLen;

        //部首信息
        currentWord.radicalInfo = {
            stepIndex: [],
            color: ''
        };
        //结构信息
        currentWord.structureInfo = [];

        //转换部首信息
        if (strokeInfo && strokeInfo.radicalInfo && strokeInfo.radicalInfo.oriColor && strokeInfo.radicalInfo.oriColor.length == 3) {

            color = strokeInfo.radicalInfo.oriColor;

            currentWord.radicalInfo.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            radicalStepindex = strokeInfo.radicalInfo.strokeIndex.split(',').map(function (value) {
                return parseInt(value)
            });
        }

        if (strokeInfo && strokeInfo.structureInfos && strokeInfo.structureInfos.length > 0) {
            temp = [];
            for (i = 0, len = strokeInfo.structureInfos.length; i < len; i++) {

                structureInfo = strokeInfo.structureInfos[i];
                info = {
                    color: '',
                    stepIndex: []
                };

                color = structureInfo.oriColor;

                info.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

                temp = structureInfo.strokeIndex.split(',').map(function (value) {
                    return parseInt(value);
                });

                structureStepIndex[i] = temp;

                currentWord.structureInfo.push(info);
            }
        }

        //笔画转换
        transformedWord.steps = [];

        for (i = 0, iLen = strokes.length; i < iLen; i++) {
            var centers = strokes[i].centers, segments = strokes[i].segments;

            currentWord.strokesMap[i] = [];

            for (j = 0, jLen = centers.length; j < jLen; j++) {
                centers[j] = new Point(centers[j].x, centers[j].y);
            }
            for (j = 0, jLen = segments.length; j < jLen; j++) {
                segments[j].start = new Point(segments[j].start.x, segments[j].start.y);
                segments[j].end = new Point(segments[j].end.x, segments[j].end.y);
                var points = segments[j].points;
                for (k = 0, kLen = points.length; k < kLen; k++) {
                    points[k] = new Point(points[k].x, points[k].y);
                }

                //因为转换的笔画与元数据中笔画要多，故这样操作一次保证，部首和结构中有一只的笔画数字
                if (radicalStepindex.indexOf(i) > -1) {
                    currentWord.radicalInfo.stepIndex.push(transformedWord.steps.length);
                }

                for (m = 0, mLen = structureStepIndex.length; m < mLen; m++) {
                    if (structureStepIndex[m].indexOf(i) > -1) {
                        currentWord.structureInfo[m].stepIndex.push(transformedWord.steps.length);
                        break;
                    }
                }

                currentWord.strokesMap[i].push(transformedWord.steps.length);

                transformedWord.steps.push({
                    "line": new Line(segments[j].start, segments[j].end),
                    "points": points
                });


            }
        }

        currentWord.convertedWord = transformedWord;
        currentWord.strokesLength = transformedWord.strokes.length;
        currentWord.autoTraceSteps = transformedWord.steps.length;

    }

    //动画相关,开始动画
    startAnimation(type) {
        var currentWord = this.currentWord;

        currentWord.$autoAnimateDeferred = $.Deferred();

        currentWord.traceType = type;
        this.initBackBoard();
        currentWord.currentStep = 0;//每次开始描红需要将currentStep置为0


        if( type == CONST_NAME.TRACE_TYPE.AUTO ) {
            //开始自动描红
            this.draw();
        } else {
            //分步描红设置速度为normal
            this.setSpeed();
        }

        return currentWord.$autoAnimateDeferred.promise();

    }

    //停止描红
    stopAnimation() {
        cancelAnimationFrame(this.currentWord.loop);
        this.currentWord.loop = 0;
        this.currentWord.$animateDeferred = null;
        //this.currentWord.back_context.restore();
        this.initBackBoard();
    }

    //是否在自动描红
    isInAnimation() {
        return this.currentWord.loop === 0 ? false : true;
    }

    //设置速度
    setSpeed(speed) {
        var animateSpeed;

        switch (speed) {
            case 'fast':
                animateSpeed = CONST_NAME.SPEED.FAST;
                break;
            case 'slow':
                animateSpeed = CONST_NAME.SPEED.SLOW;
                break;
            default:
                animateSpeed = CONST_NAME.SPEED.NORMAL;
        }

        this.currentWord.speed = animateSpeed;
    }

    //开始动画
    draw() {

        var currentWord = this.currentWord,
            currentStroke = currentWord.currentStroke,
            context = currentWord.back_context,
            config = currentWord.config;

        //分步描红的时候，用延迟对象通知描红结束
        this.currentWord.$stepAnimateDeferred = $.Deferred();

        var $deferred = this.currentWord.$stepAnimateDeferred;

        var returnInfo = {
            currentStep: currentStroke,
            totalStep: currentWord.strokesLength
        };

        if( currentStroke >= currentWord.strokesLength ) {
            currentWord.loop = 0;

            $deferred.resolve(returnInfo);
            currentWord.$autoAnimateDeferred.resolve(returnInfo);

            return $deferred.promise();
        }

        //设置动画填充颜色
        context.fillStyle = currentWord.config.animateColor;
        context.lineCap = config.lineCap;
        context.lineJoin = config.lineJoin;

        this.animateByStroke();

        return $deferred.promise();
    }

    //按笔画来描红，steps是stroke的子集
    animateByStroke() {
        var currentStroke = this.currentWord.currentStroke;
        var steps = this.currentWord.strokesMap[currentStroke];

        if(!Array.isArray(steps)) {
            throw new Error("stroke does not exist.");
        }

        this.animateBySteps();

    }

    //单个笔画拆分为几个step
    animateBySteps() {
        var currentWord = this.currentWord;
        var steps = currentWord.strokesMap[currentWord.currentStroke];
        var currentStep = steps[currentWord.currentStep];
        var len = steps.length;


        if (currentWord.currentStep >= len) {
            //如果当前stroke已经绘制完成
            currentWord.currentStep = 0;
            currentWord.currentStroke++;

            //描绘下一笔
            if(currentWord.traceType == CONST_NAME.TRACE_TYPE.AUTO){

                this.draw();

            } else {
                //分步描红，绘制完一笔，resolve 延迟对象
                currentWord.$stepAnimateDeferred.resolve({
                    currentStep: currentWord.currentStroke,
                    totalStep: currentWord.strokesLength
                });
            }

        } else {

            var step = currentWord.convertedWord.steps[currentStep];
            //分割出动画区域
            currentWord.back_context.save();
            this.setClipPath(currentWord.back_context, step.points);
            this.animate(currentWord, step);
        }


    }

    //开始动画
    animate(currentWord, step) {
        var interval = 0,
            maxValue = step.line.getLength();

        function animateInner() {
            interval += currentWord.speed;

            if (interval >= maxValue)
                interval = maxValue;

            this.drawAnimationFrame(currentWord.back_context, step, interval);

            if (interval == maxValue) {
                cancelAnimationFrame(currentWord.loop);
                ++currentWord.currentStep;
                currentWord.back_context.restore();

                this.animateBySteps();
                return;
            }
            currentWord.loop = requestAnimationFrame(animateInner.bind(this));
        }

        currentWord.loop = requestAnimationFrame(animateInner.bind(this));
    }

    //绘制要展示动画的区域,即绘制currentStep
    setClipPath(context, currentStepPoints) {
        var point;

        context.beginPath();
        for (var i = 0, len = currentStepPoints.length; i < len; i++) {
            point = currentStepPoints[i];
            context.lineTo(point.x, point.y);
        }
        context.closePath();
        context.clip();
    }

    //animation frame
    drawAnimationFrame(context, step, interval) {
        var point,
            rectAry = step.line.getRectangle(500, interval);

        context.beginPath();
        for (var i = 0, len = rectAry.length; i < len; i++) {
            point = rectAry[i];
            context.lineTo(point.x, point.y);
        }
        context.closePath();
        context.fill();
    }

    //单步描红时，上一笔操作，实际就是撤销
    preStep() {

        var currentWord = this.currentWord;
        var currentStroke = currentWord.currentStroke;

        var stepsInfo = {
            currentStep: currentStroke,
            totalStep: currentWord.strokesLength
        };

        //初始化一遍背景字
        this.initBackBoard();

        var context = currentWord.back_context;
        var currentStroke = --currentWord.currentStroke;

        if(this.currentWord.traceType != CONST_NAME.TRACE_TYPE.STEP || currentStroke <= 0){
            currentWord.currentStroke = 0;
            stepsInfo.currentStep = 0;
            return stepsInfo;
        }

        var mapIndex = this.currentWord.strokesMap[currentStroke - 1];
        var maxStep = mapIndex[mapIndex.length-1];

        var steps = currentWord.convertedWord.steps;

        context.fillStyle = currentWord.config.animateColor;

        for(var i = 0; i <= maxStep; i++) {

            var points = steps[i].points;

            context.beginPath();

            for (var j = 0, jLen = points.length; j < jLen; j++) {
                var point = points[j];
                context.lineTo(point.x, point.y);
            }

            context.closePath();
            context.fill();
        }

        stepsInfo.currentStep = currentStroke;

        return stepsInfo;

    }


    //绘制特定笔画
    drawSingleStroke(context, step) {
        var points = step.points;
        context.beginPath();
        for (var i = 0, iLen = points.length; i < iLen; i++) {
            var point = points[i];
            context.lineTo(point.x, point.y);
        }
        context.closePath();
        context.fill();
    }

    //坐标等比转换为适合当前canvas的大小
    coordinateTransform(originalWord, canvasWidth, canvasHeight) {
        var newWord = $.extend({}, originalWord),
            originalSize = newWord.size,
            scaleX = canvasWidth / originalSize,
            scaleY = canvasHeight / originalSize;

        if (originalSize === canvasWidth) {
            return newWord;
        }

        newWord.size = canvasWidth;

        for (var i = 0; i < newWord.strokes.length; i++) {
            for (var j = 0; j < newWord.strokes[i].centers.length; j++) {
                newWord.strokes[i].centers[j].x = newWord.strokes[i].centers[j].x * scaleX;
                newWord.strokes[i].centers[j].y = newWord.strokes[i].centers[j].y * scaleY;
            }

            for (var k = 0; k < newWord.strokes[i].segments.length; k++) {
                newWord.strokes[i].segments[k].start.x = newWord.strokes[i].segments[k].start.x * scaleX;
                newWord.strokes[i].segments[k].start.y = newWord.strokes[i].segments[k].start.y * scaleY;

                newWord.strokes[i].segments[k].end.x = newWord.strokes[i].segments[k].end.x * scaleX;
                newWord.strokes[i].segments[k].end.y = newWord.strokes[i].segments[k].end.y * scaleY;

                for (var l = 0; l < newWord.strokes[i].segments[k].points.length; l++) {
                    newWord.strokes[i].segments[k].points[l].x = newWord.strokes[i].segments[k].points[l].x * scaleX;
                    newWord.strokes[i].segments[k].points[l].y = newWord.strokes[i].segments[k].points[l].y * scaleY;
                }
            }
        }

        return newWord;
    }

    //坐标转换之后，对应的起终点判断范围也要等比变化
    scaleValidateRange() {
        //当前生字使用的坐标系大小 size * size
        var size = this.currentWord.transformedWord.size;
        var validateRange = this.currentWord.config.validateRange;
        //计算当前size对标准size的倍率
        var scale = size / validateRange.standardSize;

        //乘上倍率，得到当前size下适合的检验范围
        validateRange.hLimit *= scale;
        validateRange.tLimit *= scale;
    }

    //输出前景层base64,png
    getBase64Image() {
        if (this.isDisplayMode) return;

        var base64Image = this.currentWord.fore_canvas.toDataURL().replace('data:image/png;base64,', '');

        //console.log(base64Image);
        return [{key: 'traceData', value: base64Image}];
    }

}

export default ChineseWordTracing;
