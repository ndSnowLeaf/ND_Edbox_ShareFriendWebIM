import $ from '$';
import App from '../app/index.js';

/**
 * 动态图表启动器
 * 职责：1、负责创建一个vue实例，用于渲染统计图表的全部内容
 *      2、根据PC端提供的动态皮肤参数，装载皮肤包入口文件
 * 
 * @export
 * @class DynamicChartLauncher
 */
export default class DynamicChartLauncher {
  constructor() {
    this.service = null;
    this.container = null;
    this.statObj = null;
    this.app = null;
    this.skinCache = {};
    this.currentSkin = null;
    this.currentSkinName = '';
    this.isBindListener = false;
    this.parmas = {
      chartInfo: null, //当前皮肤信息 PC端提供
      lang: null
    };
    this.config = {
      workspace: '__DynamicDiagram'
    };
  }

  init(statisticService) {
    this.service = statisticService;
  }

  /**
   * 启动皮肤
   * 
   * @param {any} chartContainer
   * @param {any} convertedData
   * 
   * @memberOf DynamicChartLauncher
   */
  launch(chartContainer, statObj) {
    let service = this.service;
    this.lang = $.extend(true, {}, service.parent.langProperties);
    this.container = chartContainer, this.statObj = statObj;

    let _self = this;
    this.app = new App(chartContainer, this.statObj.convertedData, this.lang); //创建vue实例
    this.app.registerEvent("onSeeDetail", function(userId) { //处理点击查看详情事件
      var user_response,
        answers = _self.statObj.answers,
        a;
      for (var i = 0, len = answers.length; i < len; i++) {
        a = answers[i];
        if ($.inArray(userId, a.userIds) >= 0) {
          var ans = JSON.parse(a.answer);
          user_response = $.extend(true, [], ans["user_response"]);
          break;
        }
      }
      if (!!user_response) {
        var eventData = {
          studentAnswer: user_response,
          userId: userId
        };

        service.dispatchEvent("Event_SeeStudentAnswer", PresenterEventType.IC_PLAYER_EVENT, eventData);
      }
      var eventData = {
        service: "layout",
        method: "seeStudentAnswer"
      };
      service.dispatchEvent("statistics_call", PresenterEventType.IC_PLAYER_EVENT, eventData);
    });
    this._waitingLoadSkin();
    this.bindEvent();
  }

  bindEvent() {
    if (this.service && this.service.parent && !this.isBindListener) {
      //获取当前资源
      this.service.parent.$addEventListener("getCurrentChartCallback", PresenterEventType.NATIVE_EVENT, (eventData) => { //监听事件
        if (eventData && eventData.code == "0" || eventData.code == "-1") { //存在配置且配置的资源已经下载, 颗粒可开始加载
          if (eventData.data) {
            this._toggleSkinPanel(true);
            this.start(eventData.data);
          } else { 
            this._toggleSkinPanel(false);
          }
        } else if (eventData && eventData.code == "1") { //存在配置但资源还未下载, 颗粒需要进行等待
          this._toggleSkinPanel(true);
          this._waitingLoadSkin();
        } else if (eventData && (eventData.code == "2")) { //不存在配置或未知错误 ,颗粒使用默认图表
          this._toggleSkinPanel(false);
        }
      });
      //当前资源变更
      this.service.parent.$addEventListener("currentChartChanged", PresenterEventType.NATIVE_EVENT, (eventData) => { //监听事件
        if (eventData && eventData.data) { //当前有资源
          this._toggleSkinPanel(true);
          this._finishLoadSkin();
          this.start(eventData.data);
        }
      });
      this.isBindListener = true;
    }
  }

  /**
   * 隐藏皮肤容器
   * 
   * 
   * @memberOf DynamicChartLauncher
   */
  _toggleSkinPanel(show) {
    if (show) {
      this.app.$el.classList.remove("hide_dom");
    } else {
      this.app.$el.classList.add("hide_dom");
    }
  }

  /**
   * 等待加载皮肤
   * 
   * 
   * @memberOf DynamicChartLauncher
   */
  _waitingLoadSkin() {
    this.app.$el.classList.add("chart_wrap_loading");
  }

  _finishLoadSkin() {
    this.app.$el.classList.remove("chart_wrap_loading");
  }

  start(currentChartInfo) {

    this.parmas.chartInfo = currentChartInfo;

    $.getJSON(currentChartInfo.baseUrl + "/config.json", (config) => { //读取对应皮肤包的配置文件
      Midware.extendModuleRequire(config.name).then((clazz) => {
        if (this.currentSkin && this.currentSkin.running) { //先卸载当前正在运行的皮肤
          if (this.currentSkinName !== config.name) {
            Midware.extendModuleRelease(this.currentSkinName);
          }
          this.currentSkin.uninstall();
        }
        this.currentSkinName = config.name;
        this.app.hideStudentListPanel();
        if (!this.skinCache[this.currentSkinName]) {
          this.currentSkin = new clazz(config.classWrap);
          this.currentSkin['registerEvent'].call(this.currentSkin, this.onReceive.bind(this)); //注册来自皮肤资源的事件
          this.skinCache[this.currentSkinName] = this.currentSkin;
        } else {
          this.currentSkin = this.skinCache[this.currentSkinName];
        }
        let installOpt = {
          'chartContainer': this.app.$el,
          'data': this.statObj.convertedData,
          'chartInfo': currentChartInfo,
          'config': config,
          'lang': this.lang
        };
        this.currentSkin.install(installOpt);
        this.app.toggleTip(false);
        setTimeout(() => {
          this.currentSkin['startAnimation'].call(this.currentSkin);
        });
      });
    });
  }

  onReceive(type, data) {
    switch (type) {
      case 'ClickHistogram': //点击柱状图
        this.service.dispatchEvent("Event_SwitchToQuestion", PresenterEventType.IC_PLAYER_EVENT, {
          questionId: data.subquestionId,
          questionType: data.subquestionType
        });
        break;
      case 'FinishAnim': //动画执行完毕
        this.app.toggleTip(data);
        break;
      default:
        break;
    }
  }


  destory() {
    this.app && this.app.destroy(); //销毁实例
    this.container.innerHTML = ''; //删除容器下的所有dom元素
    this.currentSkin = null;
    this.currentSkinName = '';
  }
}