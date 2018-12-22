## 生字描红接口

### 创建新的实例
- 参数param
```
{
mode: 'display' || 'draw',//展示态 or 作答态
word: {...}, //生字坐标数据
renderTo: element //需要渲染canvas的dom
}
```
```
var newWord = new ChineseWordTracing(param)
```

### 接口
#### 作答态接口
1. allowDraw(allow)
允许或禁止绘制
- 参数

参数 | 类型 | 描述
--- | --- | ---
allow | Boolean | true:允许绘制 false:禁止绘制



- 用法
```
newWord.allowDraw(true);
```

2. showGuide(show)
显示或隐藏引导
- 参数

参数 | 类型 | 描述
--- | --- | ---
show | Boolean | true:显示 false:隐藏



- 用法
```
newWord.allowDraw(true);
```
3. getBase64Image()
获取base64数据
- 参数，无
- 返回值 base64

- 用法
```
var base64Data = newWord.getBase64Image();
```

#### 展示态接口
1. showRadical()
展示部首
- 参数，无
- 返回值 无

- 用法
```
newWord.showRadical();
```
2. hideRadical()
不展示部首
- 参数
无
- 返回值
无

- 用法
```
newWord.hideRadical();
```
3. showStructure()
展示结构
- 参数
无
- 返回值
无

- 用法
```
newWord.showStructure();
```
4. hideStructure()
不展示结构
- 参数
无
- 返回值
无

- 用法
```
newWord.hideStructure();
```
5. startAutoTrace()
开始自动描红
- 参数
无
- 返回值,Promise
```
promise.done(info);
info: {
     currentStep: //当前笔画,
     totalStep: //总笔画数
}
```

- 用法
```
var tracePromise = newWord.startAutoTrace();
tracePromise.done(function(info){
    console.log(info);
});
```
6. stopAutoTrace()
停止自动描红
- 参数
无
- 返回值
无

- 用法
```
newWord.stopAutoTrace();
```

7. startSingleStepTrace()
开始分步描红
- 参数
无
- 返回值,无

- 用法
```
newWord.startSingleStepTrace();
```

7. nextStep()
分步描红，下一笔
- 参数
无
- 返回值,Promise
```
//延迟对象resolve后的值
{
    currentStep: //当前第几笔,
    totalStep: //总共笔画数
}
```

- 用法
```
var tracePromise = newWord.nextStep();

tracePromise.done(function(info){
    console.log(info);
});
```

8. preStep()
分步描红，下一笔
- 参数
无
- 返回值,Object
```
{
    currentStep: //当前第几笔,
    totalStep: //总共笔画数
}
```

- 用法
```
var traceInfo = newWord.preStep();

```
8. setSpeed(type)
设置描红速度
- 参数

参数 | 类型 | 可选值
---|---|---
type | string | "fast":快 <br>"normal": 正常 <br>"slow": "慢速"

- 返回值
无

- 用法
```
newWord.setSpeed("slow");

```

9. getTraceProgress()
设置描红速度
注意：此方法返回值与分步描红返回值有差别
- 参数
无

- 返回值,Object
```
{
    curStep: //当前step,
    totalSteps: //总的step,
    isInAnimation: //是否在动画中
}
```

- 用法
```
newWord.getTraceProgress();

```

#### 通用方法
1. reset()
恢复至初始状态
- 参数
无
- 返回值
无

- 用法
```
newWord.reset();
```

#### 备注
1. 自动描红与分步描红的切换
```
//自动描红 => 分步描红
newWord.stopAutoTrace();//停止自动描红
newWord.reset();//重置
newWord.startSingleStepTrace();//开始自动描红

//下一步
var tracePromise = newWord.nextStep();

tracePromise.done(function(info){
    console.log(info);
});

//上一步
var traceInfo = newWord.preStep();

```

```
//分步描红 => 自动描红
newWord.reset();//重置

var tracePromise = newWord.startAutoTrace();
tracePromise.done(function(info){
    console.log(info);
});

```




