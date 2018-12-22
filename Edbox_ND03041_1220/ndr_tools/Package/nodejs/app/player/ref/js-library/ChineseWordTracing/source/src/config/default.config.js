/**
 * Created by Administrator on 2016/12/15.
 * 描红中用到的默认配置
 */
export default {
    showGuide: true, //是否引导
    wordColor: 'rgb(248,205,198)',//背景字颜色
    dashLineColor: 'rgb(248,205,198)',//引导虚线的颜色
    displayColor: 'rgb(136,136,136)',//展示态的背景字颜色
    guideColor: 'rgb(33,166,233)',//引导颜色
    strokeColor: 'rgb(222,73,30)',
    animateColor: 'rgb(247,63,52)',
    lineWidth: 10.9,
    lineCap: 'round',
    lineJoin: 'round',
    isWrongStep: false,
    fillRate: 0.8,
    centerRate1: 0,
    centerRate2: 0,
    //校验值
    validateRange: {
        standardSize: 500,//标准的坐标系大小，生字资源坐标均为在500x500的坐标系下的位置
        hLimit: 29,//允许的起始点范围
        tLimit: 25,//允许的结束点范围
        cLimit: 7,
        minCount: 5//书写笔画中至少要有5个点
    }
}
