/**
 * 互动课堂工具类
 *
 * @author linyq,linlw
 * @version 2.0.8
 * @last modified 2016-10-18
 */
var ClassroomUtils = (function() {

    var o = {};

    // 是否App端
    var isApp = (typeof Bridge != "undefined");

    /**
     * 互动课堂JSBridge类定义
     * @const
     */
    var ICR_JS_BRIDGE = "com.nd.pad.icr.ui.IcrJsBridge";

    /**
     * 角色类型常量
     * @const
     */
    o.ROLE_TYPES = {
        STUDENT: "STUDENT", // 学生
        TEACHER: "TEACHER" // 老师
    };

    /**
     * 发送事件
     * @param eventName {string} 事件名称
     * @param options {Object} 候选项
     *  - options.source {string} source参数，默认为''，建议传入model.addonID
     *  - options.isApp {boolean} 是否发往App端，默认为false
     *  - options.value {Object} value参数，默认为{}
     *  - options.type {string} type参数，默认为''
     *  - options.item {string} item参数，默认为''
     */
    o.fireEvent = function(eventName, options, isNeedCallback) {
        if (!options) options = {};
        var eventData = {
            value: {}
        };

        for (var prop in options) {
            if (options.hasOwnProperty(prop) && prop !== undefined && prop !== null) {
                eventData[prop] = options[prop];
            }
        }

        // 发送事件给H5事件总线
        if (player && player.getPlayerServices() && player.getPlayerServices().getEventBus()) {
            player.getPlayerServices().getEventBus().sendEvent(eventName, eventData);
        }
        // 只给APP事件总线传必要的事件
        if (options.isApp) {
            return o.sendNativeEvent(eventName, eventData, isNeedCallback);
        }
    };

    /**
     * 发送UserInput事件
     * @param options {Object} 候选项
     *  - options.source {string} source参数，默认为''，建议传入model.addonID
     *  - options.value {Object} value参数，默认为{}
     *  - options.type {string} type参数，默认为''
     *  - options.item {string} item参数，默认为''
     */
    o.fireUserInputEvent = function(options) {
        options = options || {};
        options.isApp = true;
        o.fireEvent("UserInput", options);
    };

    /**********************************************************************************************************
     * Native接口
     * Wiki：http://wiki.sdp.nd/index.php?title=%E4%BA%92%E5%8A%A8%E8%AF%BE%E5%A0%82/Native%E6%8E%A5%E5%8F%A3
     **********************************************************************************************************/
    /**
     * 0. 判断是否App端
     * @return {boolean} 是否App端
     */
    o.isApp = function() {
        return isApp;
    };

    /**
     * 1. 调用Native接口
     * @param methodName {string} 调用方法名
     * @param parameters {Object} 调用参数
     * @return
     */
    o.callNative = function(methodName, parameters) {
        var res = null;
        var params = parameters || {};
        if (isApp && Bridge && Bridge.callNative) {
            res = Bridge.callNative(ICR_JS_BRIDGE, methodName, params);
        }
        return res;
    };
    var callNative = o.callNative; // 增加内部变量，防止以后有人再写错

    /**
     * 1.1. 发送Native事件
     * @param eventName {string} 事件名称
     * @param eventData {Object} 事件参数
     */
    o.sendNativeEvent = function(eventName, eventData, isNeedCallback) {
        var resp = o.callNative("sendEvent", {
            "eventName": eventName,
            "eventData": eventData,
            "needCallback": Boolean(isNeedCallback)
        });
        return resp;
    };

    /**
     * 1.2. 批注册Native事件
     * @param eventHandlers {Map<string, Function>} 事件处理器集合<事件名称, 事件处理函数>
     * @return {Map<string, Object>} 事件处理器集合<事件名称, 监听器Key名称>
     */
    o.addNativeEventListeners = function(eventHandlers) {
        var eventListeners = {};
        var handler;

        if (isApp && Bridge && Bridge.registerListener) {
            for (var eventName in eventHandlers) {
                handler = eventHandlers[eventName];
                if (eventHandlers.hasOwnProperty(eventName) && handler) {
                    eventListeners[eventName] = Bridge.registerListener(eventName, handler);
                }
            }
        }
        return eventListeners;
    };

    /**
     * 1.2. 批注销Native事件监听器
     * @param eventListeners {Map<string, Object>} 事件处理器集合<事件名称, 监听器Key名称>
     */
    o.removeNativeEventListeners = function(eventListeners) {
        var eventListener;
        if (isApp && Bridge && Bridge.unRegisterListener) {
            for (var eventName in eventListeners) {
                eventListener = eventListeners[eventName];
                if (eventListeners.hasOwnProperty(eventName) && eventListener) {
                    Bridge.unRegisterListener(eventName, eventListener);
                }
            }
        }
    };

    /** 1.3 输出log到SD卡
     *  @param message {string} 日志内容
     @param level {string}   日志等级,默认为d,调试
     */
    o.log = function(message, level) {
        level = level || "d";
        o.callNative("log", {
            "level": level,
            "message": message
        });
    }

    /**
     * 1.4 输出性能log到SD卡
     *  @param message {string} 日志内容
     */
    o.logForTest = function(message) {
        o.callNative("logForTest", {
            "message": message
        });
    };

    /**
     * 2.1. 是否预览模式
     * @return {boolean} 是否预览模式
     */
    o.isPreview = function() {
        var isPreview = false; // 默认非预览模式
        var res = o.callNative("getPlayMode");
        if (res && res.isPreview) {
            isPreview = res.isPreview;
        }
        return isPreview;
    };

    /**
     * 2.2. 获取当前用户数据
     *
     * @return {Object} 当前用户数据
     *  - userType {enum<string>} STUDENT-学生，TEACHER-教师
     *  - number {string} 学号
     *  - name {string} 姓名
     *  - group {string} 所在分组名称
     *  - isProjector {boolean} 是否在投影模式
     */
    o.getCurrentUserInfo = function() {
        var res = null;
        res = o.callNative("getCurrentUserInfo") || {
            isProjector: false
        };
        return res;
    };


    /**
     * 对数组中的元素排序，多个字段排序
     */
    var multiCompare = function(a, b, orderArray, index) {
        if (index === orderArray.length) {
            return 0;
        }
        var orderProperty = orderArray[index].orderProperty;
        var orderType = orderArray[index].orderType;
        var desc;
        if (orderType === "desc") {
            desc = -1;
        } else {
            desc = 1;
        }
        if (!a[orderProperty]) {
            if (!b[orderProperty]) {
                return multiCompare(a, b, orderArray, index + 1);
            } else {
                return 1 * desc;
            }
        } else {
            if (!b[orderProperty]) {
                return -1 * desc;
            } else {
                if (a[orderProperty] === b[orderProperty]) {
                    return multiCompare(a, b, orderArray, index + 1);
                } else {
                    return singleCompare(a, b, orderProperty, orderType);
                }
            }
        }
    };
    /**
     * 对单个属性进行排序的函数
     * options为排序的信息--Object
     * orderProperty：执行排序的属性名称
     * orderType--asc/desc 升序或者降序排列
     */
    var singleCompare = function(a, b, orderProperty, orderType) {
        var returnNum = 0;
        if (a[orderProperty] > b[orderProperty]) {
            returnNum = 1;
        } else if (a[orderProperty] < b[orderProperty]) {
            returnNum = -1;
        } else {
            returnNum = 0;
        }
        if (orderType === 'desc') {
            returnNum = returnNum * (-1);
        }
        return returnNum;
    };
    /**
     * 2.4. 获取当前班级的所有学生信息
     * @since v0.3.61
     *
     * @return {List<Object>} 学生数组
     * options为排序的信息--Object
     * orderProperty：执行排序的属性名称
     * orderType--asc/desc 升序或者降序排列
     */
    o.getCurrentStudents = function(options) {
        var students = [];
        var res = o.callNative("getCurrentStudents");
        if (res && res.students) {
            students = res.students;
            var userInfo = o.getCurrentUserInfo();
            var isTeacher = (userInfo.userType === o.ROLE_TYPES.TEACHER);
            var isProjector = userInfo.isProjector;
            if (isTeacher && !isProjector) { // 只有老师端使用离线头像
                var length = students.length;
                for (var i = 0; i < length; i++) {
                    var stu = students[i];
                    if (stu && stu.headIconOffline) {
                        stu.headIcon = stu.headIconOffline;
                    }
                }
            }
            if (options) {
                if (options.order) {
                    //新版本排序，支持多个字段排序
                    students.sort(function(a, b) {
                        return multiCompare(a, b, options.order, 0);
                    });
                } else {
                    //旧版本排序
                    if (options.orderProperty) {
                        students.sort(function(a, b) {
                            return singleCompare(a, b, options.orderProperty, options.orderType);
                        });
                    }
                }
            }
        }
        return students;
    };

    /**
     * 2.5. 获取当前班级的分组信息
     * @since v0.3.61
     *
     * @return {List<Object>} 分组数组
     */
    o.getCurrentGroups = function() {
        var groups = [];
        var res = o.callNative("getCurrentGroups");
        if (res && res.groups) {
            groups = res.groups;
        }
        return groups;
    };

    /**
     * 2.6. 获取APK版本号
     * @since v0.3.105
     * @return {integer} APK内部版本号
     */
    o.getAppVersion = function() {
        var version = null;
        var res = o.callNative("getAppVersion");
        if (res && res.version) {
            version = res.version;
        }
        return version;
    };

    /**
     * 2.7. 获取master端系统当前时间（单位：毫秒）
     * @since v2.0.1.1
     * @return {integer} 时间戳
     */
    o.getMasterSystemTimeMS = function() {
        var masterSystemTime = 0;
        var res = o.callNative("getMasterSystemTime");
        if (res && res.time) {
            masterSystemTime = res.time;
        }
        return masterSystemTime;
    };
    /**
     * 2.8. 获取master端系统当前时间（单位：秒）
     * @since v2.0.1.1
     * @return {integer} 时间戳
     */
    o.getMasterSystemTime = function() {
        var masterSystemTime = 0;
        var res = o.callNative("getMasterSystemTime");
        if (res && res.time) {
            masterSystemTime = res.time;
        }
        return parseInt(masterSystemTime / 1000);
    };
    /**
     * 3.1. 获取APK版本信息
     * @since v0.3.105
     * @param appId {string} app的ID
     * @return {Object} apk信息
     */
    o.getAppInfo = function(appId) {
        var info = o.callNative("getAppInfo", {
            appId: appId
        }) || {};
        return info;
    };

    /**
     * 启动教育FAQ应用
     * @since v0.3.83
     */
    o.startFaq = function() {
        o.callNative("startFaq");
    };

    /**
     * 3.2. 获取学科工具信息
     * @since
     */
    o.getSubjectToolInfo=function (toolkey) {
        return o.callNative("getSubjectToolInfo",{toolKey: toolkey})||{};
    };

    /**
     * 4.2.  初始化native工具栏
     * @since v0.3.106
     * @param pageId:{string}  // 当前ppt页码的参数
     */
    o.initToolbar = function(pageId) {
        o.callNative("initToolbar", {
            pageId: pageId
        });
    };

    /**
     * 4.3.   控制工具栏按钮按下或弹起
     * @since  v0.3.106
     @param buttons {List<Object>}  按钮数组
     *  - Object.type: {string}, // default: button 可选
     *  - Object.id: {string}, // 控件的ID，choose=选择，syncPage=推送屏幕，exam=发送任务，pen=画笔，eraser=橡皮擦
     *  - Object.isPressed: {boolean}, // 按钮是否被按下
     *  - Object.text: {String} // 按钮的文本，可选
     */
    o.setToolbarState = function(buttons) {
        o.callNative("setToolbarState", {
            items: buttons
        });
    };


    /**
     * 4.4.   控制Native组件显示或隐藏
     * @since  v0.3.106
     @param modules {List<Object>} 组件数组
     *  - Object.moduleId {string} 组件的ID，toolBar=工具栏,drawPanel=画笔轨迹, exit=退出课堂
     *  - Object.visible {boolean} 是否显示
     */
    o.setNativeModuleVisibility = function(modules) {
        o.callNative("setNativeModuleVisibility", {
            items: modules
        });
    };

    /**
     * 4.5.  切换不同页面的画笔轨迹
     * @since  v0.3.106
     * @param pageId: {string} // 页面的ID
     */
    o.changeDrawingPage = function(pageId) {
        o.callNative("changeDrawingPage", {
            pageId: pageId
        });
    };
    /**
     * 4.6.  添加画笔不可绘画区域
     * @since  v0.3.110
     * @param clip {Object} //  区域对象
     -Object.key: {int} // 区域键 需大于10 同一个页面不同区域的键不相同，不同页面可以重复使用。1-5 智慧课堂使用 ，6-10 ppt导航、对话框使用
     -Object.left：{int} //区域的left
     -Object.top: {int} //区域的top
     -Object.right:{int} //区域的right
     -Object.bottom:{int} //区域的bottom
     */
    o.addClip = function(clip) {
        o.callNative("addClip", clip);
    };

    /**
     * 4.7.  删除画笔不可绘画区域
     * @since  v0.3.110
     * @param key {int} // 区域键 需大于10 同一个页面不同区域的键不相同，不同页面可以重复使用。1-5 智慧课堂使用，6-10 ppt导航、对话框使用
     */
    o.removeClip = function(key) {
        o.callNative("removeClip", {
            key: key
        });
    };


    /**
     * 创建Presenter
     * @param presenterId {string} presenter的Id，不可为空
     * @param instanceId {string} 实例的Id，不可为空
     * @param options {Object} 可选参数
     * @param options.initData {object} 初始化所需的数据，可自定义，可以为空
     * @param options.containerName {string} 容器名称，可以不传，目前支持"ENHANCE"（增强层，默认值）与"TOOLBOX"（工具箱层）, since V05
     */
    o.createPresenter = function(presenterId, instanceId, options) {
        options = options || {};
        var res = o.callNative("createPresenter", {
            presenterId: presenterId,
            instanceId: instanceId,
            containerName: options.containerName,
            initData: options.initData
        });
        return res;
    };

    /**
     * 销毁Presenter
     * @param instanceId {string} 实例的Id，不可为空
     */
    o.destroyPresenter = function(instanceId) {
        var res = o.callNative("destroyPresenter", {
            instanceId: instanceId
        });
        return res;
    };

    /**
     * 创建Presenter
     * @param instanceId {string} 实例的Id，不可为空
     * @param visible  {boolean} true-显示，false-隐藏，不可为空
     */
    o.setPresenterVisibility = function(instanceId, visible) {
        var res = o.callNative("setPresenterVisibility", {
            instanceId: instanceId,
            visible: visible
        });
        return res;
    };


    /**
     *  向指定原生presenter发送消息
     * @since
     * @param   instanceId: {string}, // 实例的Id，不可为空
     * @param type: {string}, // 消息类型，不可为空
     * @param data: {object}, // 消息数据，可自定义，可以为空
     */
    o.sendToPresenter = function(instanceId, type, data) {
        var res = o.callNative("sendToPresenter", {
            instanceId: instanceId,
            type: type,
            data: data
        });
        return res;
    };


    /**
     * 获取当前课堂情况
     * @return {object}  课堂信息对象
     */
    o.getLessonInfo = function() {
        var res = o.callNative("getLessonInfo", {});
        return res;
    };

    /**
     * 4.8.  学生信息工具栏显示/隐藏 （已废弃）
     * @since  v0.3.110
     * @param toolbar {Object} //  工具栏对象
     -Object.visible: {boolean} //true=显示  false=隐藏(必选)
     -Object.number:{string}, //学号 （可选）
     -Object.name:{string},   //名字 （可选）
     -Object.group:{string}   //小组 （可选）
     */
    /* o.nativeStudentToolbar = function(toolbar) {
     o.callNative("nativeStudentToolbar", toolbar);
     };*/

    /**
     * 4.9.   Native 锁屏
     * @since  v0.3.110
     * @param isLock {boolean}   是否锁屏
     */
    o.setNativeLockScreen = function(isLock) {
        o.callNative("nativeLockScreen", {
            lock: isLock
        });
    };

    /**
     * 4.10.  native 送花动画
     * @since  v0.3.118
     * @param isShow {boolean}   显示/隐藏
     */
    o.showFlower = function(isShow) {
        o.callNative("showFlower", {
            show: isShow
        });
    };

    /**
     * 4.11.  草稿纸
     * @since  v0.3.118
     * @param isEnabled  {boolean}, // 是否激活草稿纸
     * @param contentId  {string} // 内容ID，激活草稿纸时才需要传入
     */
    o.setDraft = function(isEnabled, contentId) {
        var options = {
            enabled: isEnabled
        };
        if (contentId) {
            options.contentId = contentId;
        };
        o.callNative("nativeDraft", options);
    };

    /**
     * 4.12. 设备震动
     * @since  v0.3.122 版本号 167
     */
    o.vibrate = function() {
        o.callNative("vibrate");
    };



    /**
     * 8.1 生成指定区域截图
     * 新版互动课堂学生端 1.3.1.* 以上版本
     * 用于生成屏幕指定区域截图。
     */
    var screenShotDeffer = {};
    o.screenShot = function(option) {
        option = option || {};
        var defaultWidth = document.body.getBoundingClientRect().width;
        var defaultHeight = document.body.getBoundingClientRect().height;
        var screenShotTask = o.callNative("screenShot", {
            left: option.left || 0,
            top: option.top || 0,
            width: option.width || defaultWidth,
            height: option.height || defaultHeight,
            outputWidth: option.outputWidth || defaultWidth,
            outputHeight: option.outputHeight || defaultHeight,
            pageWidth: defaultWidth,
            pageHeight: defaultHeight,
            quality:option.quality||100
        });
        if (screenShotTask.taskId) {
            screenShotDeffer[screenShotTask.taskId] = $.Deferred();
            return screenShotDeffer[screenShotTask.taskId].promise();
        }else{
        	console.log(screenShotTask.reason);
        	var d = $.Deferred();
        	d.reject(screenShotTask.reason);
        	return d.promise();
        }

    };

    var screenShotHandle = function(data) {
        if (!data || !data.taskId) {
            ClassroomUtils.log("截屏数据为空");
            return;
        }
        var taskId = data.taskId;
        if (screenShotDeffer[taskId]) {
            var fileUrl = data.file || null;
            ClassroomUtils.log(taskId + "执行完成，文件路径为：" + fileUrl);
            screenShotDeffer[taskId].resolve(fileUrl);
            delete screenShotDeffer[data.taskId];
        } else {
            ClassroomUtils.log("不存在的taskId：" + data.taskId);
        }
    };
    if (isApp && Bridge && Bridge.registerListener) {
        Bridge.registerListener('ScreenShotCallback', screenShotHandle);
    }


    /**
     * 8.2 存储本地文件
     * 新版互动课堂学生端 1.3.1.* 以上版本
     * 用于将Base64转为本地文件数组.
     */
    var saveFileDeffer = {};
    o.saveFile = function(list) {
        var deffer = $.Deferred();
        if (!list) {
            this.log("传入参数为空");
            deffer.reject("传入参数为空");
        } else {
            if (!$.isArray(list)) {
                list = [list];
            }
            // 过滤前缀
            for (var i = 0; i < list.length; ++i) {
                if(list[i].indexOf(",") >= 0) {
                    list[i] = list[i].split(",")[1];
                }
            }
            var saveFileTask = o.callNative("saveFile", {
                data: list
            });
            if(saveFileTask.taskId){ 
           		 saveFileDeffer[saveFileTask.taskId] = deffer;
            }else{
            	deffer.reject(saveFileTask.reason);
            	console.log(saveFileTask.reason);
            }
        }
        return deffer.promise();
    };

    var saveFileHandle = function(data) {
        if (!data || !data.taskId) {
            ClassroomUtils.log("存储文件返回数据为空")
            deffer.reject("传入参数为空");
            return;
        }
        var taskId = data.taskId;
        if (saveFileDeffer[taskId]) {
            var files = data.files;
            ClassroomUtils.log(taskId + "执行完成");
            saveFileDeffer[taskId].resolve(files);
            delete saveFileDeffer[data.taskId];
        } else {
            ClassroomUtils.log("不存在的taskId：" + data.taskId);
        }
    };
    if (isApp && Bridge && Bridge.registerListener) {
        Bridge.registerListener('SaveFileCallback', saveFileHandle);
    }

    /**
     * 显示Native对话框，非Toast对话框
     * buttons:需要显示的按钮组成的数组
     * 每个按钮的格式:{
     *  style: 'default',
        target: 'native' / h5,  事件处理由native处理还是由h5处理
        html: "确定",           按钮显示的文本
        callback: 点击以后的回调
     }
     */
    o.showMessageBox = function(buttons, htmlText, img) {
        var data = {
            item: 'open',
            value: {
                html: htmlText || '',
                type: 'common',
                img: img || '',
                button: buttons
            }
        };
        o.callNative("showMessageBox", data);
    };
    /**
     * 显示Native格式Toast对话框
     * layout:对话框显示的位置,可选参数 'left','right','top','bottom','center'
     */
    o.showTipMessageBox = function(text, layout, donotHideMessageBox) {
        var data = {
            item: 'open',
            value: {
                text: text,
                type: 'gray',
                target: 'native',
                timeout: 3000,
                layout: layout || ['right', 'bottom'],
                donotHideMessageBox: donotHideMessageBox || false
            }
        };
        o.callNative("showMessageBox", data);
    };

    /**
     * 持久化接口
     * @param  {[string]} opType  [操作类型: saveOrUpdate-保存， query-查询, delete-删除，saveOrUpdateBatch-批量保存]
     * @param  {[Object]} opParam [操作参数]
     */
    o.persist = function(opType, opParam) {
        var options = {
            opType: opType,
            opParam: opParam
        };
        if (isApp && Bridge && Bridge.callNative) {
            return Bridge.callNative("com.nd.pad.icr.ui.IcrJsBridge",
                "persist", options);
        }
        return null;
    };

    /**
     * 获取生字图卡资源文件的路径
     */
    o.getFontCardResourcePath = function() {
        return o.callNative("getFontCardResourcePath");
    };

    /**
     * 结束收题接口
     */
    o.stopRecv = function() {
        return o.callNative("stopAcceptExam");
    };

    /**
     * 互动课堂动态学科工具菜单
     */

    /**
     * 添加一个按钮
     * buttonValue:按钮的描述信息，如下格式
     {
       sort:{int},         //位置顺序，（可选）
       buttonId:{string},  //按钮id，   (必选)
       text:{string},      //按钮文字  （必选）
       isPressed:{boolean},//按钮是否选中状态       （必选）
       normalIcon:{string},//按钮正常状态下的ICON   （必选）
       pressedIcon:{string},//按钮按下状态下的ICON  （必选）
       eventName:{string},  //点击按钮发送的事件名  （必选）
       eventData:{object}   //点击按钮发送的事件内容 （必选）
     }
     return  object  {result:true/false, message:{string}}
     */
    o.addSubjectToolButton = function(buttonValue) {
        var button = {
            button: buttonValue
        }
        return o.callNative("addSubjectToolButton", button);
    };

    /**
     * buttonArrayValue:多个按钮组成的数组
     * return  object  {result:true/false, message:{string}}
     */
    o.addSubjectToolButtons = function(buttonArrayValue) {
        var buttons = {
            buttons: buttonArrayValue
        }

        return o.callNative("addSubjectToolButtons", buttons);
    };

    /**
     * 删除一个按钮
     * buttonId:{string}  //按钮id，   (必选)}
     * return  object  {result:true/false, message:{string}}
     */
    o.removeSubjectToolButton = function(buttonId) {
        var options = {
            button: {
                buttonId: buttonId
            }
        }
        return o.callNative("removeSubjectToolButton", options);
    };

    /**
     * 删除多个按钮,传入参数为对象数组
     * [{buttonId:{string}}, {buttonId:{string}}]
     * return  object  {result:true/false, message:{string}}
     */
    o.removeSubjectToolButtons = function(buttonIdArray) {
        var options = {
            buttons: buttonIdArray
        }
        return o.callNative("removeSubjectToolButtons", options);
    };

    /**
     *  改变一个按钮的选中状态
     *  buttonValue{object} {   buttonId:{string},  //按钮id，       (必选)
                                isPressed:{boolean} //是否是选中状态 (必选)}
     return  object  {result:true/false, message:{string}}
     */
    o.setSubjectToolButtonState = function(buttonValue) {
        var options = {
            button: buttonValue
        }
        return o.callNative("setSubjectToolButtonState", options);
    };

    /**
     * 关闭界面上的native对话框
     */
    o.closeMessageBox = function() {
        return o.callNative("showMessageBox", {
            item: 'close'
        });
    };

    /**
     * 获取计时器
     */
    o.Timer = function() {
        var timer = {};
        timer.timerMap = {};
        timer.newTimer = function(setter) {
            if (!setter) {
                throw new Error("传入的dom元素不能为空");
            }
            var item = {
                dom: setter,
                startTime: null,
                id_timer: -1,
                latestTime: 0,
                period: 1,
                startSecond: 0
            };
            var id = o.uuid();
            timer.timerMap[id] = item;
            return id;
        };

        var isTimerIdCorrect = function(id) {
            return timer.timerMap[id] != undefined;
        };

        var getCurrentPeriod = function(timerId, startTime) {
            if (!isTimerIdCorrect(timerId)) {
                throw new Error("计时器ID不合法.");
            }
            var item = timer.timerMap[timerId];
            var currentTime = new Date();
            var currentPeriod = currentTime.getTime() - startTime + (item.startSecond * 1000);
            return currentPeriod;
        };

        /**
         * 停止计时器
         */
        timer.stop = function(timerId) {
            if (!isTimerIdCorrect(timerId)) {
                throw new Error("计时器ID不合法.");
            }
            var item = timer.timerMap[timerId];
            clearInterval(item.id_timer);
            item.id_timer = -1;
        };

        timer.start = function(timerId, startSecond, startTime) {
            if (!isTimerIdCorrect(timerId)) {
                throw new Error("计时器下标不合法.");
            }
            var item = timer.timerMap[timerId];
            item.startSecond = startSecond ? parseInt(startSecond) : 0;

            if (item.id_timer != -1) {
                timer.stop(timerId);
            }
            if (!startTime) {
                startTime = new Date().getTime();
                item.startTime = startTime;
            }
            var currentPeriod = getCurrentPeriod(timerId, startTime);
            item.dom.text(getTime(currentPeriod));
            item.id_timer = setInterval(function() {
                var currentPeriod = getCurrentPeriod(timerId, startTime);
                item.dom.text(getTime(currentPeriod));
            }, 1000);
            return startTime;
        };

        timer.update = function(timerId, value, isUseNetTimestamp) {
            if (!isTimerIdCorrect(timerId)) {
                throw new Error("计时器ID不合法.");
            }
            var item = timer.timerMap[timerId];
            if (isUseNetTimestamp) {
                timer.stop(timerId);
                item.dom.text(parseTime(value));
            } else {
                var item = timer.timerMap[timerId];
                var curTime = new Date();
                var delta;
                if (!item.startTime) {
                    if (value) {
                        delta = parseInt(value) * 1000;
                        item.startTime = curTime - delta;
                    } else {
                        delta = 0;
                        item.startTime = 0;
                    }
                } else {
                    delta = curTime - item.startTime;
                    timer.stop(timerId);
                }
                delta += item.startSecond * 1000;
                item.dom.text(getTime(delta));
            }
        };

        timer.stopAll = function() {
            for (var key in timer.timerMap) {
                var item = timer.timerMap[key];
                timer.stop(i);
            }
        };

        timer.startAll = function(startSecond, startTime) {
            for (var key in timer.timerMap) {
                var item = timer.timerMap[key];
                timer.start(key, startSecond, startTime);
            }
        };

        timer.updateAll = function(value) {
            for (var key in timer.timerMap) {
                var item = timer.timerMap[key];
                timer.update(key, value);
            }
        };

        var getLatestTime = function(timerId) {
            if (!isTimerIdCorrect(timerId)) {
                throw new Error("计时器ID不合法.");
            }
            var item = timer.timerMap[timerId];
            return item.latestTime;
        };

        /**
         * 获取计时器时间
         */
        var getTime = function(time) {
            if (time <= 0) {
                return "00:00";
            }
            var time = new Date(time);
            var minute = time.getMinutes();
            var second = time.getSeconds();
            if (minute < 10) {
                minute = "0" + minute;
            }
            if (second < 10) {
                second = "0" + second;
            }
            return minute + ":" + second;
        };

        var parseTime = function(time) {
            if (typeof(time) != "number") {
                return "00:00";
            }
            if (time <= 0) {
                return "00:00";
            }
            var hour = parseInt(time / 3600);
            var minute = parseInt((time / 60) % 60);
            var second = time % 60;
            if (second < 10) {
                second = "0" + second;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }

            if (hour < 1) {
                return minute + ":" + second;
            } else if (hour < 10) {
                return "0" + hour + ":" + minute + ":" + second;
            } else {
                return hour + ":" + minute + ":" + second;
            }
        };

        var setPeriod = function(timerId, period) {
            if (!isTimerIdCorrect(timerId)) {
                throw new Error("计时器ID不合法.");
            }
            var item = timer.timerMap[timerId];
            item.period = preiod;
        };

        timer.removeTimer = function(timerId) {
            var existTimer = timer.timerMap[timerId];
            if (existTimer) {
                delete timer.timerMap[timerId];
            }
        };

        /*
         * 数字转换成时间
         * 80秒转换成01:20
         */
        var valueToTime = function(time) {
            if (typeof(time) != "number") {
                return "00:00";
            }
            if (time <= 0) {
                return "00:00";
            }

            var hour = parseInt(time / 3600);
            var minute = parseInt((time / 60) % 60);
            var second = time % 60;
            if (second < 10) {
                second = "0" + second;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }

            if (hour < 1) {
                return minute + ":" + second;
            } else if (hour < 10) {
                return "0" + hour + ":" + minute + ":" + second;
            } else {
                return hour + ":" + minute + ":" + second;
            }
        };

        return timer;
    };

    /**
     * UUID生成
     */
    o.uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    return o;

})();
